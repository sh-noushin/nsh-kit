import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type NshSpinnerSize = 'sm' | 'md' | 'lg';
export type NshSpinnerThickness = 'sm' | 'md' | 'lg';
export type NshSpinnerColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral';

@Component({
  selector: 'nsh-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    '[attr.aria-busy]': "'true'",
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.aria-hidden]': "ariaLabel() ? null : 'true'",
    '[class.nsh-spinner]': 'true',
    '[class.nsh-spinner--inline]': 'inline()',
    '[class.nsh-spinner--sm]': "size() === 'sm'",
    '[class.nsh-spinner--md]': "size() === 'md'",
    '[class.nsh-spinner--lg]': "size() === 'lg'",
    '[class.nsh-spinner--thickness-sm]': "thickness() === 'sm'",
    '[class.nsh-spinner--thickness-md]': "thickness() === 'md'",
    '[class.nsh-spinner--thickness-lg]': "thickness() === 'lg'",
    '[class.nsh-spinner--primary]': "color() === 'primary'",
    '[class.nsh-spinner--secondary]': "color() === 'secondary'",
    '[class.nsh-spinner--tertiary]': "color() === 'tertiary'",
    '[class.nsh-spinner--success]': "color() === 'success'",
    '[class.nsh-spinner--warn]': "color() === 'warn'",
    '[class.nsh-spinner--danger]': "color() === 'danger'",
    '[class.nsh-spinner--neutral]': "color() === 'neutral'",
  },
  template: `
    <svg class="nsh-spinner__svg" viewBox="0 0 50 50" focusable="false" aria-hidden="true">
      <circle class="nsh-spinner__track" cx="25" cy="25" r="20" />
      <circle class="nsh-spinner__indicator" cx="25" cy="25" r="20" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;

      --nsh-spinner-size: var(--nsh-spinner-size, unset);
      --nsh-spinner-thickness: var(--nsh-spinner-thickness, unset);
      --nsh-spinner-color: var(--nsh-spinner-color, unset);

      --_spinner-size: var(--nsh-space-lg);
      --_spinner-thickness: var(--nsh-space-xs);
      --_spinner-color: var(--nsh-color-primary);

      --_spinner-rotate-duration: var(--nsh-motion-duration-medium);
      --_spinner-dash-duration: var(--nsh-motion-duration-medium);
      --_spinner-easing: var(--nsh-motion-easing-standard);
    }

    :host(.nsh-spinner--inline) {
      vertical-align: baseline;
    }

    :host(.nsh-spinner--sm) {
      --_spinner-size: var(--nsh-space-md);
    }

    :host(.nsh-spinner--md) {
      --_spinner-size: var(--nsh-space-lg);
    }

    :host(.nsh-spinner--lg) {
      --_spinner-size: var(--nsh-space-xl);
    }

    :host(.nsh-spinner--thickness-sm) {
      --_spinner-thickness: var(--nsh-space-xs);
    }

    :host(.nsh-spinner--thickness-md) {
      --_spinner-thickness: var(--nsh-space-sm);
    }

    :host(.nsh-spinner--thickness-lg) {
      --_spinner-thickness: var(--nsh-space-md);
    }

    :host(.nsh-spinner--primary) {
      --_spinner-color: var(--nsh-color-primary);
    }

    :host(.nsh-spinner--secondary) {
      --_spinner-color: var(--nsh-color-secondary);
    }

    :host(.nsh-spinner--tertiary) {
      --_spinner-color: var(--nsh-color-tertiary);
    }

    :host(.nsh-spinner--success) {
      --_spinner-color: var(--nsh-color-success);
    }

    :host(.nsh-spinner--warn) {
      --_spinner-color: var(--nsh-color-warn);
    }

    :host(.nsh-spinner--danger) {
      --_spinner-color: var(--nsh-color-danger);
    }

    :host(.nsh-spinner--neutral) {
      --_spinner-color: var(--nsh-color-text);
    }

    .nsh-spinner__svg {
      width: var(--nsh-spinner-size, var(--_spinner-size));
      height: var(--nsh-spinner-size, var(--_spinner-size));
      display: block;
      overflow: visible;
      animation: nsh-spinner-rotate var(--_spinner-rotate-duration) linear infinite;
    }

    .nsh-spinner__track,
    .nsh-spinner__indicator {
      fill: none;
      stroke-width: var(--nsh-spinner-thickness, var(--_spinner-thickness));
      stroke-linecap: round;
    }

    .nsh-spinner__track {
      stroke: color-mix(in srgb, var(--nsh-spinner-color, var(--_spinner-color)) 22%, transparent);
    }

    .nsh-spinner__indicator {
      stroke: var(--nsh-spinner-color, var(--_spinner-color));
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      transform-origin: 50% 50%;
      animation: nsh-spinner-dash var(--_spinner-dash-duration) var(--_spinner-easing) infinite;
    }

    @keyframes nsh-spinner-rotate {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes nsh-spinner-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }
  `,
})
export class NshSpinnerComponent {
  readonly size = input<NshSpinnerSize>('md');
  readonly color = input<NshSpinnerColor>('primary');
  readonly thickness = input<NshSpinnerThickness>('md');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly inline = input(false, { transform: booleanAttribute });
}
