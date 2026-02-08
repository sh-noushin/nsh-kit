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
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import type { NshDialogConfig } from './dialog.types';
import { NshDialogRef } from './dialog-ref';

interface NshResolvedDialogConfig {
  ariaLabel: string | null;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
  width: string | null;
  maxWidth: string | null;
  disableScroll: boolean;
}

function resolveConfig(config: NshDialogConfig | null | undefined): NshResolvedDialogConfig {
  return {
    ariaLabel: config?.ariaLabel ?? null,
    closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
    closeOnEscape: config?.closeOnEscape ?? true,
    width: config?.width ?? null,
    maxWidth: config?.maxWidth ?? null,
    disableScroll: config?.disableScroll ?? true,
  };
}

function isFocusable(el: HTMLElement): boolean {
  if (el.tabIndex < 0) {
    return false;
  }
  if (el.hasAttribute('disabled')) {
    return false;
  }
  if (el.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  if (el.hasAttribute('hidden')) {
    return false;
  }
  return true;
}

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]';

@Component({
  selector: 'nsh-dialog-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [
    {
      provide: NshDialogContainerComponent,
      useExisting: NshDialogContainerComponent,
    },
  ],
  host: {
    '[class.nsh-dialog-container]': 'true',
  },
  template: `
    <div
      class="nsh-dialog-backdrop"
      aria-hidden="true"
      (click)="onBackdropClick()"
    ></div>

    <div
      #surface
      class="nsh-dialog-surface"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [style.--nsh-dialog-width]="resolvedConfig().width"
      [style.--nsh-dialog-max-width]="resolvedConfig().maxWidth"
      (keydown)="onKeydown($event)"
    >
      <div class="nsh-dialog-body">
        @if (contentTemplate(); as tpl) {
          <ng-container
            [ngTemplateOutlet]="tpl"
            [ngTemplateOutletContext]="templateContext()"
          ></ng-container>
        } @else {
          <ng-container #contentHost></ng-container>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      pointer-events: none;

      --nsh-dialog-backdrop-bg: var(--nsh-dialog-backdrop-bg, unset);
      --nsh-dialog-bg: var(--nsh-dialog-bg, unset);
      --nsh-dialog-fg: var(--nsh-dialog-fg, unset);
      --nsh-dialog-radius: var(--nsh-dialog-radius, unset);
      --nsh-dialog-shadow: var(--nsh-dialog-shadow, unset);
      --nsh-dialog-padding: var(--nsh-dialog-padding, unset);
      --nsh-dialog-width: var(--nsh-dialog-width, unset);
      --nsh-dialog-max-width: var(--nsh-dialog-max-width, unset);
      --nsh-dialog-title-size: var(--nsh-dialog-title-size, unset);
      --nsh-dialog-content-gap: var(--nsh-dialog-content-gap, unset);
      --nsh-dialog-actions-gap: var(--nsh-dialog-actions-gap, unset);
      --nsh-dialog-actions-padding-top: var(--nsh-dialog-actions-padding-top, unset);

      --_dlg-backdrop-bg: var(
        --nsh-dialog-backdrop-bg,
        color-mix(in srgb, var(--nsh-color-text) 35%, transparent)
      );
      --_dlg-bg: var(--nsh-dialog-bg, var(--nsh-color-surface-0));
      --_dlg-fg: var(--nsh-dialog-fg, var(--nsh-color-text));
      --_dlg-radius: var(--nsh-dialog-radius, var(--nsh-radius-lg));
      --_dlg-shadow: var(--nsh-dialog-shadow, var(--nsh-elevation-3));
      --_dlg-padding: var(--nsh-dialog-padding, var(--nsh-space-lg));
      --_dlg-width: var(--nsh-dialog-width, calc(var(--nsh-space-xl) * 18));
      --_dlg-max-width: var(--nsh-dialog-max-width, calc(var(--nsh-space-xl) * 24));
      --_dlg-title-size: var(--nsh-dialog-title-size, var(--nsh-font-size-xl));
      --_dlg-content-gap: var(--nsh-dialog-content-gap, var(--nsh-space-md));
      --_dlg-actions-gap: var(--nsh-dialog-actions-gap, var(--nsh-space-sm));
      --_dlg-actions-padding: var(--nsh-dialog-actions-padding-top, var(--nsh-space-md));
    }

    .nsh-dialog-backdrop {
      position: absolute;
      inset: 0;
      background: var(--_dlg-backdrop-bg);
      pointer-events: auto;
    }

    .nsh-dialog-surface {
      pointer-events: auto;
      position: relative;
      display: grid;
      width: var(--_dlg-width);
      max-width: var(--_dlg-max-width);
      padding: var(--_dlg-padding);
      border-radius: var(--_dlg-radius);
      background: var(--_dlg-bg);
      color: var(--_dlg-fg);
      box-shadow: var(--_dlg-shadow);
      font-family: var(--nsh-font-family);
      outline: none;
    }

    .nsh-dialog-surface:focus-visible {
      outline: calc(var(--nsh-space-xs) / 2) solid var(--nsh-color-outline);
      outline-offset: calc(var(--nsh-space-xs) / 2);
    }

    .nsh-dialog-body {
      display: grid;
      gap: var(--_dlg-content-gap);
      min-width: 0;
    }
  `,
})
export class NshDialogContainerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly envInjector = inject(EnvironmentInjector);

  readonly dialogRef = input.required<NshDialogRef<any>>();
  readonly config = input<NshDialogConfig | null>(null);
  readonly contentComponent = input<Type<any> | null>(null);
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);
  readonly componentInputs = input<Record<string, unknown> | null>(null);

  private readonly surfaceRef = viewChild.required<ElementRef<HTMLElement>>('surface');
  @ViewChild('contentHost', { read: ViewContainerRef })
  private contentHostRef?: ViewContainerRef;

  private contentRef: ComponentRef<unknown> | null = null;
  private lastFocused: HTMLElement | null = null;

  private readonly titleId = signal<string | null>(null);

  readonly resolvedConfig = computed(() => resolveConfig(this.config()));
  readonly ariaLabel = computed(() => this.resolvedConfig().ariaLabel ?? null);
  readonly ariaLabelledby = computed(() => (this.ariaLabel() ? null : this.titleId()));

  readonly templateContext = computed(() => {
    const ref = this.dialogRef();
    return { $implicit: ref, dialogRef: ref };
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
      this.dialogRef().close();
    };

    document.addEventListener('keydown', onDocumentKeydown, { capture: true });
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', onDocumentKeydown, { capture: true } as AddEventListenerOptions);
    });

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const surface = this.surfaceRef()?.nativeElement;
      if (!surface || !surface.contains(target)) {
        return;
      }

      if (isFocusable(target)) {
        this.lastFocused = target;
      }
    };

    document.addEventListener('focusin', onFocusIn);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('focusin', onFocusIn);
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
        providers: [{ provide: NshDialogRef, useValue: this.dialogRef() }],
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

  registerTitleId(id: string): void {
    this.titleId.set(id);
  }

  clearTitleId(id: string): void {
    if (this.titleId() !== id) {
      return;
    }

    this.titleId.set(null);
  }

  onBackdropClick(): void {
    if (!this.resolvedConfig().closeOnBackdropClick) {
      return;
    }

    this.dialogRef().close();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.trapFocus(event);
      return;
    }

    if (event.key !== 'Escape') {
      return;
    }

    if (!this.resolvedConfig().closeOnEscape) {
      return;
    }

    event.preventDefault();
    this.dialogRef().close();
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

    const focusables = this.getFocusableElements(surface);
    if (focusables.length > 0) {
      focusables[0].focus();
      return;
    }

    surface.focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const surface = this.surfaceRef()?.nativeElement;
    if (!surface) {
      return;
    }

    const focusables = this.getFocusableElements(surface);
    if (focusables.length === 0) {
      event.preventDefault();
      surface.focus();
      return;
    }

    const active =
      (document.activeElement as HTMLElement | null) ?? this.lastFocused ?? (event.target as HTMLElement | null);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeIndex = active ? focusables.indexOf(active) : -1;

    if (event.shiftKey) {
      event.preventDefault();

      if (activeIndex <= 0) {
        last.focus();
        return;
      }

      focusables[activeIndex - 1].focus();
      return;
    }

    event.preventDefault();

    if (activeIndex === -1 || activeIndex >= focusables.length - 1) {
      first.focus();
      return;
    }

    focusables[activeIndex + 1].focus();
  }

  private getFocusableElements(surface: HTMLElement): HTMLElement[] {
    return Array.from(surface.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusable);
  }
}
