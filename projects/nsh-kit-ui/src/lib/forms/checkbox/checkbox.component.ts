import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
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
import {
  NSH_FORM_FIELD_CONTEXT,
  type NshFormFieldControlContext,
} from '../form-field/form-field.context';

export interface NshCheckboxChangedEvent {
  checked: boolean;
  indeterminate: boolean;
}

let nextCheckboxId = 0;

@Component({
  selector: 'nsh-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-checkbox-host]': 'true',
    '[class.nsh-checkbox-host--disabled]': 'effectiveDisabled()',
  },
  template: `
    @if (label(); as text) {
      <label class="nsh-checkbox">
        <input
          #native
          nshFocusVisible
          class="nsh-checkbox__input"
          type="checkbox"
          [id]="inputId"
          [name]="name() ?? null"
          [disabled]="effectiveDisabled()"
          [required]="effectiveRequired()"
          [checked]="modelChecked()"
          [attr.aria-describedby]="effectiveDescribedBy()"
          [attr.aria-label]="effectiveAriaLabel()"
          (change)="onNativeChange($event)"
          (blur)="onNativeBlur()"
        />
        <span class="nsh-checkbox__label">{{ text }}</span>
      </label>
    } @else {
      <span class="nsh-checkbox">
        <input
          #native
          nshFocusVisible
          class="nsh-checkbox__input"
          type="checkbox"
          [id]="inputId"
          [name]="name() ?? null"
          [disabled]="effectiveDisabled()"
          [required]="effectiveRequired()"
          [checked]="modelChecked()"
          [attr.aria-describedby]="effectiveDescribedBy()"
          [attr.aria-label]="effectiveAriaLabel()"
          (change)="onNativeChange($event)"
          (blur)="onNativeBlur()"
        />
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;

      /* Component override surface */
      --nsh-checkbox-size: var(--nsh-checkbox-size, unset);
      --nsh-checkbox-radius: var(--nsh-checkbox-radius, unset);
      --nsh-checkbox-border-color: var(--nsh-checkbox-border-color, unset);
      --nsh-checkbox-bg: var(--nsh-checkbox-bg, unset);
      --nsh-checkbox-check-color: var(--nsh-checkbox-check-color, unset);
      --nsh-checkbox-focus-ring: var(--nsh-checkbox-focus-ring, unset);
      --nsh-checkbox-label-gap: var(--nsh-checkbox-label-gap, unset);
      --nsh-checkbox-label-color: var(--nsh-checkbox-label-color, unset);

      --_cb-size: var(
        --nsh-checkbox-size,
        calc(var(--nsh-density-control-height) - var(--nsh-space-sm))
      );
      --_cb-radius: var(--nsh-checkbox-radius, var(--nsh-radius-sm));

      --_cb-border: var(--nsh-checkbox-border-color, var(--nsh-color-outline));
      --_cb-bg: var(--nsh-checkbox-bg, var(--nsh-color-surface));

      /* Interpreted as the active fill (and border) color */
      --_cb-check: var(--nsh-checkbox-check-color, var(--nsh-color-primary));
      --_cb-checkmark: var(--nsh-color-surface);

      --_cb-focus-ring: var(
        --nsh-checkbox-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_cb-gap: var(--nsh-checkbox-label-gap, var(--nsh-space-sm));
      --_cb-label: var(--nsh-checkbox-label-color, var(--nsh-color-text));

      --_cb-border-width: var(--nsh-checkbox-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_cb-focus-width: var(--nsh-checkbox-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    .nsh-checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--_cb-gap);
      font-family: var(--nsh-font-family);
      color: var(--_cb-label);
      min-width: 0;
      user-select: none;
    }

    .nsh-checkbox__input {
      width: var(--_cb-size);
      height: var(--_cb-size);
      margin: 0;

      appearance: none;
      -webkit-appearance: none;

      border-radius: var(--_cb-radius);
      border: var(--_cb-border-width) solid var(--_cb-border);
      background: var(--_cb-bg);

      display: inline-grid;
      place-content: center;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-checkbox__input::before {
      content: '';
      width: calc(var(--_cb-size) * 0.46);
      height: calc(var(--_cb-size) * 0.26);
      border-left: calc(var(--_cb-size) * 0.12) solid var(--_cb-checkmark);
      border-bottom: calc(var(--_cb-size) * 0.12) solid var(--_cb-checkmark);
      transform: rotate(-45deg);
      opacity: 0;
    }

    .nsh-checkbox__input:checked {
      background: var(--_cb-check);
      border-color: var(--_cb-check);
    }

    .nsh-checkbox__input:checked::before {
      opacity: 1;
    }

    .nsh-checkbox__input:indeterminate {
      background: var(--_cb-check);
      border-color: var(--_cb-check);
    }

    .nsh-checkbox__input:indeterminate::before {
      width: calc(var(--_cb-size) * 0.5);
      height: 0;
      border-left: 0;
      border-bottom: calc(var(--_cb-size) * 0.14) solid var(--_cb-checkmark);
      transform: none;
      opacity: 1;
    }

    .nsh-checkbox__input:focus {
      outline: none;
    }

    .nsh-checkbox__input.nsh-focus-visible,
    .nsh-checkbox__input:focus-visible {
      box-shadow: 0 0 0 var(--_cb-focus-width) var(--_cb-focus-ring);
    }

    .nsh-checkbox__label {
      min-width: 0;
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
    }

    :host(.nsh-checkbox-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshCheckboxComponent {
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly name = input<string | null>(null);

  readonly changed = output<NshCheckboxChangedEvent>();

  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>('native');

  readonly inputId = `nsh-checkbox-${nextCheckboxId++}`;

  private readonly model = signal(false);
  private readonly cvaDisabled = signal(false);
  private readonly isCvaConnected = signal(false);

  private readonly userClearedIndeterminate = signal(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  private readonly hasUserAriaLabel = computed(() => {
    const v = this.ariaLabel();
    return v !== null && v.trim().length > 0;
  });

  readonly effectiveDisabled = computed(() => {
    const parent = this.field?.disabled?.() ?? false;
    return this.disabled() || parent || this.cvaDisabled();
  });

  readonly effectiveRequired = computed(() => {
    const parent = this.field?.required?.() ?? false;
    return this.required() || parent;
  });

  readonly effectiveDescribedBy = computed(() => this.field?.describedByIds?.() ?? null);

  readonly effectiveIndeterminate = computed(
    () => this.indeterminate() && !this.userClearedIndeterminate(),
  );

  readonly effectiveAriaLabel = computed(() => {
    if (this.label() !== null && this.label()!.trim().length > 0) {
      // Label text provides an accessible name.
      return null;
    }

    if (this.hasUserAriaLabel()) {
      return this.ariaLabel();
    }

    return null;
  });

  readonly modelChecked = computed(() => this.model());

  constructor() {
    effect(() => {
      // Outside CVA, allow controlled usage via [checked].
      if (this.isCvaConnected()) {
        return;
      }
      this.model.set(this.checked());
    });

    effect(() => {
      // If consumer sets indeterminate=true again, allow it to show.
      if (this.indeterminate()) {
        this.userClearedIndeterminate.set(false);
      }
    });

    afterNextRender(() => {
      effect(() => {
        const el = this.nativeInput()?.nativeElement;
        if (!el) {
          return;
        }

        el.indeterminate = this.effectiveIndeterminate();
      });
    });
  }

  writeValue(value: boolean | null): void {
    this.model.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.isCvaConnected.set(true);
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(!!isDisabled);
  }

  onNativeChange(event: Event) {
    if (this.effectiveDisabled()) {
      return;
    }

    const el = event.target as HTMLInputElement | null;
    const nextChecked = !!el?.checked;

    // User interaction clears indeterminate.
    this.userClearedIndeterminate.set(true);

    this.model.set(nextChecked);
    this.onChange(nextChecked);

    this.changed.emit({ checked: nextChecked, indeterminate: false });
  }

  onNativeBlur() {
    this.onTouched();
  }
}
