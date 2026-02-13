import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

type CrumbId = 'home' | 'blog' | 'cooking' | 'iceCream';

@Component({
  selector: 'demo-breadcrumb-icon-customize-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="control-row">
      <label class="field">
        Accent color
        <input type="color" [value]="accentColor()" (input)="setAccent($event)" />
      </label>

      @for (choice of iconChoices; track choice.id) {
        <label class="field">
          {{ choice.label }} icon
          <select [value]="selectedIcons()[choice.id]" (change)="setIcon(choice.id, $event)">
            @for (icon of iconOptions; track icon) {
              <option [value]="icon">{{ icon }}</option>
            }
          </select>
        </label>
      }
    </div>

    <nsh-breadcrumb
      [items]="items()"
      variant="segmented"
      separator="chevron"
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
        grid-template-columns: repeat(5, minmax(120px, 1fr));
        gap: 10px;
        margin-bottom: 12px;
      }

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        color: #4c5870;
        font-weight: 600;
      }

      input,
      select {
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
export class BreadcrumbIconCustomizeExampleComponent {
  readonly iconOptions = ['home', 'news', 'fork-knife', 'ice-cream', 'user', 'settings', 'sparkles'];

  readonly iconChoices: ReadonlyArray<{ id: CrumbId; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'blog', label: 'Blog' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'iceCream', label: 'Ice cream' },
  ];

  readonly accentColor = signal('#ec4899');

  readonly selectedIcons = signal<Record<CrumbId, string>>({
    home: 'home',
    blog: 'news',
    cooking: 'fork-knife',
    iceCream: 'ice-cream',
  });

  readonly items = computed<NshBreadcrumbItem[]>(() => {
    const selected = this.selectedIcons();
    return [
      { id: 'home', label: 'Home', icon: selected.home, href: '/showcase/breadcrumb' },
      { id: 'blog', label: 'Blog', icon: selected.blog, href: '/showcase/breadcrumb' },
      {
        id: 'cooking',
        label: 'Cooking',
        icon: selected.cooking,
        href: '/showcase/breadcrumb',
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

export const breadcrumbIconCustomizeHtml = `<nsh-breadcrumb
  [items]="items()"
  variant="segmented"
  separator="chevron"
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
></nsh-breadcrumb>`;

export const breadcrumbIconCustomizeTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-icon-customize-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-icon-customize.example.html'
})
export class BreadcrumbIconCustomizeExampleComponent {
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
      { id: 'home', label: 'Home', icon: selected.home, href: '/showcase/breadcrumb' },
      { id: 'blog', label: 'Blog', icon: selected.blog, href: '/showcase/breadcrumb' },
      { id: 'cooking', label: 'Cooking', icon: selected.cooking, href: '/showcase/breadcrumb' },
      { id: 'iceCream', label: 'Ice cream', icon: selected.iceCream }
    ];
  });
}`;
