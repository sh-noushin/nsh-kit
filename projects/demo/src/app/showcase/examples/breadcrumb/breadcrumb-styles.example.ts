import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-styles-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="control-grid">
      <label class="field">
        Soft Accent
        <input type="color" [value]="softAccent()" (input)="setSoftAccent($event)" />
      </label>
      <label class="field">
        Solid Accent
        <input type="color" [value]="solidAccent()" (input)="setSolidAccent($event)" />
      </label>
      <label class="field">
        Segmented Accent
        <input type="color" [value]="segmentedAccent()" (input)="setSegmentedAccent($event)" />
      </label>
    </div>

    <div class="example-stack">
      <div class="example-label">Soft (card-like)</div>
      <nsh-breadcrumb
        [items]="softItems"
        [preventNavigation]="true"
        [truncateOnClick]="true"
        variant="soft"
        separator="chevron"
        elevation="raised"
        [accentColor]="softAccent()"
        [style.--nsh-breadcrumb-surface]="softSurface()"
        [style.--nsh-breadcrumb-item-bg]="softInactive()"
        [style.--nsh-breadcrumb-item-bg-current]="softAccent()"
        [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
        [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
        [style.--nsh-breadcrumb-item-min-width]="'132px'"
        [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
        [shadow]="true"
      ></nsh-breadcrumb>

      <div class="example-label">Solid (vivid)</div>
      <nsh-breadcrumb
        [items]="baseItems"
        [preventNavigation]="true"
        [truncateOnClick]="true"
        variant="solid"
        separator="slash"
        elevation="raised"
        [accentColor]="solidAccent()"
        [style.--nsh-breadcrumb-surface]="'#1976d2'"
        [style.--nsh-breadcrumb-item-bg]="'transparent'"
        [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
        [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
        [style.--nsh-breadcrumb-item-min-width]="'132px'"
        [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
        [shadow]="true"
      ></nsh-breadcrumb>

      <div class="example-label">Segmented / Ribbon</div>
      <nsh-breadcrumb
        [items]="baseItems"
        [preventNavigation]="true"
        [truncateOnClick]="true"
        variant="segmented"
        separator="chevron"
        elevation="raised"
        [accentColor]="segmentedAccent()"
        [style.--nsh-breadcrumb-surface]="segmentedSurface()"
        [style.--nsh-breadcrumb-item-bg]="segmentedInactive()"
        [style.--nsh-breadcrumb-item-bg-current]="segmentedAccent()"
        [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
        [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
        [style.--nsh-breadcrumb-item-min-width]="'132px'"
        [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
        [shadow]="true"
      ></nsh-breadcrumb>
    </div>
  `,
  styles: [
    `
      .control-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 24px;
      }

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        color: #4c5870;
        font-weight: 600;
        min-width: 140px;
      }

      input[type='color'] {
        height: 34px;
        width: 100%;
        border-radius: 8px;
        border: 1px solid #c8d2e2;
        background: #fff;
        padding: 4px;
        cursor: pointer;
      }

      .example-stack {
        display: grid;
        gap: 14px;
      }

      .example-label {
        font-size: 0.86rem;
        font-weight: 700;
        color: #4c5870;
        letter-spacing: 0.02em;
      }
    `,
  ],
})
export class BreadcrumbStylesExampleComponent {
  readonly baseItems: NshBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'profile', label: 'Profile', href: '#' },
    { id: 'settings', label: 'Settings' },
  ];

  readonly softItems: NshBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'profile', label: 'Profile', href: '#' },
    { id: 'settings', label: 'Settings' },
  ];

  readonly softAccent = signal('#673ab7');
  readonly solidAccent = signal('#1976d2');
  readonly segmentedAccent = signal('#c2185b');

  readonly softSurface = computed(() => `color-mix(in srgb, ${this.softAccent()} 10%, white)`);
  readonly softInactive = computed(() => `color-mix(in srgb, ${this.softAccent()} 20%, white)`);

  readonly segmentedSurface = computed(() => `color-mix(in srgb, ${this.segmentedAccent()} 12%, white)`);
  readonly segmentedInactive = computed(() => `color-mix(in srgb, ${this.segmentedAccent()} 26%, white)`);

  setSoftAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) this.softAccent.set(value);
  }

  setSolidAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) this.solidAccent.set(value);
  }

  setSegmentedAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) this.segmentedAccent.set(value);
  }
}

export const breadcrumbStylesHtml = `<div class="example-stack">
  <nsh-breadcrumb
    [items]="softItems"
    [preventNavigation]="true"
    [truncateOnClick]="true"
    variant="soft"
    separator="chevron"
    elevation="raised"
    style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px; --nsh-breadcrumb-font-size: var(--nsh-font-size-sm);"
    [shadow]="true"
  ></nsh-breadcrumb>

  <nsh-breadcrumb
    [items]="baseItems"
    [preventNavigation]="true"
    [truncateOnClick]="true"
    variant="solid"
    separator="slash"
    elevation="raised"
    style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px; --nsh-breadcrumb-font-size: var(--nsh-font-size-sm);"
    [shadow]="true"
  ></nsh-breadcrumb>

  <nsh-breadcrumb
    [items]="baseItems"
    [preventNavigation]="true"
    [truncateOnClick]="true"
    variant="segmented"
    separator="chevron"
    elevation="raised"
    style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px; --nsh-breadcrumb-font-size: var(--nsh-font-size-sm);"
    [shadow]="true"
  ></nsh-breadcrumb>
</div>`;

export const breadcrumbStylesTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-styles-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-styles.example.html'
})
export class BreadcrumbStylesExampleComponent {
  readonly baseItems: NshBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'profile', label: 'Profile', href: '#' },
    { id: 'settings', label: 'Settings' }
  ];

  readonly softItems: NshBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'profile', label: 'Profile', href: '#' },
    { id: 'settings', label: 'Settings' }
  ];

}`;
