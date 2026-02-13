import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

type CrumbId = 'home' | 'blog' | 'cooking' | 'iceCream';

@Component({
  selector: 'demo-breadcrumb-icon-customize-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="control-row control-row--top">
      <div class="field">
        Accent color
        <input class="demo-showcase-color-picker" type="color" [value]="accentColor()" (input)="setAccent($event)" />
      </div>

      <label class="toggle">
        <input type="checkbox" [checked]="showShadow()" (change)="showShadow.set(!showShadow())" />
        <span>Shadow</span>
      </label>
    </div>

    <div class="control-row control-row--icons">
      @for (choice of iconChoices; track choice.id) {
        <div class="field">
          {{ choice.label }} icon
          <select [value]="selectedIcons()[choice.id]" (change)="setIcon(choice.id, $event)">
            @for (icon of iconOptions; track icon) {
              <option [value]="icon">{{ icon }}</option>
            }
          </select>
        </div>
      }
    </div>

    <nsh-breadcrumb
      [items]="items()"
      [preventNavigation]="true"
      [truncateOnClick]="true"
      variant="segmented"
      separator="chevron"
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
        min-width: 16px;
        height: 16px;
        margin: 0;
      }

      .control-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .control-row--top {
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 10px;
      }

      .control-row--top .toggle {
        align-self: end;
        margin-bottom: 8px;
      }

      .control-row--icons {
        margin-bottom: 16px;
      }

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        color: #111;
        font-weight: 600;
      }

      input:not([type='checkbox']):not([type='color']),
      select {
        height: 30px;
        min-width: 100px;
        border-radius: 8px;
        border: 1px solid #c8d2e2;
        background: #fff;
        padding-inline: 8px;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class BreadcrumbIconCustomizeExampleComponent {
  readonly iconOptions = ['home', 'news', 'fork-knife', 'ice-cream', 'user', 'settings', 'sparkles'];

  readonly iconChoices: ReadonlyArray<{ id: CrumbId; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'blog', label: 'Blog' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'iceCream', label: 'Ice cream' },
  ];

  readonly accentColor = signal('#ec4899');
  readonly showShadow = signal(true);

  readonly selectedIcons = signal<Record<CrumbId, string>>({
    home: 'home',
    blog: 'news',
    cooking: 'fork-knife',
    iceCream: 'ice-cream',
  });

  readonly items = computed<NshBreadcrumbItem[]>(() => {
    const selected = this.selectedIcons();
    return [
      { id: 'home', label: 'Home', icon: selected.home, href: '#' },
      { id: 'blog', label: 'Blog', icon: selected.blog, href: '#' },
      {
        id: 'cooking',
        label: 'Cooking',
        icon: selected.cooking,
        href: '#',
      },
      { id: 'iceCream', label: 'Ice cream', icon: selected.iceCream },
    ];
  });

  readonly surfaceColor = computed(() => `color-mix(in srgb, ${this.accentColor()} 12%, white)`);
  readonly inactiveColor = computed(() => `color-mix(in srgb, ${this.accentColor()} 26%, white)`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }

  setIcon(id: CrumbId, event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value;
    if (!value) {
      return;
    }

    this.selectedIcons.update((current) => ({
      ...current,
      [id]: value,
    }));
  }
}

export const breadcrumbIconCustomizeHtml = `<div class="control-row control-row--top">
  <div class="field">
    Accent color
    <input class="demo-showcase-color-picker" type="color" [value]="accentColor()" (input)="setAccent($event)" />
  </div>

  <label class="toggle">
    <input type="checkbox" [checked]="showShadow()" (change)="showShadow.set(!showShadow())" />
    <span>Shadow</span>
  </label>
</div>

<div class="control-row control-row--icons">
  @for (choice of iconChoices; track choice.id) {
    <div class="field">
      {{ choice.label }} icon
      <select [value]="selectedIcons()[choice.id]" (change)="setIcon(choice.id, $event)">
        @for (icon of iconOptions; track icon) {
          <option [value]="icon">{{ icon }}</option>
        }
      </select>
    </div>
  }
</div>

<nsh-breadcrumb
  [items]="items"
  variant="segmented"
  [shadow]="showShadow()"
  [accentColor]="accentColor()"
></nsh-breadcrumb>`;

export const breadcrumbIconCustomizeTs = `import { Component, computed, signal } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'example-breadcrumb-icons',
  standalone: true,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-icon-customize.example.html'
})
export class BreadcrumbIconCustomizeExampleComponent {
  readonly showShadow = signal(true);
  readonly accentColor = signal('#ec4899');

  readonly selectedIcons = signal({
    home: 'home',
    blog: 'news',
    cooking: 'fork-knife',
    iceCream: 'ice-cream'
  });

  readonly items = computed<NshBreadcrumbItem[]>(() => {
    const selected = this.selectedIcons();
    return [
      { id: 'home', label: 'Home', icon: selected.home, href: '#' },
      { id: 'blog', label: 'Blog', icon: selected.blog, href: '#' },
      { id: 'cooking', label: 'Cooking', icon: selected.cooking, href: '#' },
      { id: 'iceCream', label: 'Ice cream', icon: selected.iceCream }
    ];
  });
}`;
