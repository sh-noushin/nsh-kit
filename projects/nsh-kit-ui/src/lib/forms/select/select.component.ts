import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
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
    <select
      nshFocusVisible
      class="nsh-select"
      [id]="effectiveId()"
      [name]="name() ?? null"
      [disabled]="effectiveDisabled()"
      [required]="effectiveRequired()"
      [attr.aria-describedby]="effectiveDescribedBy()"
      [attr.aria-label]="effectiveAriaLabel()"
      [value]="selectedDomValue()"
      (change)="onNativeChange($event)"
      (blur)="onBlur()"
    >
      @if (placeholder(); as text) {
        <option value="" disabled hidden>{{ text }}</option>
      }

      @for (opt of renderedOptions(); track opt.key) {
        <option [value]="opt.key" [disabled]="opt.disabled">{{ opt.label }}</option>
      }
    </select>

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
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

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

  private readonly valueMap = computed(() => {
    const map = new Map<string, string | number>();
    for (const opt of this.renderedOptions()) {
      map.set(opt.key, opt.value);
    }
    return map;
  });

  readonly selectedDomValue = computed(() => {
    const placeholder = this.placeholder();
    const value = this.cva.value();

    if (value === null) {
      return placeholder !== null ? '' : '';
    }

    return serializeValue(value);
  });

  readonly isShowingPlaceholder = computed(() => {
    const placeholder = this.placeholder();
    if (placeholder === null) {
      return false;
    }
    return this.cva.value() === null;
  });

  constructor() {
    effect(() => {
      if (this.multiple()) {
        throw new Error('nsh-select v1 does not support multiple=true yet.');
      }
    });
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

  onNativeChange(event: Event) {
    if (this.effectiveDisabled()) {
      return;
    }

    const el = event.target as HTMLSelectElement | null;
    const raw = el?.value ?? '';

    if (raw === '') {
      this.cva.setValueFromUI(null);
      return;
    }

    const mapped = this.valueMap().get(raw);
    this.cva.setValueFromUI(mapped ?? null);
  }

  onBlur() {
    this.cva.markTouched();
  }
}
