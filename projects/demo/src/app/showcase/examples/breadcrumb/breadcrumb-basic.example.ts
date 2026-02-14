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
        <input class="demo-showcase-color-picker" type="color" [value]="accentColor()" (input)="setAccent($event)" />
      </label>

      <label class="toggle">
        <input type="checkbox" [checked]="showShadow()" (change)="showShadow.set(!showShadow())" />
        Shadow
      </label>
    </div>

    <nsh-breadcrumb
      [items]="items()"
      [preventNavigation]="true"
      [truncateOnClick]="true"
      separator="chevron"
      variant="steps"
      [activeIndex]="3"
      [shadow]="showShadow()"
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
      .toggle {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.78rem;
        font-weight: 600;
        color: #111;
      }

      .toggle input {
        width: 16px;
        height: 16px;
      }

      .control-row {
        display: flex;
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 12px;
      }

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        color: #4c5870;
        font-weight: 600;
      }

      input:not([type='color']):not([type='checkbox']) {
        height: 34px;
        border-radius: 8px;
        border: 1px solid #c8d2e2;
        background: #fff;
        padding-inline: 10px;
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
  readonly showShadow = signal(true);

  readonly surfaceColor = computed(() => `color-mix(in srgb, ${this.accentColor()} 12%, white)`);
  readonly inactiveColor = computed(() => `color-mix(in srgb, ${this.accentColor()} 26%, white)`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }
}

export const breadcrumbBasicHtml = `<div class="control-row">
  <label class="toggle">
    <input type="checkbox" [checked]="showShadow()" (change)="showShadow.set(!showShadow())" />
    Shadow
  </label>
</div>

<nsh-breadcrumb
  [items]="items"
  variant="steps"
  [shadow]="showShadow()"
  [accentColor]="accentColor()"
  style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px;"
></nsh-breadcrumb>`;

export const breadcrumbBasicTs = `import { Component, signal } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'example-breadcrumb-basic',
  standalone: true,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-basic.example.html'
})
export class BreadcrumbBasicExampleComponent {
  readonly showShadow = signal(true);
  readonly accentColor = signal('#2e7d32');

  readonly items: NshBreadcrumbItem[] = [
    { label: 'Home', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Cooking', href: '#' },
    { label: 'Ice cream' }
  ];
}`;
