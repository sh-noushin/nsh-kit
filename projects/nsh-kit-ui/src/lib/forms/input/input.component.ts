import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  booleanAttribute,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import { NSH_FORM_FIELD_CONTEXT, type NshFormFieldControlContext } from '../form-field/form-field.context';
import { NshCvaControl } from '../cva/nsh-cva-control';

export type NshInputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';

let nextInputId = 0;

@Component({
  selector: 'nsh-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-input-host]': 'true',
    '[class.nsh-input-host--disabled]': 'effectiveDisabled()'
  },
  template: `
    <input
      nshFocusVisible
      class="nsh-input"
      [type]="type()"
      [id]="effectiveId()"
      [name]="name() ?? null"
      [attr.autocomplete]="autocomplete() ?? null"
      [attr.placeholder]="placeholder() ?? null"
      [readonly]="readonly()"
      [disabled]="effectiveDisabled()"
      [required]="effectiveRequired()"
      [attr.aria-describedby]="effectiveDescribedBy()"
      [attr.aria-label]="effectiveAriaLabel()"
      [value]="stringValue()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;

      /* Component override surface */
      --nsh-input-height: var(--nsh-input-height, unset);
      --nsh-input-padding-x: var(--nsh-input-padding-x, unset);
      --nsh-input-radius: var(--nsh-input-radius, unset);
      --nsh-input-bg: var(--nsh-input-bg, unset);
      --nsh-input-fg: var(--nsh-input-fg, unset);
      --nsh-input-placeholder-color: var(--nsh-input-placeholder-color, unset);
      --nsh-input-border-color: var(--nsh-input-border-color, unset);
      --nsh-input-border-color-focus: var(--nsh-input-border-color-focus, unset);
      --nsh-input-focus-ring: var(--nsh-input-focus-ring, unset);

      --_in-height: var(--nsh-input-height, var(--nsh-density-control-height));
      --_in-pad-x: var(--nsh-input-padding-x, var(--nsh-density-padding-inline));
      --_in-radius: var(--nsh-input-radius, var(--nsh-radius-md));

      --_in-bg: var(--nsh-input-bg, var(--nsh-color-surface));
      --_in-fg: var(--nsh-input-fg, var(--nsh-color-text));
      --_in-placeholder: var(--nsh-input-placeholder-color, var(--nsh-color-text-muted));

      --_in-border: var(--nsh-input-border-color, var(--nsh-color-outline));
      --_in-border-focus: var(--nsh-input-border-color-focus, var(--nsh-color-primary));

      --_in-focus-ring: var(
        --nsh-input-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_in-border-width: var(--nsh-input-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_in-focus-width: var(--nsh-input-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    .nsh-input {
      width: 100%;
      min-width: 0;
      min-height: var(--_in-height);
      padding-inline: var(--_in-pad-x);

      border-radius: var(--_in-radius);
      border: var(--_in-border-width) solid var(--_in-border);
      background: var(--_in-bg);
      color: var(--_in-fg);

      font-family: var(--nsh-font-family);
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);

      transition:
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-input::placeholder {
      color: var(--_in-placeholder);
      opacity: 1;
    }

    .nsh-input:focus {
      outline: none;
    }

    .nsh-input.nsh-focus-visible,
    .nsh-input:focus-visible {
      border-color: var(--_in-border-focus);
      box-shadow: 0 0 0 var(--_in-focus-width) var(--_in-focus-ring);
    }

    :host(.nsh-input-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshInputComponent {
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  private readonly cva = new NshCvaControl<string>();

  readonly type = input<NshInputType>('text');
  readonly placeholder = input<string | null>(null);
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly autoId = `nsh-input-${nextInputId++}`;

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

    // Prefer association with <label for="..."></label> from nsh-form-field.
    return null;
  });

  readonly stringValue = computed(() => {
    const v = this.cva.value();
    return v ?? '';
  });

  // CVA methods (delegated)
  writeValue(value: string | null): void {
    this.cva.writeValue(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  onInput(event: Event) {
    if (this.effectiveDisabled()) {
      return;
    }

    const el = event.target as HTMLInputElement | null;
    this.cva.setValueFromUI(el?.value ?? '');
  }

  onBlur() {
    this.cva.markTouched();
  }
}
