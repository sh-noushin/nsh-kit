import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { NshBottomSheetRef } from './bottom-sheet-ref';
import { NSH_BOTTOM_SHEET_DATA } from './bottom-sheet.tokens';
import type { NshBottomSheetAutoFocusTarget, NshBottomSheetConfig } from './bottom-sheet.types';

interface NshResolvedBottomSheetConfig {
  ariaLabel: string | null;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
  disableScroll: boolean;
  width: string | null;
  maxWidth: string | null;
  maxHeight: string | null;
  autoFocus: NshBottomSheetAutoFocusTarget;
  data: unknown;
}

function resolveConfig(config: NshBottomSheetConfig | null | undefined): NshResolvedBottomSheetConfig {
  return {
    ariaLabel: config?.ariaLabel ?? null,
    closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
    closeOnEscape: config?.closeOnEscape ?? true,
    disableScroll: config?.disableScroll ?? true,
    width: config?.width ?? null,
    maxWidth: config?.maxWidth ?? null,
    maxHeight: config?.maxHeight ?? null,
    autoFocus: config?.autoFocus ?? 'first-tabbable',
    data: config?.data ?? null,
  };
}

function isFocusable(el: HTMLElement): boolean {
  if (el.tabIndex < 0) {
    return false;
  }
  if (el.hasAttribute('disabled') || el.hasAttribute('hidden')) {
    return false;
  }
  if (el.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  return true;
}

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]';
const HEADER_SELECTOR = '[role="heading"], h1, h2, h3, h4, h5, h6';

@Component({
  selector: 'nsh-bottom-sheet-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    '[class.nsh-bottom-sheet-container]': 'true',
  },
  template: `
    <div class="nsh-bottom-sheet-backdrop" aria-hidden="true" (click)="onBackdropClick()"></div>

    <section
      #surface
      class="nsh-bottom-sheet-surface"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      [attr.aria-label]="ariaLabel()"
      [style.--nsh-bottom-sheet-width]="resolvedConfig().width"
      [style.--nsh-bottom-sheet-max-width]="resolvedConfig().maxWidth"
      [style.--nsh-bottom-sheet-max-height]="resolvedConfig().maxHeight"
      (keydown)="onSurfaceKeydown($event)"
    >
      <div class="nsh-bottom-sheet-handle" aria-hidden="true"></div>
      <div class="nsh-bottom-sheet-body">
        @if (contentTemplate(); as tpl) {
          <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="templateContext()"></ng-container>
        } @else {
          <ng-container #contentHost></ng-container>
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      display: grid;
      align-items: end;
      pointer-events: none;

      --_bs-backdrop-bg: var(
        --nsh-bottom-sheet-backdrop-bg,
        rgb(15 23 42 / 0.44)
      );
      --_bs-bg: var(--nsh-bottom-sheet-bg, var(--nsh-color-surface-0, #fff));
      --_bs-fg: var(--nsh-bottom-sheet-fg, var(--nsh-color-text, #1f2533));
      --_bs-radius: var(--nsh-bottom-sheet-radius, 24px 24px 0 0);
      --_bs-shadow: var(--nsh-bottom-sheet-shadow, 0 -12px 36px rgb(15 23 42 / 0.28));
      --_bs-padding: var(--nsh-bottom-sheet-padding, 20px);
      --_bs-width: var(--nsh-bottom-sheet-width, 100%);
      --_bs-max-width: var(--nsh-bottom-sheet-max-width, 720px);
      --_bs-max-height: var(--nsh-bottom-sheet-max-height, min(82vh, 48rem));
    }

    .nsh-bottom-sheet-backdrop {
      position: absolute;
      inset: 0;
      pointer-events: auto;
      background: var(--_bs-backdrop-bg);
    }

    .nsh-bottom-sheet-surface {
      position: relative;
      pointer-events: auto;
      width: min(var(--_bs-width), 100%);
      max-width: var(--_bs-max-width);
      max-height: var(--_bs-max-height);
      margin-inline: auto;
      border-radius: var(--_bs-radius);
      background: var(--_bs-bg);
      color: var(--_bs-fg);
      box-shadow: var(--_bs-shadow);
      font-family: var(--nsh-font-family);
      outline: none;
      display: flex;
      flex-direction: column;
      transform-origin: bottom center;
      animation: nsh-bottom-sheet-enter var(--nsh-motion-duration-medium) var(--nsh-motion-easing-decelerate);
      justify-self: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--nsh-color-outline, #9aa7bf) 38%, transparent);
    }

    .nsh-bottom-sheet-surface:focus-visible {
      outline: 2px solid var(--nsh-color-outline, #9aa7bf);
      outline-offset: 2px;
    }

    .nsh-bottom-sheet-handle {
      width: 52px;
      height: 5px;
      border-radius: 9999px;
      background: color-mix(in srgb, var(--nsh-color-text, #1f2533) 22%, transparent);
      margin: 10px auto 0;
    }

    .nsh-bottom-sheet-body {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      padding: var(--_bs-padding);
      display: grid;
      gap: var(--nsh-space-md);
    }

    @keyframes nsh-bottom-sheet-enter {
      from {
        opacity: 0;
        transform: translateY(calc(var(--nsh-space-xl) * 1.2));
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
})
export class NshBottomSheetContainerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly envInjector = inject(EnvironmentInjector);

  readonly bottomSheetRef = input.required<NshBottomSheetRef<any>>();
  readonly config = input<NshBottomSheetConfig | null>(null);
  readonly contentComponent = input<Type<any> | null>(null);
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);
  readonly componentInputs = input<Record<string, unknown> | null>(null);

  private readonly surfaceRef = viewChild.required<ElementRef<HTMLElement>>('surface');

  @ViewChild('contentHost', { read: ViewContainerRef })
  private contentHostRef?: ViewContainerRef;

  private contentRef: ComponentRef<unknown> | null = null;

  readonly resolvedConfig = computed(() => resolveConfig(this.config()));
  readonly ariaLabel = computed(() => this.resolvedConfig().ariaLabel ?? null);

  readonly templateContext = computed(() => {
    const ref = this.bottomSheetRef();
    return { $implicit: ref, bottomSheetRef: ref };
  });

  constructor() {
    const onDocumentKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (!this.resolvedConfig().closeOnEscape) {
        return;
      }

      event.preventDefault();
      this.bottomSheetRef().dismiss();
    };

    document.addEventListener('keydown', onDocumentKeydown, { capture: true });
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', onDocumentKeydown, { capture: true } as AddEventListenerOptions);
    });

    effect(() => {
      const host = this.contentHostRef;
      const component = this.contentComponent();
      const template = this.contentTemplate();

      if (!host || template) {
        this.clearContent();
        this.scheduleInitialFocus();
        return;
      }

      if (!component) {
        this.clearContent();
        this.scheduleInitialFocus();
        return;
      }

      this.clearContent();

      const injector = Injector.create({
        parent: this.envInjector,
        providers: [
          { provide: NshBottomSheetRef, useValue: this.bottomSheetRef() },
          { provide: NSH_BOTTOM_SHEET_DATA, useValue: this.resolvedConfig().data ?? null },
        ],
      });

      const ref = host.createComponent(component, {
        environmentInjector: this.envInjector,
        injector,
      });

      this.contentRef = ref;
      this.applyComponentInputs();
      this.scheduleInitialFocus();
    });

    effect(() => {
      if (!this.contentRef) {
        return;
      }

      this.applyComponentInputs();
    });
  }

  onBackdropClick(): void {
    if (!this.resolvedConfig().closeOnBackdropClick) {
      return;
    }

    this.bottomSheetRef().dismiss();
  }

  onSurfaceKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.trapTabFocus(event);
      return;
    }

    if (event.key !== 'Escape') {
      return;
    }

    if (!this.resolvedConfig().closeOnEscape) {
      return;
    }

    event.preventDefault();
    this.bottomSheetRef().dismiss();
  }

  private applyComponentInputs(): void {
    if (!this.contentRef) {
      return;
    }

    const inputs = this.componentInputs() ?? {};
    for (const [key, value] of Object.entries(inputs)) {
      this.contentRef.setInput(key, value);
    }

    this.contentRef.changeDetectorRef.detectChanges();
  }

  private clearContent(): void {
    this.contentHostRef?.clear();
    this.contentRef = null;
  }

  private scheduleInitialFocus(): void {
    requestAnimationFrame(() => {
      this.focusInitial();
    });
  }

  private focusInitial(): void {
    const surface = this.surfaceRef()?.nativeElement;
    if (!surface) {
      return;
    }

    const autoFocus = this.resolvedConfig().autoFocus;
    if (autoFocus === false) {
      return;
    }

    if (autoFocus === 'dialog') {
      surface.focus({ preventScroll: true });
      return;
    }

    if (autoFocus === 'first-header') {
      const header = surface.querySelector<HTMLElement>(HEADER_SELECTOR);
      if (header) {
        this.focusElement(header);
        return;
      }
    }

    if (typeof autoFocus === 'string' && autoFocus !== 'first-tabbable' && autoFocus !== 'dialog') {
      const target = surface.querySelector<HTMLElement>(autoFocus);
      if (target) {
        this.focusElement(target);
        return;
      }
    }

    const focusables = this.getFocusableElements(surface);
    if (focusables.length > 0) {
      focusables[0].focus({ preventScroll: true });
      return;
    }

    surface.focus({ preventScroll: true });
  }

  private getFocusableElements(root: HTMLElement): HTMLElement[] {
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    return nodes.filter(isFocusable);
  }

  private trapTabFocus(event: KeyboardEvent): void {
    const surface = this.surfaceRef()?.nativeElement;
    if (!surface) {
      return;
    }

    const focusables = this.getFocusableElements(surface);
    if (focusables.length === 0) {
      event.preventDefault();
      surface.focus({ preventScroll: true });
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const isInside = !!active && surface.contains(active);

    if (event.shiftKey) {
      if (!isInside || active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      }
      return;
    }

    if (!isInside || active === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  private focusElement(el: HTMLElement): void {
    if (isFocusable(el)) {
      el.focus({ preventScroll: true });
      return;
    }

    const hadTabIndex = el.hasAttribute('tabindex');
    const previousTabIndex = el.getAttribute('tabindex');
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });

    if (!hadTabIndex) {
      el.removeAttribute('tabindex');
    } else if (previousTabIndex !== null) {
      el.setAttribute('tabindex', previousTabIndex);
    }
  }
}
