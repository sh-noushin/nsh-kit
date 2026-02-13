import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="control-row">
      <label class="field">
        Accent color
        <input type="color" [value]="accentColor()" (input)="setAccent($event)" />
      </label>
    </div>

    <nsh-breadcrumb
      [items]="items()"
      [preventNavigation]="true"
      [truncateOnClick]="true"
      separator="chevron"
      variant="steps"
      [activeIndex]="3"
      [accentColor]="accentColor()"
      [style.--nsh-breadcrumb-surface]="surfaceColor()"
      [style.--nsh-breadcrumb-item-bg]="inactiveColor()"
      [style.--nsh-breadcrumb-item-bg-current]="accentColor()"
      [style.--nsh-breadcrumb-text-color-current]="accentColor()"
      [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
      [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
      [style.--nsh-breadcrumb-item-min-width]="'132px'"
      [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
    ></nsh-breadcrumb>
  `,
  styles: [
    `
      .control-row {
        display: grid;
        grid-template-columns: minmax(120px, 200px);
        margin-bottom: 10px;
      }

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        color: #4c5870;
        font-weight: 600;
      }

      input {
        height: 34px;
        border-radius: 8px;
        border: 1px solid #c8d2e2;
        background: #fff;
        padding-inline: 10px;
      }

      input[type='color'] {
        padding: 4px;
      }
    `,
  ],
})
export class BreadcrumbBasicExampleComponent {
  readonly items = signal<NshBreadcrumbItem[]>([
    { id: 'home', label: 'Home', href: '#' },
    { id: 'blog', label: 'Blog', href: '#' },
    { id: 'cooking', label: 'Cooking', href: '#' },
    { id: 'iceCream', label: 'Ice cream' },
  ]);

  readonly accentColor = signal('#2e7d32');

  readonly surfaceColor = computed(() => `color-mix(in srgb, ${this.accentColor()} 12%, white)`);
  readonly inactiveColor = computed(() => `color-mix(in srgb, ${this.accentColor()} 26%, white)`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }
}

export const breadcrumbBasicHtml = `<nsh-breadcrumb
  [items]="items"
  [preventNavigation]="true"
  [truncateOnClick]="true"
  separator="chevron"
  variant="steps"
  [activeIndex]="3"
  [accentColor]="accentColor"
  [style.--nsh-breadcrumb-surface]="surfaceColor()"
  [style.--nsh-breadcrumb-item-bg]="inactiveColor()"
  [style.--nsh-breadcrumb-item-bg-current]="accentColor()"
  [style.--nsh-breadcrumb-text-color-current]="accentColor()"
  style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px; --nsh-breadcrumb-font-size: var(--nsh-font-size-sm);"
></nsh-breadcrumb>`;

export const breadcrumbBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-basic.example.html'
})
export class BreadcrumbBasicExampleComponent {
  readonly items: NshBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'blog', label: 'Blog', href: '#' },
    { id: 'cooking', label: 'Cooking', href: '#' },
    { id: 'iceCream', label: 'Ice cream' }
  ];

  accentColor = '#2e7d32';
}`;
