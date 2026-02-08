import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let nextTooltipId = 0;

@Component({
  selector: 'nsh-tooltip-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-tooltip-panel]': 'true',
    role: 'tooltip',
    '[attr.id]': 'panelId()',
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[style.--nsh-tooltip-max-width]': 'maxWidth() ?? null',
  },
  template: `
    @if (hasText()) {
      <div class="nsh-tooltip-panel__content">{{ text() }}</div>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: var(--nsh-tooltip-max-width, unset);

      transform: translate(0, 0);

      background: var(--nsh-tooltip-bg, var(--nsh-color-surface-2));
      color: var(--nsh-tooltip-fg, var(--nsh-color-text));

      border-radius: var(--nsh-tooltip-radius, var(--nsh-radius-sm));
      box-shadow: var(--nsh-tooltip-shadow, var(--nsh-elevation-2));

      padding-inline: var(--nsh-tooltip-padding-x, var(--nsh-space-sm));
      padding-block: var(--nsh-tooltip-padding-y, var(--nsh-space-xs));

      font-family: var(--nsh-font-family);
      font-size: var(--nsh-tooltip-font-size, var(--nsh-font-size-sm));
      line-height: var(--nsh-line-height-normal);

      pointer-events: none;
      user-select: none;
      white-space: pre-wrap;
    }

    :host-context(.nsh-overlay[data-placement='top']) {
      transform: translateY(calc(-1 * var(--nsh-tooltip-offset, var(--nsh-space-xs))));
    }

    :host-context(.nsh-overlay[data-placement='bottom']) {
      transform: translateY(var(--nsh-tooltip-offset, var(--nsh-space-xs)));
    }

    :host-context(.nsh-overlay[data-placement='left']) {
      transform: translateX(calc(-1 * var(--nsh-tooltip-offset, var(--nsh-space-xs))));
    }

    :host-context(.nsh-overlay[data-placement='right']) {
      transform: translateX(var(--nsh-tooltip-offset, var(--nsh-space-xs)));
    }

    .nsh-tooltip-panel__content {
      display: block;
    }
  `,
})
export class NshTooltipPanelComponent {
  readonly text = input('');
  readonly maxWidth = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly panelId = input<string>(`nsh-tooltip-panel-${nextTooltipId++}`);

  readonly hasText = computed(() => (this.text() ?? '').trim().length > 0);
}
