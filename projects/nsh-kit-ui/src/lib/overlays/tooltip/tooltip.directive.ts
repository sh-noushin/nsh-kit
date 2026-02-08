import {
  DestroyRef,
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import type { NshOverlayRef } from '../overlay-core/overlay-ref';
import { NshOverlayService } from '../overlay-core/overlay.service';
import { NshTooltipPanelComponent } from './tooltip-panel/tooltip-panel.component';

export type NshTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

let nextTooltipInstanceId = 0;

function trimToNull(value: string | null): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
}

function splitDescribedBy(value: string | null): string[] {
  return (value ?? '')
    .split(/\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function joinDescribedBy(parts: string[]): string | null {
  const value = parts.join(' ').trim();
  return value.length > 0 ? value : null;
}

@Directive({
  selector: '[nshTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class NshTooltipDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(NshOverlayService);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly nshTooltip = input<string | null>(null);
  readonly disabled = input(false, {
    alias: 'nshTooltipDisabled',
    transform: booleanAttribute,
  });
  readonly position = input<NshTooltipPosition>('top', { alias: 'nshTooltipPosition' });
  readonly showDelay = input(300, { alias: 'nshTooltipShowDelay' });
  readonly hideDelay = input(100, { alias: 'nshTooltipHideDelay' });
  readonly maxWidth = input<string | null>(null, { alias: 'nshTooltipMaxWidth' });
  readonly ariaDescription = input<string | null>(null, { alias: 'nshTooltipAriaDescription' });

  private readonly instanceId = `nsh-tooltip-${nextTooltipInstanceId++}`;

  private readonly overlayRef = signal<NshOverlayRef<NshTooltipPanelComponent> | null>(null);
  private readonly tooltipId = signal<string | null>(null);

  private showTimer: number | null = null;
  private hideTimer: number | null = null;

  private readonly isHovering = signal(false);
  private readonly isFocused = signal(false);
  private readonly dismissed = signal(false);

  private readonly effectiveText = computed(() => trimToNull(this.nshTooltip()));
  private readonly isEnabled = computed(() => !this.disabled() && !!this.effectiveText());
  private readonly wantsVisible = computed(
    () => this.isEnabled() && !this.dismissed() && (this.isHovering() || this.isFocused()),
  );

  private readonly restoreAriaDescribedBy = signal<string | null>(null);

  private removeScrollListeners: (() => void) | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearTimers();
      this.closeNow({ restoreAria: true });
    });

    effect(() => {
      if (!this.wantsVisible()) {
        this.scheduleHide();
        return;
      }

      this.scheduleShow();
    });

    effect(() => {
      const ref = this.overlayRef();
      if (!ref) {
        return;
      }

      const text = this.effectiveText();
      if (!text) {
        this.closeNow({ restoreAria: true });
        return;
      }

      ref.componentRef.setInput('text', text);
      ref.componentRef.setInput('maxWidth', this.maxWidth());
      ref.componentRef.setInput('ariaLabel', trimToNull(this.ariaDescription()));
      ref.componentRef.changeDetectorRef.detectChanges();
    });
  }

  onMouseEnter(): void {
    this.isHovering.set(true);
    this.dismissed.set(false);
  }

  onMouseLeave(): void {
    this.isHovering.set(false);
    this.dismissed.set(false);
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.dismissed.set(false);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.dismissed.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    if (!this.overlayRef()) {
      return;
    }

    event.preventDefault();
    this.dismissed.set(true);
    this.clearTimers();
    this.closeNow({ restoreAria: true });
  }

  private scheduleShow(): void {
    this.clearHideTimer();

    if (this.overlayRef() || this.showTimer !== null) {
      return;
    }

    const delay = Math.max(0, this.showDelay());
    if (delay === 0) {
      this.openNow();
      return;
    }

    this.showTimer = window.setTimeout(() => {
      this.showTimer = null;
      if (!this.wantsVisible()) {
        return;
      }

      this.openNow();
    }, delay);
  }

  private scheduleHide(): void {
    this.clearShowTimer();

    if (!this.overlayRef() || this.hideTimer !== null) {
      return;
    }

    const delay = Math.max(0, this.hideDelay());
    if (delay === 0) {
      this.closeNow({ restoreAria: true });
      return;
    }

    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = null;
      if (this.wantsVisible()) {
        return;
      }

      this.closeNow({ restoreAria: true });
    }, delay);
  }

  private openNow(): void {
    if (this.overlayRef() || !this.isEnabled()) {
      return;
    }

    const text = this.effectiveText();
    if (!text) {
      return;
    }

    const anchor = this.elRef.nativeElement;

    const ref = this.overlay.attachComponent(NshTooltipPanelComponent, {
      anchor,
      matchWidth: false,
      closeOnOutsidePointerDown: false,
      closeOnEscape: false,
      panelClass: 'nsh-tooltip-overlay',
      placement: this.position(),
      clampToViewport: true,
      zIndex: 'var(--nsh-z-tooltip)',
    });

    const panelId = `${this.instanceId}-panel`;
    ref.componentRef.setInput('panelId', panelId);

    ref.componentRef.setInput('text', text);
    ref.componentRef.setInput('maxWidth', this.maxWidth());
    ref.componentRef.setInput('ariaLabel', trimToNull(this.ariaDescription()));

    ref.componentRef.changeDetectorRef.detectChanges();

    this.overlayRef.set(ref);
    this.tooltipId.set(panelId);
    this.applyAriaDescribedBy(panelId);

    this.installCloseOnScrollResize();
  }

  private closeNow(opts: { restoreAria: boolean }): void {
    this.clearScrollListeners();

    const ref = this.overlayRef();
    if (ref) {
      ref.close();
    }

    this.overlayRef.set(null);

    if (opts.restoreAria) {
      this.removeAriaDescribedBy();
    }

    this.tooltipId.set(null);
  }

  private applyAriaDescribedBy(tooltipId: string): void {
    const host = this.elRef.nativeElement;

    const current = host.getAttribute('aria-describedby');
    this.restoreAriaDescribedBy.set(current);

    const parts = splitDescribedBy(current);
    if (!parts.includes(tooltipId)) {
      parts.push(tooltipId);
    }

    const joined = joinDescribedBy(parts);
    if (joined) {
      host.setAttribute('aria-describedby', joined);
    } else {
      host.removeAttribute('aria-describedby');
    }
  }

  private removeAriaDescribedBy(): void {
    const host = this.elRef.nativeElement;
    const tooltipId = this.tooltipId();

    if (!tooltipId) {
      return;
    }

    const current = host.getAttribute('aria-describedby');
    const parts = splitDescribedBy(current).filter((x) => x !== tooltipId);

    const joined = joinDescribedBy(parts);
    if (joined) {
      host.setAttribute('aria-describedby', joined);
      return;
    }

    const original = this.restoreAriaDescribedBy();
    if (original) {
      host.setAttribute('aria-describedby', original);
    } else {
      host.removeAttribute('aria-describedby');
    }

    this.restoreAriaDescribedBy.set(null);
  }

  private installCloseOnScrollResize(): void {
    this.clearScrollListeners();

    const close = () => {
      this.dismissed.set(true);
      this.clearTimers();
      this.closeNow({ restoreAria: true });
    };

    const onScroll = () => close();
    const onResize = () => close();

    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    this.removeScrollListeners = () => {
      window.removeEventListener('scroll', onScroll, { capture: true } as AddEventListenerOptions);
      window.removeEventListener('resize', onResize);
    };
  }

  private clearScrollListeners(): void {
    this.removeScrollListeners?.();
    this.removeScrollListeners = null;
  }

  private clearTimers(): void {
    this.clearShowTimer();
    this.clearHideTimer();
  }

  private clearShowTimer(): void {
    if (this.showTimer === null) {
      return;
    }

    clearTimeout(this.showTimer);
    this.showTimer = null;
  }

  private clearHideTimer(): void {
    if (this.hideTimer === null) {
      return;
    }

    clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }
}
