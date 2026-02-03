import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
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

let nextSliderId = 0;

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function coercePositiveNumber(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
}

@Component({
  selector: 'nsh-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshSliderComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-slider-host]': 'true',
    '[class.nsh-slider-host--disabled]': 'effectiveDisabled()',
    '[style.--_nsh-slider-pct]': 'activePercent()',
  },
  template: `
    <div class="nsh-slider">
      @if (showValue()) {
        <span class="nsh-slider__value">{{ displayValue() }}</span>
      }

      <input
        nshFocusVisible
        class="nsh-slider__input"
        type="range"
        [name]="name() ?? null"
        [disabled]="effectiveDisabled()"
        [required]="effectiveRequired()"
        [min]="effectiveMin()"
        [max]="effectiveMax()"
        [step]="effectiveStep()"
        [value]="displayValue()"
        [attr.list]="tickMarks() ? tickListId : null"
        [attr.aria-describedby]="effectiveDescribedBy()"
        [attr.aria-label]="effectiveAriaLabel()"
        (input)="onNativeInput($event)"
        (change)="onNativeChange($event)"
        (blur)="onNativeBlur()"
      />

      @if (tickMarks()) {
        <datalist [id]="tickListId" aria-hidden="true">
          @for (t of tickValues(); track t) {
            <option [value]="t"></option>
          }
        </datalist>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;

      /* Component override surface */
      --nsh-slider-track-height: var(--nsh-slider-track-height, unset);
      --nsh-slider-thumb-size: var(--nsh-slider-thumb-size, unset);
      --nsh-slider-track-bg: var(--nsh-slider-track-bg, unset);
      --nsh-slider-track-bg-active: var(--nsh-slider-track-bg-active, unset);
      --nsh-slider-thumb-bg: var(--nsh-slider-thumb-bg, unset);
      --nsh-slider-focus-ring: var(--nsh-slider-focus-ring, unset);
      --nsh-slider-value-color: var(--nsh-slider-value-color, unset);

      --_trk-h: var(--nsh-slider-track-height, var(--nsh-space-xs));
      --_thumb: var(--nsh-slider-thumb-size, var(--nsh-density-control-height));

      --_trk-bg: var(
        --nsh-slider-track-bg,
        color-mix(in srgb, var(--nsh-color-outline) 45%, transparent)
      );
      --_trk-active: var(
        --nsh-slider-track-bg-active,
        color-mix(in srgb, var(--nsh-color-primary) 65%, transparent)
      );

      --_thumb-bg: var(--nsh-slider-thumb-bg, var(--nsh-color-surface));

      --_focus-ring: var(
        --nsh-slider-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_value-color: var(--nsh-slider-value-color, var(--nsh-color-text-muted));

      --_border-width: var(--nsh-slider-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_focus-width: var(--nsh-slider-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    .nsh-slider {
      display: grid;
      gap: var(--nsh-space-sm);
      width: 100%;
      min-width: 0;
      font-family: var(--nsh-font-family);
    }

    .nsh-slider__value {
      color: var(--_value-color);
      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-slider__input {
      width: 100%;
      margin: 0;

      appearance: none;
      -webkit-appearance: none;

      height: var(--_thumb);
      background: transparent;

      cursor: pointer;
    }

    .nsh-slider__input:focus {
      outline: none;
    }

    .nsh-slider__input.nsh-focus-visible,
    .nsh-slider__input:focus-visible {
      box-shadow: 0 0 0 var(--_focus-width) var(--_focus-ring);
      border-radius: var(--nsh-radius-md);
    }

    /* WebKit */
    .nsh-slider__input::-webkit-slider-runnable-track {
      height: var(--_trk-h);
      border-radius: var(--nsh-radius-pill);
      background: linear-gradient(
        to right,
        var(--_trk-active) 0%,
        var(--_trk-active) var(--_nsh-slider-pct, 0%),
        var(--_trk-bg) var(--_nsh-slider-pct, 0%),
        var(--_trk-bg) 100%
      );
      border: var(--_border-width) solid color-mix(in srgb, var(--nsh-color-outline) 55%, transparent);
    }

    .nsh-slider__input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;

      width: var(--_thumb);
      height: var(--_thumb);
      margin-top: calc((var(--_trk-h) - var(--_thumb)) / 2);

      border-radius: var(--nsh-radius-pill);
      background: var(--_thumb-bg);
      box-shadow: var(--nsh-elevation-1);
      border: var(--_border-width) solid color-mix(in srgb, var(--nsh-color-outline) 55%, transparent);
    }

    /* Firefox */
    .nsh-slider__input::-moz-range-track {
      height: var(--_trk-h);
      border-radius: var(--nsh-radius-pill);
      background: var(--_trk-bg);
      border: var(--_border-width) solid color-mix(in srgb, var(--nsh-color-outline) 55%, transparent);
    }

    .nsh-slider__input::-moz-range-progress {
      height: var(--_trk-h);
      border-radius: var(--nsh-radius-pill);
      background: var(--_trk-active);
    }

    .nsh-slider__input::-moz-range-thumb {
      width: var(--_thumb);
      height: var(--_thumb);

      border-radius: var(--nsh-radius-pill);
      background: var(--_thumb-bg);
      box-shadow: var(--nsh-elevation-1);
      border: var(--_border-width) solid color-mix(in srgb, var(--nsh-color-outline) 55%, transparent);
    }

    :host(.nsh-slider-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshSliderComponent {
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  private readonly cva = new NshCvaControl<number>();

  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  readonly showValue = input(false, { transform: booleanAttribute });
  readonly tickMarks = input(false, { transform: booleanAttribute });

  readonly ariaLabel = input<string | null>(null);
  readonly name = input<string | null>(null);

  readonly tickListId = `nsh-slider-ticks-${nextSliderId++}`;

  private readonly hasUserAriaLabel = computed(() => {
    const v = this.ariaLabel();
    return v !== null && v.trim().length > 0;
  });

  readonly effectiveMin = computed(() => {
    const min = this.min();
    const max = this.max();
    return Math.min(min, max);
  });

  readonly effectiveMax = computed(() => {
    const min = this.min();
    const max = this.max();
    return Math.max(min, max);
  });

  readonly effectiveStep = computed(() => coercePositiveNumber(this.step(), 1));

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

    // Prefer association with an external label (e.g., form-field label).
    return null;
  });

  readonly displayValue = computed(() => {
    const current = this.cva.value();
    const base = current ?? this.effectiveMin();
    return clampNumber(base, this.effectiveMin(), this.effectiveMax());
  });

  readonly activePercent = computed(() => {
    const min = this.effectiveMin();
    const max = this.effectiveMax();
    if (max <= min) {
      return '0%';
    }

    const value = this.displayValue();
    const pct = ((value - min) / (max - min)) * 100;
    return `${clampNumber(pct, 0, 100).toFixed(2)}%`;
  });

  readonly tickValues = computed(() => {
    if (!this.tickMarks()) {
      return [] as number[];
    }

    const min = this.effectiveMin();
    const max = this.effectiveMax();
    const step = this.effectiveStep();

    if (max <= min) {
      return [min];
    }

    const steps = Math.floor((max - min) / step);

    // Render all ticks for small ranges; otherwise provide a capped set.
    if (steps >= 1 && steps <= 20) {
      const ticks: number[] = [];
      for (let i = 0; i <= steps; i++) {
        ticks.push(min + i * step);
      }
      return ticks;
    }

    const ticks: number[] = [];
    const segments = 10;
    for (let i = 0; i <= segments; i++) {
      ticks.push(min + ((max - min) * i) / segments);
    }
    return ticks;
  });

  constructor() {
    effect(() => {
      const current = this.cva.value();
      if (current === null) {
        return;
      }

      const clamped = clampNumber(current, this.effectiveMin(), this.effectiveMax());
      if (clamped !== current) {
        this.cva.writeValue(clamped);
      }
    });
  }

  writeValue(value: number | null): void {
    const min = this.effectiveMin();
    const max = this.effectiveMax();

    const base = value ?? min;
    const clamped = clampNumber(base, min, max);

    this.cva.writeValue(clamped);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  onNativeInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const raw = Number(el.value);
    const clamped = clampNumber(raw, this.effectiveMin(), this.effectiveMax());
    this.cva.setValueFromUI(clamped);
  }

  onNativeChange(event: Event): void {
    // OK to emit onChange here too; input already emits live updates.
    this.onNativeInput(event);
  }

  onNativeBlur(): void {
    this.cva.markTouched();
  }
}
