import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import { NSH_RADIO_GROUP_CONTEXT, type NshRadioGroupContext } from './radio-group.context';

let nextRadioId = 0;

@Component({
  selector: 'nsh-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  host: {
    '[class.nsh-radio-host]': 'true',
    '[class.nsh-radio-host--disabled]': 'effectiveDisabled()',
  },
  template: `
    @if (label(); as text) {
      <label class="nsh-radio" [attr.data-nsh-radio-disabled]="effectiveDisabled() ? '' : null">
        <input
          #native
          nshFocusVisible
          class="nsh-radio__input"
          type="radio"
          [id]="inputId"
          [name]="effectiveName()"
          [disabled]="effectiveDisabled()"
          [required]="effectiveRequired()"
          [checked]="checked()"
          [attr.aria-label]="effectiveAriaLabel()"
          [attr.tabindex]="effectiveTabIndex()"
          (change)="onNativeChange()"
          (focus)="onNativeFocus()"
          (blur)="onNativeBlur()"
        />
        <span class="nsh-radio__label">{{ text }}</span>
      </label>
    } @else {
      <span class="nsh-radio" [attr.data-nsh-radio-disabled]="effectiveDisabled() ? '' : null">
        <input
          #native
          nshFocusVisible
          class="nsh-radio__input"
          type="radio"
          [id]="inputId"
          [name]="effectiveName()"
          [disabled]="effectiveDisabled()"
          [required]="effectiveRequired()"
          [checked]="checked()"
          [attr.aria-label]="effectiveAriaLabel()"
          [attr.tabindex]="effectiveTabIndex()"
          (change)="onNativeChange()"
          (focus)="onNativeFocus()"
          (blur)="onNativeBlur()"
        />
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;

      /* Component override surface */
      --nsh-radio-size: var(--nsh-radio-size, unset);
      --nsh-radio-dot-size: var(--nsh-radio-dot-size, unset);
      --nsh-radio-border-color: var(--nsh-radio-border-color, unset);
      --nsh-radio-bg: var(--nsh-radio-bg, unset);
      --nsh-radio-dot-color: var(--nsh-radio-dot-color, unset);
      --nsh-radio-focus-ring: var(--nsh-radio-focus-ring, unset);
      --nsh-radio-label-gap: var(--nsh-radio-label-gap, unset);
      --nsh-radio-label-color: var(--nsh-radio-label-color, unset);

      --_r-size: var(
        --nsh-radio-size,
        calc(var(--nsh-density-control-height) - var(--nsh-space-sm))
      );
      --_r-dot: var(--nsh-radio-dot-size, calc(var(--_r-size) * 0.5));

      --_r-border: var(--nsh-radio-border-color, var(--nsh-color-outline));
      --_r-bg: var(--nsh-radio-bg, var(--nsh-color-surface));
      --_r-dot-color: var(--nsh-radio-dot-color, var(--nsh-color-primary));

      --_r-focus-ring: var(
        --nsh-radio-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_r-gap: var(--nsh-radio-label-gap, var(--nsh-space-sm));
      --_r-label: var(--nsh-radio-label-color, var(--nsh-color-text));

      --_r-border-width: var(--nsh-radio-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_r-focus-width: var(--nsh-radio-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    .nsh-radio {
      display: inline-flex;
      align-items: center;
      gap: var(--_r-gap);
      font-family: var(--nsh-font-family);
      color: var(--_r-label);
      min-width: 0;
      user-select: none;
    }

    .nsh-radio__input {
      width: var(--_r-size);
      height: var(--_r-size);
      margin: 0;

      appearance: none;
      -webkit-appearance: none;

      border-radius: var(--nsh-radius-pill);
      border: var(--_r-border-width) solid var(--_r-border);
      background: var(--_r-bg);

      display: inline-grid;
      place-content: center;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);

      cursor: pointer;
    }

    .nsh-radio__input::before {
      content: '';
      width: var(--_r-dot);
      height: var(--_r-dot);
      border-radius: var(--nsh-radius-pill);
      background: var(--_r-dot-color);
      transform: scale(0);
      transition: transform var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-radio__input:checked {
      border-color: var(--_r-dot-color);
    }

    .nsh-radio__input:checked::before {
      transform: scale(1);
    }

    .nsh-radio__input:focus {
      outline: none;
    }

    .nsh-radio__input.nsh-focus-visible,
    .nsh-radio__input:focus-visible {
      box-shadow: 0 0 0 var(--_r-focus-width) var(--_r-focus-ring);
    }

    .nsh-radio__label {
      min-width: 0;
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
    }

    :host(.nsh-radio-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshRadioComponent {
  private readonly group = inject<NshRadioGroupContext | null>(NSH_RADIO_GROUP_CONTEXT, {
    optional: true,
  });

  readonly value = input.required<any>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>('native');

  readonly inputId = `nsh-radio-${nextRadioId++}`;

  private readonly hasUserAriaLabel = computed(() => {
    const v = this.ariaLabel();
    return v !== null && v.trim().length > 0;
  });

  readonly effectiveDisabled = computed(() => {
    if (!this.group) {
      return true;
    }
    return this.disabled() || this.group.isDisabled();
  });

  readonly effectiveRequired = computed(() => {
    if (!this.group) {
      return false;
    }
    return this.group.isRequired();
  });

  readonly effectiveName = computed(() => {
    if (!this.group) {
      return null;
    }
    return this.group.groupName();
  });

  readonly checked = computed(() => {
    if (!this.group) {
      return false;
    }
    return this.group.value() === this.value();
  });

  readonly effectiveAriaLabel = computed(() => {
    if (this.label() !== null && this.label()!.trim().length > 0) {
      return null;
    }

    if (this.hasUserAriaLabel()) {
      return this.ariaLabel();
    }

    return null;
  });

  readonly effectiveTabIndex = computed(() => {
    if (!this.group) {
      return '-1';
    }
    if (this.effectiveDisabled()) {
      return '-1';
    }
    return this.group.tabIndexFor(this.value());
  });

  focusNative() {
    this.nativeInput()?.nativeElement.focus();
  }

  onNativeChange() {
    if (this.effectiveDisabled()) {
      return;
    }
    this.group?.select(this.value());
  }

  onNativeFocus() {
    if (this.effectiveDisabled()) {
      return;
    }
    this.group?.requestFocusFor(this.value());
  }

  onNativeBlur() {
    this.group?.markTouched();
  }
}
