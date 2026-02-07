import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { NshAutocompleteItem } from '../../forms/autocomplete/autocomplete.types';

let nextPanelId = 0;

@Component({
  selector: 'nsh-autocomplete-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-ac__panel]': 'true',
    '[attr.id]': 'panelId()',
    role: 'listbox',
  },
  template: `
    @if (loading()) {
      <div class="nsh-ac__row nsh-ac__row--meta" role="option" aria-disabled="true">
        Loading…
      </div>
    } @else {
      @if (items().length === 0) {
        <div class="nsh-ac__row nsh-ac__row--meta" role="option" aria-disabled="true">
          {{ noResultsText() }}
        </div>
      } @else {
        @for (item of items(); track $index) {
          <div
            class="nsh-ac__row"
            role="option"
            [id]="optionId($index)"
            [attr.aria-disabled]="item.disabled ? 'true' : null"
            [attr.aria-selected]="isActiveIndex($index) ? 'true' : 'false'"
            [class.nsh-ac__row--active]="isActiveIndex($index)"
            [class.nsh-ac__row--disabled]="!!item.disabled"
            (mouseenter)="onItemHover($index, item)"
            (mousedown)="onItemMouseDown($event, item, $index)"
          >
            {{ item.label }}
          </div>
        }
      }
    }
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      margin-top: var(--nsh-space-xs);

      max-height: var(--nsh-ac-panel-max-height, none);
      overflow: auto;

      border-radius: var(--nsh-ac-radius, var(--nsh-radius-md));
      border: 1px solid var(--nsh-ac-panel-border-color, var(--nsh-color-border));
      background: var(--nsh-ac-panel-bg, var(--nsh-color-surface-1));
      box-shadow: var(--nsh-ac-panel-shadow, var(--nsh-elevation-2));

      padding-block: var(--nsh-space-xs);
    }

    .nsh-ac__row {
      display: flex;
      align-items: center;
      padding-block: var(--nsh-ac-option-padding-y, var(--nsh-density-padding-block));
      padding-inline: var(--nsh-ac-option-padding-x, var(--nsh-density-padding-inline));
      border-radius: var(--nsh-radius-sm);

      cursor: pointer;
      user-select: none;

      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
      color: var(--nsh-color-text);

      transition: background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-ac__row:hover {
      background: var(
        --nsh-ac-option-hover-bg,
        color-mix(in srgb, var(--nsh-color-outline) 14%, transparent)
      );
    }

    .nsh-ac__row--active {
      background: var(
        --nsh-ac-option-active-bg,
        color-mix(in srgb, var(--nsh-color-outline) 22%, transparent)
      );
    }

    .nsh-ac__row--disabled {
      color: var(--nsh-ac-option-disabled-fg, var(--nsh-color-text-disabled));
      cursor: not-allowed;
    }

    .nsh-ac__row--disabled:hover {
      background: transparent;
    }

    .nsh-ac__row--meta {
      cursor: default;
      color: var(--nsh-color-text-muted);
    }

    .nsh-ac__row--meta:hover {
      background: transparent;
    }
  `,
})
export class NshAutocompletePanelComponent {
  readonly items = input<ReadonlyArray<NshAutocompleteItem<any>>>([]);
  readonly activeIndex = input(-1);
  readonly noResultsText = input('No results');
  readonly loading = input(false);

  readonly itemHovered = output<number>();
  readonly itemSelected = output<NshAutocompleteItem<any>>();

  readonly panelId = input<string>(`nsh-ac-panel-${nextPanelId++}`);

  optionId(index: number): string {
    return `${this.panelId()}-opt-${index}`;
  }

  isActiveIndex(index: number): boolean {
    return this.activeIndex() === index;
  }

  onItemHover(index: number, item: NshAutocompleteItem<any>): void {
    if (item.disabled) {
      return;
    }
    this.itemHovered.emit(index);
  }

  onItemMouseDown(event: MouseEvent, item: NshAutocompleteItem<any>, index: number): void {
    event.preventDefault();

    if (item.disabled) {
      return;
    }

    this.itemHovered.emit(index);
    this.itemSelected.emit(item);
  }
}
