import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshAutocompletePanelComponent,
  type NshAutocompleteItem,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-autocomplete-panel-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshAutocompletePanelComponent],
  template: `
    <div class="example-stack">
      <nsh-autocomplete-panel
        [items]="items()"
        [activeIndex]="activeIndex()"
        (itemHovered)="onHover($event)"
        (itemSelected)="onSelect($event)"
      ></nsh-autocomplete-panel>
      <div class="example-meta">Selected: {{ selected() || 'None' }}</div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-sm);
        max-width: 320px;
      }

      .example-meta {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class AutocompletePanelExampleComponent {
  readonly items = signal<NshAutocompleteItem<string>[]>([
    { label: 'Alex Rivera', value: 'alex' },
    { label: 'Jordan Lee', value: 'jordan' },
    { label: 'Taylor Quinn', value: 'taylor' },
  ]);

  readonly activeIndex = signal(0);
  readonly selected = signal<string | null>(null);

  onHover(index: number): void {
    this.activeIndex.set(index);
  }

  onSelect(item: NshAutocompleteItem<string>): void {
    this.selected.set(item.label);
  }
}

export const autocompletePanelHtml = `<nsh-autocomplete-panel
  [items]="items"
  [activeIndex]="activeIndex"
  (itemHovered)="onHover($event)"
  (itemSelected)="onSelect($event)"
></nsh-autocomplete-panel>`;

export const autocompletePanelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshAutocompletePanelComponent, type NshAutocompleteItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-autocomplete-panel-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshAutocompletePanelComponent],
  templateUrl: './autocomplete-panel.example.html'
})
export class AutocompletePanelExampleComponent {
  items: NshAutocompleteItem<string>[] = [
    { label: 'Alex Rivera', value: 'alex' },
    { label: 'Jordan Lee', value: 'jordan' },
    { label: 'Taylor Quinn', value: 'taylor' }
  ];
  activeIndex = 0;

  onHover(index: number): void {
    this.activeIndex = index;
  }

  onSelect(item: NshAutocompleteItem<string>): void {
    // handle selection
  }
}`;
