import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import {
  NSH_FORM_FIELD_CONTEXT,
  type NshFormFieldControlContext,
} from '../form-field/form-field.context';

export type NshSwitchSize = 'sm' | 'md' | 'lg';

export interface NshSwitchChangedEvent {
  checked: boolean;
}

let nextSwitchId = 0;

@Component({
  selector: 'nsh-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshSwitchComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-switch-host]': 'true',
    '[class.nsh-switch-host--disabled]': 'effectiveDisabled()',

    '[class.nsh-switch-host--sm]': "size() === 'sm'",
    '[class.nsh-switch-host--md]': "size() === 'md'",
    '[class.nsh-switch-host--lg]': "size() === 'lg'",
  },
  template: `
    @if (label(); as text) {
      <label class="nsh-switch">
        <input
          #native
          nshFocusVisible
          class="nsh-switch__input"
          type="checkbox"
          role="switch"
          [id]="inputId"
          [name]="name() ?? null"
          [disabled]="effectiveDisabled()"
          [required]="effectiveRequired()"
          [checked]="modelChecked()"
          [attr.aria-checked]="modelChecked() ? 'true' : 'false'"
          [attr.aria-describedby]="effectiveDescribedBy()"
          [attr.aria-label]="effectiveAriaLabel()"
          (change)="onNativeChange($event)"
          (keydown)="onNativeKeydown($event)"
          (blur)="onNativeBlur()"
        />
        <span class="nsh-switch__label">{{ text }}</span>
      </label>
    } @else {
      <span class="nsh-switch">
        <input
          #native
          nshFocusVisible
          class="nsh-switch__input"
          type="checkbox"
          role="switch"
          [id]="inputId"
          [name]="name() ?? null"
          [disabled]="effectiveDisabled()"
          [required]="effectiveRequired()"
          [checked]="modelChecked()"
          [attr.aria-checked]="modelChecked() ? 'true' : 'false'"
          [attr.aria-describedby]="effectiveDescribedBy()"
          [attr.aria-label]="effectiveAriaLabel()"
          (change)="onNativeChange($event)"
          (keydown)="onNativeKeydown($event)"
          (blur)="onNativeBlur()"
        />
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;

      /* Component override surface */
      --nsh-switch-width: var(--nsh-switch-width, unset);
      --nsh-switch-height: var(--nsh-switch-height, unset);
      --nsh-switch-thumb-size: var(--nsh-switch-thumb-size, unset);
      --nsh-switch-radius: var(--nsh-switch-radius, unset);
      --nsh-switch-track-bg: var(--nsh-switch-track-bg, unset);
      --nsh-switch-track-bg-checked: var(--nsh-switch-track-bg-checked, unset);
      --nsh-switch-thumb-bg: var(--nsh-switch-thumb-bg, unset);
      --nsh-switch-focus-ring: var(--nsh-switch-focus-ring, unset);
      --nsh-switch-label-gap: var(--nsh-switch-label-gap, unset);
      --nsh-switch-label-color: var(--nsh-switch-label-color, unset);

      --_sw-width: var(--nsh-switch-width);
      --_sw-height: var(--nsh-switch-height);
      --_sw-thumb: var(--nsh-switch-thumb-size);

      --_sw-radius: var(--nsh-switch-radius, var(--nsh-radius-pill));

      --_sw-track: var(
        --nsh-switch-track-bg,
        color-mix(in srgb, var(--nsh-color-outline) 55%, transparent)
      );
      --_sw-track-checked: var(
        --nsh-switch-track-bg-checked,
        color-mix(in srgb, var(--nsh-color-primary) 65%, transparent)
      );

      --_sw-thumb-bg: var(--nsh-switch-thumb-bg, var(--nsh-color-surface));

      --_sw-focus-ring: var(
        --nsh-switch-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_sw-gap: var(--nsh-switch-label-gap, var(--nsh-space-sm));
      --_sw-label: var(--nsh-switch-label-color, var(--nsh-color-text));

      --_sw-border-width: var(--nsh-switch-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_sw-focus-width: var(--nsh-switch-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    :host(.nsh-switch-host--sm) {
      --_sw-width: calc(var(--nsh-density-control-height) + var(--nsh-space-sm));
      --_sw-height: calc(var(--nsh-density-control-height) - var(--nsh-space-md));
      --_sw-thumb: calc(var(--nsh-density-control-height) - var(--nsh-space-lg));
    }

    :host(.nsh-switch-host--md) {
      --_sw-width: calc(var(--nsh-density-control-height) + var(--nsh-space-md));
      --_sw-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_sw-thumb: calc(var(--nsh-density-control-height) - var(--nsh-space-md));
    }

    :host(.nsh-switch-host--lg) {
      --_sw-width: calc(var(--nsh-density-control-height) + var(--nsh-space-lg));
      --_sw-height: var(--nsh-density-control-height);
      --_sw-thumb: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
    }

    .nsh-switch {
      display: inline-flex;
      align-items: center;
      gap: var(--_sw-gap);
      font-family: var(--nsh-font-family);
      color: var(--_sw-label);
      min-width: 0;
      user-select: none;
    }

    .nsh-switch__input {
      margin: 0;

      width: var(--_sw-width);
      height: var(--_sw-height);

      appearance: none;
      -webkit-appearance: none;

      border-radius: var(--_sw-radius);
      background: var(--_sw-track);
      border: var(--_sw-border-width) solid color-mix(in srgb, var(--nsh-color-outline) 55%, transparent);

      position: relative;
      display: inline-block;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);

      cursor: pointer;
    }

    .nsh-switch__input::after {
      content: '';
      position: absolute;
      top: 50%;
      inset-inline-start: calc((var(--_sw-height) - var(--_sw-thumb)) / 2);
      transform: translateY(-50%);

      width: var(--_sw-thumb);
      height: var(--_sw-thumb);
      border-radius: var(--_sw-radius);
      background: var(--_sw-thumb-bg);
      box-shadow: var(--nsh-elevation-1);

      transition: transform var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-switch__input:checked {
      background: var(--_sw-track-checked);
    }

    .nsh-switch__input:checked::after {
      transform: translateY(-50%) translateX(calc(var(--_sw-width) - var(--_sw-height)));
    }

    .nsh-switch__input:focus {
      outline: none;
    }

    .nsh-switch__input.nsh-focus-visible,
    .nsh-switch__input:focus-visible {
      box-shadow: 0 0 0 var(--_sw-focus-width) var(--_sw-focus-ring);
    }

    .nsh-switch__label {
      min-width: 0;
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
    }

    :host(.nsh-switch-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshSwitchComponent {
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly size = input<NshSwitchSize>('md');

  readonly changed = output<NshSwitchChangedEvent>();

  readonly inputId = `nsh-switch-${nextSwitchId++}`;

  private readonly model = signal(false);
  private readonly cvaDisabled = signal(false);
  private readonly isCvaConnected = signal(false);

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

  readonly effectiveAriaLabel = computed(() => {
    if (this.label() !== null && this.label()!.trim().length > 0) {
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
      if (this.isCvaConnected()) {
        return;
      }
      this.model.set(this.checked());
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

    this.model.set(nextChecked);
    this.onChange(nextChecked);
    this.changed.emit({ checked: nextChecked });
  }

  onNativeKeydown(event: KeyboardEvent) {
    if (this.effectiveDisabled()) {
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    // Checkbox doesn't consistently toggle on Enter; we do it explicitly.
    event.preventDefault();

    const next = !this.modelChecked();
    const el = event.target as HTMLInputElement | null;
    if (el) {
      el.checked = next;
    }
    this.model.set(next);
    this.onChange(next);
    this.changed.emit({ checked: next });
  }

  onNativeBlur() {
    this.onTouched();
  }
}
