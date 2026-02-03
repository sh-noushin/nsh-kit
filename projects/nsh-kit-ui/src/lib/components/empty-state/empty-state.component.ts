import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NshIconComponent } from '../../foundations/icon';

export type NshEmptyStateSize = 'sm' | 'md' | 'lg';
export type NshEmptyStateAlign = 'start' | 'center';

@Component({
  selector: 'nsh-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshIconComponent],
  host: {
    '[class.nsh-empty-host]': 'true',
    '[class.nsh-empty-host--sm]': "size() === 'sm'",
    '[class.nsh-empty-host--md]': "size() === 'md'",
    '[class.nsh-empty-host--lg]': "size() === 'lg'",
    '[class.nsh-empty-host--align-start]': "align() === 'start'",
    '[class.nsh-empty-host--align-center]': "align() === 'center'",
  },
  template: `
    <section class="nsh-empty" [attr.aria-label]="ariaLabel() ?? null">
      @if (icon(); as iconName) {
        <div class="nsh-empty__icon" aria-hidden="true">
          <nsh-icon [name]="iconName" size="1em"></nsh-icon>
        </div>
      }

      @if (title(); as titleText) {
        <h2 class="nsh-empty__title">{{ titleText }}</h2>
      }

      @if (description(); as descText) {
        <p class="nsh-empty__desc">{{ descText }}</p>
      }

      <div class="nsh-empty__actions">
        <ng-content select="[nshEmptyActions]"></ng-content>
      </div>

      <div class="nsh-empty__secondary">
        <ng-content select="[nshEmptySecondary]"></ng-content>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-empty-gap: var(--nsh-empty-gap, unset);
      --nsh-empty-padding: var(--nsh-empty-padding, unset);
      --nsh-empty-title-color: var(--nsh-empty-title-color, unset);
      --nsh-empty-desc-color: var(--nsh-empty-desc-color, unset);
      --nsh-empty-icon-color: var(--nsh-empty-icon-color, unset);
      --nsh-empty-title-size: var(--nsh-empty-title-size, unset);
      --nsh-empty-desc-size: var(--nsh-empty-desc-size, unset);

      --_empty-gap: var(--nsh-empty-gap, var(--nsh-space-md));
      --_empty-padding: var(--nsh-empty-padding, var(--nsh-space-xl));
      --_empty-title-color: var(--nsh-empty-title-color, var(--nsh-color-text));
      --_empty-desc-color: var(--nsh-empty-desc-color, var(--nsh-color-text-muted));
      --_empty-icon-color: var(--nsh-empty-icon-color, var(--nsh-color-text-muted));
      --_empty-title-size: var(--nsh-empty-title-size, var(--nsh-font-size-lg));
      --_empty-desc-size: var(--nsh-empty-desc-size, var(--nsh-font-size-md));

      --_empty-icon-size: var(--nsh-font-size-xxl);
      --_empty-actions-gap: var(--nsh-space-sm);
    }

    :host(.nsh-empty-host--sm) {
      --_empty-padding: var(--nsh-space-lg);
      --_empty-gap: var(--nsh-space-sm);
      --_empty-title-size: var(--nsh-font-size-md);
      --_empty-desc-size: var(--nsh-font-size-sm);
      --_empty-icon-size: var(--nsh-font-size-xl);
    }

    :host(.nsh-empty-host--md) {
      --_empty-padding: var(--nsh-space-xl);
      --_empty-gap: var(--nsh-space-md);
      --_empty-title-size: var(--nsh-font-size-lg);
      --_empty-desc-size: var(--nsh-font-size-md);
      --_empty-icon-size: var(--nsh-font-size-xxl);
    }

    :host(.nsh-empty-host--lg) {
      --_empty-padding: var(--nsh-space-2xl);
      --_empty-gap: var(--nsh-space-lg);
      --_empty-title-size: var(--nsh-font-size-xl);
      --_empty-desc-size: var(--nsh-font-size-lg);
      --_empty-icon-size: calc(var(--nsh-font-size-xxl) + var(--nsh-space-sm));
    }

    .nsh-empty {
      display: grid;
      gap: var(--_empty-gap);
      padding: var(--_empty-padding);

      min-width: 0;
      max-width: 100%;

      font-family: var(--nsh-font-family);
    }

    :host(.nsh-empty-host--align-center) .nsh-empty {
      justify-items: center;
      text-align: center;
    }

    :host(.nsh-empty-host--align-start) .nsh-empty {
      justify-items: start;
      text-align: start;
    }

    .nsh-empty__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--_empty-icon-color);
      font-size: var(--_empty-icon-size);
      line-height: 1;
    }

    .nsh-empty__title {
      margin: 0;
      color: var(--_empty-title-color);
      font-size: var(--_empty-title-size);
      font-weight: var(--nsh-font-weight-semibold);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-empty__desc {
      margin: 0;
      color: var(--_empty-desc-color);
      font-size: var(--_empty-desc-size);
      line-height: var(--nsh-line-height-relaxed);
      max-width: var(--nsh-empty-max-width, 60ch);
    }

    .nsh-empty__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--_empty-actions-gap);
    }

    .nsh-empty__secondary {
      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-xs);
      color: var(--_empty-desc-color);
      font-size: var(--_empty-desc-size);
    }

    .nsh-empty__actions:empty,
    .nsh-empty__secondary:empty {
      display: none;
    }
  `,
})
export class NshEmptyStateComponent {
  readonly title = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly size = input<NshEmptyStateSize>('md');
  readonly align = input<NshEmptyStateAlign>('center');
  readonly ariaLabel = input<string | undefined>(undefined);
}
