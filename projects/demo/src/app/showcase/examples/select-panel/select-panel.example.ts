import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshSelectPanelComponent,
  type NshSelectPanelItem,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-select-panel-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSelectPanelComponent],
  template: `
    <div class="example-stack">
      <nsh-select-panel
        [items]="items()"
        [activeIndex]="activeIndex()"
        [selectedKey]="selectedKey()"
        (itemHovered)="onHover($event)"
        (itemSelected)="onSelect($event)"
      ></nsh-select-panel>
      <div class="example-meta">Selected: {{ selectedLabel() || 'None' }}</div>
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
export class SelectPanelExampleComponent {
  readonly items = signal<NshSelectPanelItem[]>([
    { key: 'design', label: 'Design', disabled: false, rawValue: 'design' },
    { key: 'engineering', label: 'Engineering', disabled: false, rawValue: 'engineering' },
    { key: 'product', label: 'Product', disabled: true, rawValue: 'product' },
  ]);

  readonly activeIndex = signal(0);
  readonly selectedKey = signal<string | null>('design');
  readonly selectedLabel = signal<string | null>('Design');

  onHover(index: number): void {
    this.activeIndex.set(index);
  }

  onSelect(item: NshSelectPanelItem): void {
    this.selectedKey.set(item.key);
    this.selectedLabel.set(item.label);
  }
}

export const selectPanelHtml = `<nsh-select-panel
  [items]="items"
  [activeIndex]="activeIndex"
  [selectedKey]="selectedKey"
  (itemHovered)="onHover($event)"
  (itemSelected)="onSelect($event)"
></nsh-select-panel>`;

export const selectPanelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshSelectPanelComponent, type NshSelectPanelItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-select-panel-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSelectPanelComponent],
  templateUrl: './select-panel.example.html'
})
export class SelectPanelExampleComponent {
  items: NshSelectPanelItem[] = [
    { key: 'design', label: 'Design', disabled: false, rawValue: 'design' },
    { key: 'engineering', label: 'Engineering', disabled: false, rawValue: 'engineering' },
    { key: 'product', label: 'Product', disabled: true, rawValue: 'product' }
  ];
  activeIndex = 0;
  selectedKey: string | null = 'design';

  onHover(index: number): void {
    this.activeIndex = index;
  }

  onSelect(item: NshSelectPanelItem): void {
    this.selectedKey = item.key;
  }
}`;
