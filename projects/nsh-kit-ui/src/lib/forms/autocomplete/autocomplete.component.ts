import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import { NshAutocompletePanelComponent } from '../../overlays/autocomplete-panel/autocomplete-panel.component';
import { NshOverlayService } from '../../overlays/overlay-core/overlay.service';
import type { NshOverlayRef } from '../../overlays/overlay-core/overlay-ref';
import { NshCvaControl } from '../cva/nsh-cva-control';
import {
  NSH_FORM_FIELD_CONTEXT,
  type NshFormFieldControlContext,
} from '../form-field/form-field.context';

import type { NshAutocompleteItem } from './autocomplete.types';

export type NshAutocompleteFilterMode = 'contains' | 'startsWith';

let nextAutocompleteId = 0;

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function coerceMinChars(value: number): number {
  const v = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.floor(v));
}

@Component({
  selector: 'nsh-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshAutocompleteComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-ac-host]': 'true',
    '[class.nsh-ac-host--open]': 'isOpen()',
    '[class.nsh-ac-host--disabled]': 'effectiveDisabled()',
  },
  template: `
    <div class="nsh-ac">
      <input
        #native
        nshFocusVisible
        class="nsh-ac__input"
        type="text"
        [id]="effectiveId()"
        [value]="query()"
        [placeholder]="placeholder()"
        [disabled]="effectiveDisabled()"
        [required]="effectiveRequired()"
        [attr.aria-label]="effectiveAriaLabel()"
        [attr.aria-describedby]="effectiveDescribedBy()"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="isOpen() ? 'true' : 'false'"
        [attr.aria-controls]="isOpen() ? panelId() : null"
        [attr.aria-activedescendant]="isOpen() ? activeDescendantId() : null"
        (focus)="onInputFocus()"
        (blur)="onInputBlur()"
        (input)="onInput($event)"
        (keydown)="onInputKeydown($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;

      --_ac-height: var(--nsh-ac-height, var(--nsh-density-control-height));
      --_ac-pad-x: var(--nsh-ac-padding-x, var(--nsh-density-padding-inline));
      --_ac-radius: var(--nsh-ac-radius, var(--nsh-radius-md));

      --_ac-bg: var(--nsh-ac-bg, var(--nsh-color-surface));
      --_ac-fg: var(--nsh-ac-fg, var(--nsh-color-text));
      --_ac-placeholder: var(--nsh-ac-placeholder-color, var(--nsh-color-text-muted));

      --_ac-border: var(--nsh-ac-border-color, var(--nsh-color-border));
      --_ac-border-focus: var(--nsh-ac-border-color-focus, var(--nsh-color-outline));
      --_ac-focus-ring: var(
        --nsh-ac-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_ac-panel-bg: var(--nsh-ac-panel-bg, var(--nsh-color-surface-1));
      --_ac-panel-border: var(--nsh-ac-panel-border-color, var(--nsh-color-border));
      --_ac-panel-shadow: var(--nsh-ac-panel-shadow, var(--nsh-elevation-2));
      --_ac-panel-max-height: var(--nsh-ac-panel-max-height, none);

      --_ac-opt-pad-y: var(--nsh-ac-option-padding-y, var(--nsh-density-padding-block));
      --_ac-opt-pad-x: var(--nsh-ac-option-padding-x, var(--nsh-density-padding-inline));
      --_ac-opt-hover: var(
        --nsh-ac-option-hover-bg,
        color-mix(in srgb, var(--nsh-color-outline) 14%, transparent)
      );
      --_ac-opt-active: var(
        --nsh-ac-option-active-bg,
        color-mix(in srgb, var(--nsh-color-outline) 22%, transparent)
      );
      --_ac-opt-disabled-fg: var(--nsh-ac-option-disabled-fg, var(--nsh-color-text-disabled));

      --_ac-focus-width: var(--nsh-space-xxs, var(--nsh-space-xs));
      --_ac-border-width: var(--nsh-space-xxs, var(--nsh-space-xs));
    }

    .nsh-ac {
      width: 100%;
      position: relative;
      min-width: 0;
      font-family: var(--nsh-font-family);
    }

    .nsh-ac__input {
      width: 100%;
      height: var(--_ac-height);

      padding-inline: var(--_ac-pad-x);
      padding-block: var(--nsh-density-padding-block);

      border-radius: var(--_ac-radius);
      border: var(--_ac-border-width) solid var(--_ac-border);
      background: var(--_ac-bg);
      color: var(--_ac-fg);

      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);

      transition:
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-ac__input::placeholder {
      color: var(--_ac-placeholder);
    }

    .nsh-ac__input:focus {
      outline: none;
    }

    .nsh-ac__input.nsh-focus-visible,
    .nsh-ac__input:focus-visible {
      border-color: var(--_ac-border-focus);
      box-shadow: 0 0 0 var(--_ac-focus-width) var(--_ac-focus-ring);
    }

    :host(.nsh-ac-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshAutocompleteComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(NshOverlayService);

  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  private readonly cva = new NshCvaControl<any>();

  readonly items = input<ReadonlyArray<NshAutocompleteItem<any>>>([]);
  readonly placeholder = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly minChars = input(0);
  readonly filterMode = input<NshAutocompleteFilterMode>('contains');
  readonly noResultsText = input('No results');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly optionSelected = output<NshAutocompleteItem<any>>();

  private readonly autoId = `nsh-ac-${nextAutocompleteId++}`;

  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>('native');

  private readonly overlayRef = signal<NshOverlayRef<NshAutocompletePanelComponent> | null>(null);

  private readonly hasUserAriaLabel = computed(() => {
    const label = this.ariaLabel();
    return label !== null && label.trim().length > 0;
  });

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

  readonly panelId = computed(() => `${this.effectiveId()}-panel`);

  private readonly queryText = signal('');

  /**
   * Spec note: if the user edits the text after a selection, the CVA value remains the last selected
   * value until a new option is selected.
   */
  private readonly syncQueryFromValue = signal(true);

  readonly query = computed(() => this.queryText());

  private readonly focused = signal(false);
  private readonly open = signal(false);

  private readonly minCharsValue = computed(() => coerceMinChars(this.minChars()));

  private readonly normalizedQuery = computed(() => normalizeText(this.query()));

  private readonly meetsMinChars = computed(() => this.normalizedQuery().length >= this.minCharsValue());

  readonly filteredItems = computed(() => {
    if (!this.meetsMinChars()) {
      return [];
    }

    const q = this.normalizedQuery();
    const mode = this.filterMode();

    if (q.length === 0) {
      return this.items().slice();
    }

    return this.items().filter((item) => {
      const label = normalizeText(item.label);
      if (mode === 'startsWith') {
        return label.startsWith(q);
      }
      return label.includes(q);
    });
  });

  private readonly activeIndex = signal<number | null>(null);

  readonly activeDescendantId = computed(() => {
    const index = this.activeIndex();
    if (index === null) {
      return null;
    }
    return this.optionId(index);
  });

  readonly isOpen = computed(() => {
    return this.open() && this.focused() && this.meetsMinChars() && !this.effectiveDisabled();
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.syncQueryFromValue()) {
        return;
      }

      const value = this.cva.value();
      const match = this.items().find((it) => Object.is(it.value, value));
      if (match) {
        this.queryText.set(match.label);
      }

      onCleanup(() => undefined);
    });

    effect(() => {
      if (!this.meetsMinChars()) {
        this.closePanel();
      }
    });

    effect(() => {
      if (!this.isOpen()) {
        this.activeIndex.set(null);
        return;
      }

      const items = this.filteredItems();
      const current = this.activeIndex();
      if (current === null) {
        return;
      }

      const item = items[current];
      if (!item || item.disabled) {
        this.activeIndex.set(null);
      }
    });

    effect((onCleanup) => {
      if (!this.isOpen()) {
        return;
      }

      onCleanup(() => undefined);
    });

    effect(() => {
      const shouldBeOpen = this.isOpen();
      const ref = this.overlayRef();

      if (shouldBeOpen) {
        if (ref) {
          return;
        }

        const anchor = this.nativeInput()?.nativeElement;
        if (!anchor) {
          return;
        }

        const nextRef = this.overlay.attachComponent(NshAutocompletePanelComponent, {
          anchor,
          closeOnOutsidePointerDown: true,
          closeOnEscape: true,
          matchWidth: true,
          panelClass: 'nsh-ac-overlay',
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
        const item = this.filteredItems()[index];
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

      ref.componentRef.setInput('items', this.filteredItems());
      ref.componentRef.setInput('activeIndex', this.activeIndex() ?? -1);
      ref.componentRef.setInput('noResultsText', this.noResultsText());
      ref.componentRef.setInput('loading', this.loading());
      ref.componentRef.setInput('panelId', this.panelId());

      ref.componentRef.changeDetectorRef.detectChanges();
    });

    const wasOpen = signal(false);
    effect(() => {
      const now = this.isOpen();
      const prev = wasOpen();
      if (now === prev) {
        return;
      }
      wasOpen.set(now);
      if (now) {
        this.opened.emit();
      } else {
        this.closed.emit();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.overlayRef()?.close();
      this.overlayRef.set(null);
      this.closePanel();
    });
  }

  optionId(index: number): string {
    return `${this.panelId()}-opt-${index}`;
  }

  isActiveIndex(index: number): boolean {
    return this.activeIndex() === index;
  }

  private firstEnabledIndex(items: ReadonlyArray<NshAutocompleteItem<any>>): number | null {
    for (let i = 0; i < items.length; i++) {
      if (!items[i]?.disabled) {
        return i;
      }
    }
    return null;
  }

  private nextEnabledIndex(direction: 1 | -1): number | null {
    const items = this.filteredItems();
    if (items.length === 0) {
      return null;
    }

    const current = this.activeIndex();
    const startIndex = current === null ? -1 : current;

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

  private openPanel(): void {
    if (this.effectiveDisabled()) {
      return;
    }

    if (!this.meetsMinChars()) {
      return;
    }

    this.open.set(true);
  }

  private closePanel(): void {
    this.open.set(false);
  }

  onInputFocus(): void {
    this.focused.set(true);
    this.openPanel();
  }

  onInputBlur(): void {
    this.focused.set(false);
    this.closePanel();
    this.cva.markTouched();
  }

  onInput(event: Event): void {
    if (this.effectiveDisabled()) {
      return;
    }

    const el = event.target as HTMLInputElement | null;
    const value = el?.value ?? '';

    this.syncQueryFromValue.set(false);
    this.queryText.set(value);

    if (this.meetsMinChars()) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
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
      const next = this.nextEnabledIndex(1) ?? this.firstEnabledIndex(this.filteredItems());
      this.activeIndex.set(next);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.openPanel();
      }
      const next = this.nextEnabledIndex(-1) ?? this.firstEnabledIndex(this.filteredItems());
      this.activeIndex.set(next);
      return;
    }

    if (event.key === 'Enter') {
      if (!this.isOpen()) {
        return;
      }
      event.preventDefault();
      const index = this.activeIndex();
      if (index === null) {
        return;
      }
      const item = this.filteredItems()[index];
      if (!item || item.disabled) {
        return;
      }
      this.selectItem(item);
      return;
    }
  }

  private selectItem(item: NshAutocompleteItem<any>): void {
    this.syncQueryFromValue.set(true);
    this.cva.setValueFromUI(item.value);
    this.queryText.set(item.label);

    this.optionSelected.emit(item);

    this.closePanel();
  }

  writeValue(value: any | null): void {
    this.syncQueryFromValue.set(true);
    this.cva.writeValue(value);

    const match = this.items().find((it) => Object.is(it.value, value));
    this.queryText.set(match ? match.label : '');
  }

  registerOnChange(fn: (value: any | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
    if (this.effectiveDisabled()) {
      this.closePanel();
    }
  }
}
