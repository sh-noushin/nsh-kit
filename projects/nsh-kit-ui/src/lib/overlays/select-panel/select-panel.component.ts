import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface NshSelectPanelItem {
  key: string;
  label: string;
  disabled: boolean;
  rawValue: any;
}

let nextPanelId = 0;

@Component({
  selector: 'nsh-select-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-select-panel]': 'true',
    '[attr.id]': 'panelId()',
    '[attr.aria-label]': 'ariaLabel()',
    role: 'listbox',
  },
  template: `
    @for (item of items(); track item.key) {
      <div
        class="nsh-select-panel__row"
        role="option"
        [id]="optionId($index)"
        [attr.aria-disabled]="item.disabled ? 'true' : null"
        [attr.aria-selected]="item.key === selectedKey() ? 'true' : 'false'"
        [class.nsh-select-panel__row--active]="isActiveIndex($index)"
        [class.nsh-select-panel__row--selected]="item.key === selectedKey()"
        [class.nsh-select-panel__row--disabled]="item.disabled"
        (mouseenter)="onItemHover($index, item)"
        (mousedown)="onItemMouseDown($event, item, $index)"
      >
        {{ item.label }}
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      margin-top: var(--nsh-space-xs);

      max-height: var(--nsh-select-panel-max-height, none);
      overflow: auto;

      border-radius: var(--nsh-select-panel-radius, var(--nsh-radius-md));
      border: 1px solid var(--nsh-select-panel-border-color, var(--nsh-color-border));
      background: var(--nsh-select-panel-bg, var(--nsh-color-surface-1));
      box-shadow: var(--nsh-select-panel-shadow, var(--nsh-elevation-2));

      padding-block: var(--nsh-space-xs);
    }

    :host([style]) {
      max-height: var(--_sel-panel-max-height, var(--nsh-select-panel-max-height, none));
    }

    .nsh-select-panel__row {
      display: flex;
      align-items: center;
      padding-block: var(--nsh-select-option-padding-y, var(--nsh-density-padding-block));
      padding-inline: var(--nsh-select-option-padding-x, var(--nsh-density-padding-inline));
      border-radius: var(--nsh-radius-sm);

      cursor: pointer;
      user-select: none;

      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
      color: var(--nsh-color-text);

      transition: background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-select-panel__row:hover {
      background: var(
        --nsh-select-option-hover-bg,
        color-mix(in srgb, var(--nsh-color-outline) 14%, transparent)
      );
    }

    .nsh-select-panel__row--active {
      background: var(
        --nsh-select-option-active-bg,
        color-mix(in srgb, var(--nsh-color-outline) 22%, transparent)
      );
    }

    .nsh-select-panel__row--selected {
      background: var(
        --nsh-select-option-selected-bg,
        color-mix(in srgb, var(--nsh-color-primary) 16%, transparent)
      );
    }

    .nsh-select-panel__row--disabled {
      color: var(--nsh-select-option-disabled-fg, var(--nsh-color-text-disabled));
      cursor: not-allowed;
    }

    .nsh-select-panel__row--disabled:hover {
      background: transparent;
    }
  `,
})
export class NshSelectPanelComponent {
  readonly items = input<ReadonlyArray<NshSelectPanelItem>>([]);
  readonly activeIndex = input(-1);
  readonly selectedKey = input<string | null>(null);
  readonly ariaLabel = input('Options');
  readonly maxHeightCssVar = input<string | null>(null);

  readonly itemHovered = output<number>();
  readonly itemSelected = output<NshSelectPanelItem>();

  readonly panelId = input<string>(`nsh-select-panel-${nextPanelId++}`);

  optionId(index: number): string {
    return `${this.panelId()}-opt-${index}`;
  }

  isActiveIndex(index: number): boolean {
    return this.activeIndex() === index;
  }

  onItemHover(index: number, item: NshSelectPanelItem): void {
    if (item.disabled) {
      return;
    }
    this.itemHovered.emit(index);
  }

  onItemMouseDown(event: MouseEvent, item: NshSelectPanelItem, index: number): void {
    event.preventDefault();

    if (item.disabled) {
      return;
    }

    this.itemHovered.emit(index);
    this.itemSelected.emit(item);
  }
}
