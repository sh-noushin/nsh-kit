import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type NshProgressColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral';

export type NshProgressSize = 'sm' | 'md' | 'lg';

function clamp(value: number, min: number, max: number): number {
  const minValue = Math.min(min, max);
  const maxValue = Math.max(min, max);
  return Math.min(Math.max(value, minValue), maxValue);
}

@Component({
  selector: 'nsh-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'isIndeterminate() ? null : clampedValue()',
    '[attr.aria-busy]': "'true'",
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.aria-hidden]': "ariaLabel() ? null : 'true'",
    '[class.nsh-progress]': 'true',
    '[class.nsh-progress--indeterminate]': 'isIndeterminate()',
    '[class.nsh-progress--sm]': "size() === 'sm'",
    '[class.nsh-progress--md]': "size() === 'md'",
    '[class.nsh-progress--lg]': "size() === 'lg'",
    '[class.nsh-progress--rounded]': 'rounded()',
    '[class.nsh-progress--square]': '!rounded()',
    '[class.nsh-progress--primary]': "color() === 'primary'",
    '[class.nsh-progress--secondary]': "color() === 'secondary'",
    '[class.nsh-progress--tertiary]': "color() === 'tertiary'",
    '[class.nsh-progress--success]': "color() === 'success'",
    '[class.nsh-progress--warn]': "color() === 'warn'",
    '[class.nsh-progress--danger]': "color() === 'danger'",
    '[class.nsh-progress--neutral]': "color() === 'neutral'",
  },
  template: `
    <span class="nsh-progress__track">
      @if (isIndeterminate()) {
        <span class="nsh-progress__bar nsh-progress__bar--indeterminate"></span>
      } @else {
        <span class="nsh-progress__bar" [style.width.%]="percent()"></span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;
      vertical-align: middle;

      /* Per-instance override surface */
      --nsh-progress-height: var(--nsh-progress-height, unset);
      --nsh-progress-radius: var(--nsh-progress-radius, unset);
      --nsh-progress-track-color: var(--nsh-progress-track-color, unset);
      --nsh-progress-indicator-color: var(--nsh-progress-indicator-color, unset);
      --nsh-progress-indeterminate-duration: var(
        --nsh-progress-indeterminate-duration,
        var(--nsh-motion-duration-slow)
      );

      --_progress-height: var(--nsh-space-sm);
      --_progress-radius: var(--nsh-radius-pill);
      --_progress-track: var(--nsh-progress-track-color, color-mix(in srgb, var(--nsh-color-border) 60%, transparent));
      --_progress-indicator: var(--nsh-color-primary);
    }

    :host(.nsh-progress--sm) {
      --_progress-height: var(--nsh-space-xs);
    }

    :host(.nsh-progress--md) {
      --_progress-height: var(--nsh-space-sm);
    }

    :host(.nsh-progress--lg) {
      --_progress-height: var(--nsh-space-md);
    }

    :host(.nsh-progress--rounded) {
      --_progress-radius: var(--nsh-radius-pill);
    }

    :host(.nsh-progress--square) {
      --_progress-radius: 0px;
    }

    /* Color mapping */
    :host(.nsh-progress--primary) {
      --_progress-indicator: var(--nsh-color-primary);
    }

    :host(.nsh-progress--secondary) {
      --_progress-indicator: var(--nsh-color-secondary);
    }

    :host(.nsh-progress--tertiary) {
      --_progress-indicator: var(--nsh-color-tertiary);
    }

    :host(.nsh-progress--success) {
      --_progress-indicator: var(--nsh-color-success);
    }

    :host(.nsh-progress--warn) {
      --_progress-indicator: var(--nsh-color-warn);
    }

    :host(.nsh-progress--danger) {
      --_progress-indicator: var(--nsh-color-danger);
    }

    :host(.nsh-progress--neutral) {
      --_progress-indicator: var(--nsh-color-text);
    }

    .nsh-progress__track {
      position: relative;
      display: block;
      width: 100%;
      height: var(--nsh-progress-height, var(--_progress-height));
      overflow: hidden;
      border-radius: var(--nsh-progress-radius, var(--_progress-radius));
      background: var(--_progress-track);
    }

    .nsh-progress__bar {
      display: block;
      height: 100%;
      width: 0;
      background: var(--nsh-progress-indicator-color, var(--_progress-indicator));
      border-radius: inherit;
      transform-origin: left center;
      transition: width var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    :host(.nsh-progress--indeterminate) .nsh-progress__bar {
      width: 100%;
      transition: none;
    }

    .nsh-progress__bar--indeterminate {
      position: relative;
      overflow: hidden;
      background: transparent;
    }

    .nsh-progress__bar--indeterminate::before,
    .nsh-progress__bar--indeterminate::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      background: var(--nsh-progress-indicator-color, var(--_progress-indicator));
      border-radius: inherit;
    }

    .nsh-progress__bar--indeterminate::before {
      width: 40%;
      animation: nsh-progress-indeterminate-1 var(--nsh-progress-indeterminate-duration) ease-in-out infinite;
    }

    .nsh-progress__bar--indeterminate::after {
      width: 60%;
      animation: nsh-progress-indeterminate-2 var(--nsh-progress-indeterminate-duration) ease-in-out infinite;
    }

    @keyframes nsh-progress-indeterminate-1 {
      0% {
        transform: translateX(-100%);
      }
      60% {
        transform: translateX(250%);
      }
      100% {
        transform: translateX(250%);
      }
    }

    @keyframes nsh-progress-indeterminate-2 {
      0% {
        transform: translateX(-150%);
      }
      60% {
        transform: translateX(150%);
      }
      100% {
        transform: translateX(150%);
      }
    }
  `,
})
export class NshProgressComponent {
  readonly value = input<number | null>(null);
  readonly min = input(0);
  readonly max = input(100);
  readonly color = input<NshProgressColor>('primary');
  readonly size = input<NshProgressSize>('md');
  readonly rounded = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly isIndeterminate = computed(() => this.value() === null);

  readonly clampedValue = computed(() => {
    const raw = this.value();
    if (raw === null) {
      return null;
    }
    return clamp(raw, this.min(), this.max());
  });

  readonly percent = computed(() => {
    const clampedValue = this.clampedValue();
    if (clampedValue === null) {
      return 0;
    }

    const min = this.min();
    const max = this.max();

    const range = max - min;
    if (range === 0) {
      return 100;
    }

    const percent = ((clampedValue - min) / range) * 100;
    if (!Number.isFinite(percent)) {
      return 0;
    }
    return clamp(percent, 0, 100);
  });
}
