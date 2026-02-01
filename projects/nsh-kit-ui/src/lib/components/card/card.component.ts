import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NshCardVariant = 'elevated' | 'outlined' | 'filled';
export type NshCardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'nsh-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="nsh-card"
      [attr.role]="role()"
      [attr.aria-label]="ariaLabel() ?? null"
      [class.nsh-card--elevated]="variant() === 'elevated'"
      [class.nsh-card--outlined]="variant() === 'outlined'"
      [class.nsh-card--filled]="variant() === 'filled'"
      [class.nsh-card--p-none]="padding() === 'none'"
      [class.nsh-card--p-sm]="padding() === 'sm'"
      [class.nsh-card--p-md]="padding() === 'md'"
      [class.nsh-card--p-lg]="padding() === 'lg'"
    >
      <div class="nsh-card__header">
        <ng-content select="[nshCardHeader]"></ng-content>
      </div>

      <div class="nsh-card__body">
        <ng-content />
      </div>

      <div class="nsh-card__footer">
        <ng-content select="[nshCardFooter]"></ng-content>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Per-instance override surface */
      --nsh-card-bg: var(--nsh-card-bg, unset);
      --nsh-card-fg: var(--nsh-card-fg, unset);
      --nsh-card-border-color: var(--nsh-card-border-color, unset);
      --nsh-card-shadow: var(--nsh-card-shadow, unset);
      --nsh-card-radius: var(--nsh-card-radius, var(--nsh-radius-lg));
      --nsh-card-padding: var(--nsh-card-padding, unset);
      --nsh-card-border-width: var(--nsh-card-border-width, 1px);
    }

    .nsh-card {
      --_card-bg: var(--nsh-card-bg, var(--nsh-color-surface));
      --_card-fg: var(--nsh-card-fg, var(--nsh-color-text));
      --_card-border: var(--nsh-card-border-color, transparent);
      --_card-shadow: var(--nsh-card-shadow, var(--nsh-elevation-1));
      --_card-pad: var(--nsh-card-padding, var(--nsh-space-lg));

      display: block;
      background: var(--_card-bg);
      color: var(--_card-fg);
      border-radius: var(--nsh-card-radius);
      border: var(--nsh-card-border-width) solid var(--_card-border);
      box-shadow: var(--_card-shadow);
    }

    /* Variant */
    .nsh-card--elevated {
      --_card-bg: var(--nsh-card-bg, var(--nsh-color-surface));
      --_card-border: var(--nsh-card-border-color, transparent);
      --_card-shadow: var(--nsh-card-shadow, var(--nsh-elevation-2));
    }

    .nsh-card--outlined {
      --_card-bg: var(--nsh-card-bg, var(--nsh-color-surface));
      --_card-border: var(--nsh-card-border-color, var(--nsh-color-border));
      --_card-shadow: var(--nsh-card-shadow, var(--nsh-elevation-0));
    }

    .nsh-card--filled {
      --_card-bg: var(--nsh-card-bg, var(--nsh-color-surface-1));
      --_card-border: var(--nsh-card-border-color, transparent);
      --_card-shadow: var(--nsh-card-shadow, var(--nsh-elevation-0));
    }

    /* Padding */
    .nsh-card--p-none {
      --_card-pad: var(--nsh-card-padding, 0);
    }

    .nsh-card--p-sm {
      --_card-pad: var(--nsh-card-padding, var(--nsh-space-sm));
    }

    .nsh-card--p-md {
      --_card-pad: var(--nsh-card-padding, var(--nsh-space-lg));
    }

    .nsh-card--p-lg {
      --_card-pad: var(--nsh-card-padding, var(--nsh-space-xl));
    }

    .nsh-card__header,
    .nsh-card__body,
    .nsh-card__footer {
      padding: var(--_card-pad);
    }

    .nsh-card__header:empty,
    .nsh-card__footer:empty {
      display: none;
    }

    .nsh-card__header {
      border-bottom: var(--nsh-card-border-width) solid
        color-mix(in srgb, var(--nsh-color-border) 60%, transparent);
    }

    .nsh-card__footer {
      border-top: var(--nsh-card-border-width) solid
        color-mix(in srgb, var(--nsh-color-border) 60%, transparent);
    }

    .nsh-card--p-none .nsh-card__header,
    .nsh-card--p-none .nsh-card__footer {
      border-width: 0;
    }
  `,
})
export class NshCardComponent {
  readonly variant = input<NshCardVariant>('elevated');
  readonly padding = input<NshCardPadding>('md');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly role = computed(() => (this.ariaLabel() ? 'region' : null));
}
