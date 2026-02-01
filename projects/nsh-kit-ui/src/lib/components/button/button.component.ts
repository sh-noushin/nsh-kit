import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import { NshIconComponent } from '../../foundations/icon';

export type NshButtonSize = 'sm' | 'md' | 'lg';
export type NshButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';
export type NshButtonColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral';

@Component({
  selector: 'nsh-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshIconComponent, NshFocusVisibleDirective],
  template: `
    <button
      nshFocusVisible
      class="nsh-button"
      type="button"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-busy]="loading() ? 'true' : null"
      [class.nsh-button--sm]="size() === 'sm'"
      [class.nsh-button--md]="size() === 'md'"
      [class.nsh-button--lg]="size() === 'lg'"
      [class.nsh-button--filled]="variant() === 'filled'"
      [class.nsh-button--tonal]="variant() === 'tonal'"
      [class.nsh-button--outlined]="variant() === 'outlined'"
      [class.nsh-button--text]="variant() === 'text'"
      [class.nsh-button--primary]="color() === 'primary'"
      [class.nsh-button--secondary]="color() === 'secondary'"
      [class.nsh-button--tertiary]="color() === 'tertiary'"
      [class.nsh-button--success]="color() === 'success'"
      [class.nsh-button--warn]="color() === 'warn'"
      [class.nsh-button--danger]="color() === 'danger'"
      [class.nsh-button--neutral]="color() === 'neutral'"
      [class.nsh-button--loading]="loading()"
    >
      <span class="nsh-button__content">
        @if (loading()) {
          <span class="nsh-button__spinner" aria-hidden="true"></span>
        }

        @if (leadingIcon(); as iconName) {
          <nsh-icon class="nsh-button__icon" [name]="iconName" [size]="iconSize()"></nsh-icon>
        }

        <span class="nsh-button__label"><ng-content /></span>

        @if (trailingIcon(); as iconName) {
          <nsh-icon class="nsh-button__icon" [name]="iconName" [size]="iconSize()"></nsh-icon>
        }
      </span>
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;

      /* Per-instance override surface */
      --nsh-button-bg: var(--nsh-button-bg, unset);
      --nsh-button-fg: var(--nsh-button-fg, unset);
      --nsh-button-border-color: var(--nsh-button-border-color, unset);
      --nsh-button-focus-ring-color: var(--nsh-button-focus-ring-color, unset);
      --nsh-button-radius: var(--nsh-button-radius, var(--nsh-radius-md));
    }

    .nsh-button {
      --_btn-accent: var(--nsh-color-primary);
      --_btn-bg: var(--nsh-button-bg, var(--_btn-accent));
      --_btn-fg: var(--nsh-button-fg, var(--nsh-color-text));
      --_btn-border: var(--nsh-button-border-color, transparent);

      --_btn-height: var(--nsh-density-control-height);
      --_btn-pad-inline: var(--nsh-density-padding-inline);
      --_btn-pad-block: var(--nsh-density-padding-block);
      --_btn-gap: var(--nsh-space-sm);
      --_btn-font-size: var(--nsh-font-size-md);
      --_btn-font-weight: var(--nsh-font-weight-medium);
      --_btn-line-height: var(--nsh-line-height-tight);
      --_btn-icon-size: 1.125em;

      --_btn-focus-ring: var(
        --nsh-button-focus-ring-color,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--_btn-gap);
      min-height: var(--_btn-height);
      padding: var(--_btn-pad-block) var(--_btn-pad-inline);
      border-radius: var(--nsh-button-radius);
      border: 0.0625rem solid var(--_btn-border);

      background: var(--_btn-bg);
      color: var(--_btn-fg);
      font-family: var(--nsh-font-family);
      font-size: var(--_btn-font-size);
      font-weight: var(--_btn-font-weight);
      line-height: var(--_btn-line-height);
      text-decoration: none;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        opacity var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-button__content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--_btn-gap);
    }

    .nsh-button__label {
      display: inline-flex;
      align-items: center;
    }

    .nsh-button__icon {
      display: inline-flex;
      color: currentColor;
    }

    .nsh-button__spinner {
      width: var(--_btn-icon-size);
      height: var(--_btn-icon-size);
      border-radius: 9999px;
      border: 0.125rem solid color-mix(in srgb, currentColor 25%, transparent);
      border-top-color: currentColor;
      animation: nsh-button-spin var(--nsh-motion-duration-slow) linear infinite;
    }

    @keyframes nsh-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Size */
    .nsh-button--sm {
      --_btn-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_btn-font-size: var(--nsh-font-size-sm);
      --_btn-pad-inline: calc(var(--nsh-density-padding-inline) - var(--nsh-space-xs));
      --_btn-pad-block: calc(var(--nsh-density-padding-block) - var(--nsh-space-xs));
    }

    .nsh-button--md {
      --_btn-height: var(--nsh-density-control-height);
      --_btn-font-size: var(--nsh-font-size-md);
    }

    .nsh-button--lg {
      --_btn-height: calc(var(--nsh-density-control-height) + var(--nsh-space-sm));
      --_btn-font-size: var(--nsh-font-size-lg);
      --_btn-pad-inline: calc(var(--nsh-density-padding-inline) + var(--nsh-space-xs));
      --_btn-pad-block: calc(var(--nsh-density-padding-block) + var(--nsh-space-xs));
    }

    /* Color -> accent */
    .nsh-button--primary {
      --_btn-accent: var(--nsh-color-primary);
    }
    .nsh-button--secondary {
      --_btn-accent: var(--nsh-color-secondary);
    }
    .nsh-button--tertiary {
      --_btn-accent: var(--nsh-color-tertiary);
    }
    .nsh-button--success {
      --_btn-accent: var(--nsh-color-success);
    }
    .nsh-button--warn {
      --_btn-accent: var(--nsh-color-warn);
    }
    .nsh-button--danger {
      --_btn-accent: var(--nsh-color-danger);
    }
    .nsh-button--neutral {
      --_btn-accent: var(--nsh-color-text);
    }

    /* Variant */
    .nsh-button--filled {
      --_btn-bg: var(--nsh-button-bg, var(--_btn-accent));
      --_btn-fg: var(--nsh-button-fg, var(--nsh-color-surface));
      --_btn-border: var(--nsh-button-border-color, transparent);
    }

    .nsh-button--tonal {
      --_btn-bg: var(
        --nsh-button-bg,
        color-mix(in srgb, var(--_btn-accent) 12%, var(--nsh-color-surface-1))
      );
      --_btn-fg: var(--nsh-button-fg, var(--nsh-color-text));
      --_btn-border: var(--nsh-button-border-color, transparent);
    }

    .nsh-button--outlined {
      --_btn-bg: var(--nsh-button-bg, transparent);
      --_btn-fg: var(--nsh-button-fg, var(--_btn-accent));
      --_btn-border: var(--nsh-button-border-color, color-mix(in srgb, var(--_btn-accent) 55%, transparent));
    }

    .nsh-button--text {
      --_btn-bg: var(--nsh-button-bg, transparent);
      --_btn-fg: var(--nsh-button-fg, var(--_btn-accent));
      --_btn-border: var(--nsh-button-border-color, transparent);
    }

    /* States */
    .nsh-button:hover:not(:disabled):not(.nsh-button--loading) {
      background: color-mix(in srgb, var(--_btn-bg) 92%, var(--nsh-color-surface));
    }

    .nsh-button:active:not(:disabled):not(.nsh-button--loading) {
      background: color-mix(in srgb, var(--_btn-bg) 86%, var(--nsh-color-surface));
    }

    .nsh-button:disabled,
    .nsh-button.nsh-button--loading {
      cursor: not-allowed;
      opacity: 0.72;
    }

    .nsh-button.nsh-focus-visible {
      box-shadow: 0 0 0 0.1875rem var(--_btn-focus-ring);
    }
  `,
})
export class NshButtonComponent {
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly size = input<NshButtonSize>('md');
  readonly variant = input<NshButtonVariant>('filled');
  readonly color = input<NshButtonColor>('primary');

  readonly ariaLabel = input<string | undefined>(undefined);
  readonly leadingIcon = input<string | undefined>(undefined);
  readonly trailingIcon = input<string | undefined>(undefined);

  readonly isDisabled = computed(() => this.disabled() || this.loading());
  readonly iconSize = computed(() => '1.125em');
}
