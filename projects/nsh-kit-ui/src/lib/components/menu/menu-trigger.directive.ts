import {
  DestroyRef,
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import type { NshOverlayRef } from '../../overlays/overlay-core/overlay-ref';
import { NshOverlayService } from '../../overlays/overlay-core/overlay.service';
import { NshMenuPanelComponent } from '../../overlays/menu-panel/menu-panel.component';
import type { NshMenuCloseReason } from '../../overlays/menu-panel/menu-panel.types';

import { NshMenuComponent } from './menu.component';

let nextPanelId = 0;

@Directive({
  selector: '[nshMenuTriggerFor]',
  standalone: true,
  host: {
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'isOpen() ? "true" : "false"',
    '[attr.aria-controls]': 'isOpen() ? panelId() : null',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class NshMenuTriggerForDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(NshOverlayService);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly nshMenuTriggerFor = input.required<NshMenuComponent>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly menuOpened = output<void>();
  readonly menuClosed = output<void>();

  private readonly open = signal(false);
  private readonly overlayRef = signal<NshOverlayRef<NshMenuPanelComponent> | null>(null);
  private readonly panelIdSig = signal<string | null>(null);

  readonly panelId = computed(() => this.panelIdSig());
  readonly isOpen = computed(() => this.open() && !this.disabled() && this.overlayRef() !== null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.overlayRef()?.close();
      this.overlayRef.set(null);
      this.panelIdSig.set(null);
      this.open.set(false);
    });

    effect(() => {
      if (this.disabled()) {
        this.close({ focusTrigger: false, reason: 'programmatic' });
      }
    });

    effect(() => {
      const menu = this.nshMenuTriggerFor();
      // Touch menu inputs to ensure reactivity in other effects.
      void menu.ariaLabel();
      void menu.width();
      void menu.closeOnItemClick();
    });

    effect((onCleanup) => {
      const ref = this.overlayRef();
      if (!ref) {
        return;
      }

      const sub = ref.componentRef.instance.closeRequested.subscribe((reason) => {
        this.close({
          focusTrigger: reason === 'escape' || reason === 'item',
          reason,
        });
      });

      onCleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const ref = this.overlayRef();
      if (!ref) {
        return;
      }

      if (ref.closed()) {
        // Closed by outside click; keep focus as-is.
        this.overlayRef.set(null);
        this.panelIdSig.set(null);
        this.open.set(false);
        this.menuClosed.emit();

        return;
      }

      const menu = this.nshMenuTriggerFor();
      ref.componentRef.setInput('template', menu.template());
      ref.componentRef.setInput('ariaLabel', menu.ariaLabel());
      ref.componentRef.setInput('closeOnItemClick', menu.closeOnItemClick());
      ref.componentRef.setInput('width', menu.width());

      ref.componentRef.changeDetectorRef.detectChanges();
    });
  }

  private openAndMaybeFocusFirst(focusFirst: boolean): void {
    if (this.disabled() || this.overlayRef()) {
      return;
    }

    const menu = this.nshMenuTriggerFor();
    const anchor = this.elRef.nativeElement;
    const matchWidth = menu.width() === null;

    const nextRef = this.overlay.attachComponent(NshMenuPanelComponent, {
      anchor,
      closeOnOutsidePointerDown: true,
      closeOnEscape: false,
      matchWidth,
      panelClass: 'nsh-menu-overlay',
    });

    const id = `nsh-menu-panel-${nextPanelId++}`;
    nextRef.componentRef.setInput('panelId', id);
    nextRef.componentRef.setInput('autoFocus', focusFirst);

    this.panelIdSig.set(id);
    this.overlayRef.set(nextRef);
    this.open.set(true);
    this.menuOpened.emit();
  }

  private close(opts: { focusTrigger: boolean; reason: NshMenuCloseReason }): void {
    const ref = this.overlayRef();
    if (!ref) {
      return;
    }

    this.open.set(false);
    this.panelIdSig.set(null);

    ref.close();
    this.overlayRef.set(null);
    this.menuClosed.emit();

    if (opts.focusTrigger) {
      this.elRef.nativeElement.focus();
    }
  }

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    if (this.overlayRef()) {
      this.close({ focusTrigger: false, reason: 'programmatic' });
    } else {
      this.openAndMaybeFocusFirst(false);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key === 'Escape') {
      if (!this.isOpen()) {
        return;
      }

      event.preventDefault();
      this.close({ focusTrigger: true, reason: 'escape' });
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openAndMaybeFocusFirst(true);
      return;
    }
  }
}
