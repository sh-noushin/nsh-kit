import {
  ElementRef,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import type { NshOverlayRef } from '../../overlays/overlay-core/overlay-ref';
import { NshOverlayService } from '../../overlays/overlay-core/overlay.service';
import {
  NshSelectPanelComponent,
  type NshSelectPanelItem,
} from '../../overlays/select-panel/select-panel.component';
import { NshCvaControl } from '../cva/nsh-cva-control';
import {
  NSH_FORM_FIELD_CONTEXT,
  type NshFormFieldControlContext,
} from '../form-field/form-field.context';

import { NshOptionComponent } from './option.component';

export type NshSelectValue = string | number | null;

let nextSelectId = 0;

function serializeValue(value: string | number): string {
  return typeof value === 'number' ? `n:${value}` : `s:${value}`;
}

@Component({
  selector: 'nsh-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-select-host]': 'true',
    '[class.nsh-select-host--disabled]': 'effectiveDisabled()',
    '[class.nsh-select-host--placeholder]': 'isShowingPlaceholder()',
  },
  template: `
    <button
      #trigger
      nshFocusVisible
      class="nsh-select"
      type="button"
      [id]="effectiveId()"
      [attr.name]="name() ?? null"
      [disabled]="effectiveDisabled()"
      [attr.aria-disabled]="effectiveDisabled() ? 'true' : null"
      [attr.aria-required]="effectiveRequired() ? 'true' : null"
      [attr.aria-describedby]="effectiveDescribedBy()"
      [attr.aria-label]="effectiveAriaLabel()"
      role="combobox"
      aria-haspopup="listbox"
      [attr.aria-expanded]="isOpen() ? 'true' : 'false'"
      [attr.aria-controls]="isOpen() ? panelId() : null"
      [attr.aria-activedescendant]="isOpen() ? activeDescendantId() : null"
      (click)="onTriggerClick()"
      (keydown)="onTriggerKeydown($event)"
      (focus)="onTriggerFocus()"
      (blur)="onTriggerBlur()"
    >
      <span class="nsh-select__value">{{ displayedLabel() }}</span>
    </button>

    <span class="nsh-select__options" aria-hidden="true">
      <ng-content />
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;

      /* Component override surface */
      --nsh-select-height: var(--nsh-select-height, unset);
      --nsh-select-padding-x: var(--nsh-select-padding-x, unset);
      --nsh-select-radius: var(--nsh-select-radius, unset);
      --nsh-select-bg: var(--nsh-select-bg, unset);
      --nsh-select-fg: var(--nsh-select-fg, unset);
      --nsh-select-placeholder-color: var(--nsh-select-placeholder-color, unset);
      --nsh-select-border-color: var(--nsh-select-border-color, unset);
      --nsh-select-border-color-focus: var(--nsh-select-border-color-focus, unset);
      --nsh-select-focus-ring: var(--nsh-select-focus-ring, unset);

      --_sel-height: var(--nsh-select-height, var(--nsh-density-control-height));
      --_sel-pad-x: var(--nsh-select-padding-x, var(--nsh-density-padding-inline));
      --_sel-radius: var(--nsh-select-radius, var(--nsh-radius-md));

      --_sel-bg: var(--nsh-select-bg, var(--nsh-color-surface));
      --_sel-fg: var(--nsh-select-fg, var(--nsh-color-text));
      --_sel-placeholder: var(--nsh-select-placeholder-color, var(--nsh-color-text-muted));

      --_sel-border: var(--nsh-select-border-color, var(--nsh-color-outline));
      --_sel-border-focus: var(--nsh-select-border-color-focus, var(--nsh-color-primary));

      --_sel-focus-ring: var(
        --nsh-select-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_sel-border-width: var(--nsh-select-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_sel-focus-width: var(--nsh-select-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    .nsh-select {
      width: 100%;
      min-width: 0;
      min-height: var(--_sel-height);
      padding-inline: var(--_sel-pad-x);

      border-radius: var(--_sel-radius);
      border: var(--_sel-border-width) solid var(--_sel-border);
      background: var(--_sel-bg);
      color: var(--_sel-fg);

      font-family: var(--nsh-font-family);
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);

      transition:
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);

      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      cursor: pointer;
    }

    :host(.nsh-select-host--placeholder) .nsh-select {
      color: var(--_sel-placeholder);
    }

    .nsh-select:focus {
      outline: none;
    }

    .nsh-select.nsh-focus-visible,
    .nsh-select:focus-visible {
      border-color: var(--_sel-border-focus);
      box-shadow: 0 0 0 var(--_sel-focus-width) var(--_sel-focus-ring);
    }

    .nsh-select__options {
      display: none;
    }

    :host(.nsh-select-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshSelectComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  private readonly overlay = inject(NshOverlayService);

  private readonly triggerEl = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  private readonly cva = new NshCvaControl<string | number>();

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string | null>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly autoId = `nsh-select-${nextSelectId++}`;

  private readonly hasUserAriaLabel = computed(() => {
    const v = this.ariaLabel();
    return v !== null && v.trim().length > 0;
  });

  private readonly optionsQuery = contentChildren(NshOptionComponent);
  readonly options = computed(() => this.optionsQuery());

  readonly effectiveId = computed(() => this.field?.controlId?.() ?? this.autoId);

  readonly effectiveDescribedBy = computed(() => this.field?.describedByIds?.() ?? null);

  readonly effectiveDisabled = computed(() => {
    const parent = this.field?.disabled?.() ?? false;
    return this.disabled() || parent || this.cva.disabled();
  });

  readonly effectiveRequired = computed(() => {
    const parent = this.field?.required?.() ?? false;
    return this.required() || parent;
  });

  readonly effectiveAriaLabel = computed(() => {
    if (this.hasUserAriaLabel()) {
      return this.ariaLabel();
    }

    // Prefer association with <label for="..."> from nsh-form-field.
    return null;
  });

  readonly renderedOptions = computed(() => {
    return this.options().map((opt) => {
      const v = opt.value();
      return {
        key: serializeValue(v),
        value: v,
        disabled: opt.disabled(),
        label: opt.label(),
      };
    });
  });

  private readonly items = computed<ReadonlyArray<NshSelectPanelItem>>(() => {
    return this.renderedOptions().map((opt) => ({
      key: opt.key,
      label: opt.label,
      disabled: opt.disabled,
      rawValue: opt.value,
    }));
  });

  readonly selectedKey = computed(() => {
    const value = this.cva.value();
    return value === null ? null : serializeValue(value);
  });

  readonly displayedLabel = computed(() => {
    const value = this.cva.value();
    if (value === null) {
      return this.placeholder() ?? '';
    }

    const key = serializeValue(value);
    const match = this.renderedOptions().find((o) => o.key === key);
    return match?.label ?? '';
  });

  readonly isShowingPlaceholder = computed(() => {
    const placeholder = this.placeholder();
    if (placeholder === null) {
      return false;
    }
    return this.cva.value() === null;
  });

  readonly panelId = computed(() => `${this.effectiveId()}-panel`);

  private readonly open = signal(false);

  private readonly overlayRef = signal<NshOverlayRef<NshSelectPanelComponent> | null>(null);

  private readonly activeIndex = signal<number | null>(null);

  readonly isOpen = computed(() => this.open() && !this.effectiveDisabled());

  readonly activeDescendantId = computed(() => {
    const index = this.activeIndex();
    if (index === null) {
      return null;
    }
    return `${this.panelId()}-opt-${index}`;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.overlayRef()?.close();
      this.overlayRef.set(null);
      this.open.set(false);
    });

    effect(() => {
      if (this.multiple()) {
        throw new Error('nsh-select v1 does not support multiple=true yet.');
      }
    });

    effect(() => {
      if (this.effectiveDisabled()) {
        this.closePanel();
      }
    });

    effect(() => {
      if (!this.isOpen()) {
        this.activeIndex.set(null);
        return;
      }

      if (this.activeIndex() !== null) {
        return;
      }

      const items = this.items();
      const selectedKey = this.selectedKey();
      const selectedIndex = selectedKey ? items.findIndex((i) => i.key === selectedKey) : -1;
      if (selectedIndex >= 0 && !items[selectedIndex]?.disabled) {
        this.activeIndex.set(selectedIndex);
        return;
      }

      this.activeIndex.set(this.firstEnabledIndex(items));
    });

    effect(() => {
      const shouldBeOpen = this.isOpen();
      const ref = this.overlayRef();

      if (shouldBeOpen) {
        if (ref) {
          return;
        }

        const anchor = this.triggerEl()?.nativeElement;
        if (!anchor) {
          return;
        }

        const nextRef = this.overlay.attachComponent(NshSelectPanelComponent, {
          anchor,
          closeOnOutsidePointerDown: true,
          closeOnEscape: true,
          matchWidth: true,
          panelClass: 'nsh-select-overlay',
        });

        this.overlayRef.set(nextRef);
        return;
      }

      if (ref) {
        ref.close();
        this.overlayRef.set(null);
      }
    });

    effect((onCleanup) => {
      const ref = this.overlayRef();
      if (!ref) {
        return;
      }

      const subHovered = ref.componentRef.instance.itemHovered.subscribe((index) => {
        const item = this.items()[index];
        if (!item || item.disabled) {
          return;
        }
        this.activeIndex.set(index);
      });

      const subSelected = ref.componentRef.instance.itemSelected.subscribe((item) => {
        this.selectItem(item);
      });

      onCleanup(() => {
        subHovered.unsubscribe();
        subSelected.unsubscribe();
      });
    });

    effect(() => {
      const ref = this.overlayRef();
      if (!ref) {
        return;
      }

      if (ref.closed()) {
        this.overlayRef.set(null);
        this.closePanel();
        return;
      }

      ref.componentRef.setInput('items', this.items());
      ref.componentRef.setInput('activeIndex', this.activeIndex() ?? -1);
      ref.componentRef.setInput('selectedKey', this.selectedKey());
      ref.componentRef.setInput('ariaLabel', 'Options');
      ref.componentRef.setInput('panelId', this.panelId());

      ref.componentRef.changeDetectorRef.detectChanges();
    });
  }

  private firstEnabledIndex(items: ReadonlyArray<NshSelectPanelItem>): number | null {
    for (let i = 0; i < items.length; i++) {
      if (!items[i]?.disabled) {
        return i;
      }
    }
    return null;
  }

  private lastEnabledIndex(items: ReadonlyArray<NshSelectPanelItem>): number | null {
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i]?.disabled) {
        return i;
      }
    }
    return null;
  }

  private nextEnabledIndex(direction: 1 | -1): number | null {
    const items = this.items();
    if (items.length === 0) {
      return null;
    }

    const current = this.activeIndex();
    const startIndex = current === null ? (direction === 1 ? -1 : 0) : current;

    let i = startIndex;
    for (let step = 0; step < items.length; step++) {
      i = (i + direction + items.length) % items.length;
      const it = items[i];
      if (it && !it.disabled) {
        return i;
      }
    }

    return null;
  }

  writeValue(value: NshSelectValue): void {
    this.cva.writeValue(value);
  }

  registerOnChange(fn: (value: NshSelectValue) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  onTriggerClick(): void {
    if (this.effectiveDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.openPanel();
      }
      const next = this.nextEnabledIndex(1) ?? this.firstEnabledIndex(this.items());
      this.activeIndex.set(next);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.openPanel();
      }
      const next = this.nextEnabledIndex(-1) ?? this.lastEnabledIndex(this.items());
      this.activeIndex.set(next);
      return;
    }

    if (event.key === 'Home') {
      if (!this.isOpen()) {
        return;
      }
      event.preventDefault();
      this.activeIndex.set(this.firstEnabledIndex(this.items()));
      return;
    }

    if (event.key === 'End') {
      if (!this.isOpen()) {
        return;
      }
      event.preventDefault();
      this.activeIndex.set(this.lastEnabledIndex(this.items()));
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.openPanel();
        return;
      }

      const index = this.activeIndex();
      if (index === null) {
        return;
      }
      const item = this.items()[index];
      if (!item || item.disabled) {
        return;
      }
      this.selectItem(item);
      return;
    }
  }

  onTriggerFocus(): void {
  }

  onTriggerBlur(): void {
    this.closePanel();
    this.cva.markTouched();
  }

  private openPanel(): void {
    if (this.effectiveDisabled()) {
      return;
    }
    this.open.set(true);
  }

  private closePanel(): void {
    this.open.set(false);
  }

  private selectItem(item: NshSelectPanelItem): void {
    if (this.effectiveDisabled() || item.disabled) {
      return;
    }
    this.cva.setValueFromUI(item.rawValue);
    this.closePanel();
    this.triggerEl()?.nativeElement.focus();
  }
}
