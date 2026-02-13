import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-styles-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="example-stack">
      <label class="toggle">
        <input type="checkbox" [checked]="showShadow()" (change)="setShadow($event)" />
        Shadow
      </label>

      <div class="example-block">
        <label class="field">
          Soft (card-like)
          <input class="demo-showcase-color-picker" type="color" [value]="softAccent()" (input)="setSoftAccent($event)" />
        </label>
        <nsh-breadcrumb
          [items]="softItems"
          [preventNavigation]="true"
          [truncateOnClick]="true"
          variant="soft"
          separator="chevron"
          elevation="flat"
          [accentColor]="softAccent()"
          [style.--nsh-breadcrumb-surface]="softSurface()"
          [style.--nsh-breadcrumb-item-bg]="softInactive()"
          [style.--nsh-breadcrumb-item-bg-current]="softAccent()"
          [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
          [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
          [style.--nsh-breadcrumb-item-min-width]="'132px'"
          [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
          [shadow]="showShadow()"
        ></nsh-breadcrumb>
      </div>

      <div class="example-block">
        <label class="field">
          Solid (vivid)
          <input class="demo-showcase-color-picker" type="color" [value]="solidAccent()" (input)="setSolidAccent($event)" />
        </label>
        <nsh-breadcrumb
          [items]="baseItems"
          [preventNavigation]="true"
          [truncateOnClick]="true"
          variant="solid"
          separator="slash"
          elevation="flat"
          [accentColor]="solidAccent()"
          [style.--nsh-breadcrumb-surface]="solidSurface()"
          [style.--nsh-breadcrumb-item-bg]="'transparent'"
          [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
          [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
          [style.--nsh-breadcrumb-item-min-width]="'132px'"
          [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
          [shadow]="showShadow()"
        ></nsh-breadcrumb>
      </div>

      <div class="example-block">
        <label class="field">
          Segmented / Ribbon
          <input class="demo-showcase-color-picker" type="color" [value]="segmentedAccent()" (input)="setSegmentedAccent($event)" />
        </label>
        <nsh-breadcrumb
          [items]="baseItems"
          [preventNavigation]="true"
          [truncateOnClick]="true"
          variant="segmented"
          separator="chevron"
          elevation="flat"
          [accentColor]="segmentedAccent()"
          [style.--nsh-breadcrumb-surface]="segmentedSurface()"
          [style.--nsh-breadcrumb-item-bg]="segmentedInactive()"
          [style.--nsh-breadcrumb-item-bg-current]="segmentedAccent()"
          [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
          [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
          [style.--nsh-breadcrumb-item-min-width]="'132px'"
          [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
          [shadow]="showShadow()"
        ></nsh-breadcrumb>
      </div>
    </div>
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

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        color: #111;
      }

      .example-stack {
        display: grid;
        gap: 18px;
      }

      .example-block {
        display: grid;
        gap: 10px;
        padding: 10px 0;
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
  readonly showShadow = signal(true);

  readonly softSurface = computed(() => `color-mix(in srgb, ${this.softAccent()} 10%, white)`);
  readonly softInactive = computed(() => `color-mix(in srgb, ${this.softAccent()} 20%, white)`);

  readonly solidSurface = computed(() => `color-mix(in srgb, ${this.solidAccent()} 86%, black)`);

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

  setShadow(event: Event): void {
    this.showShadow.set((event.target as HTMLInputElement | null)?.checked ?? true);
  }
}

export const breadcrumbStylesHtml = `<div class="example-stack">
  <label class="toggle">
    <input type="checkbox" [checked]="showShadow()" (change)="setShadow($event)" />
    Shadow
  </label>

  <!-- Soft Variant -->
  <div class="example-block">
    <label class="field">
      Soft (card-like)
      <input class="demo-showcase-color-picker" type="color" [value]="softAccent()" (input)="setSoftAccent($event)" />
    </label>
    <nsh-breadcrumb
      [items]="baseItems"
      variant="soft"
      [shadow]="showShadow()"
      [accentColor]="softAccent()"
    ></nsh-breadcrumb>
  </div>

  <!-- Segmented Variant -->
  <div class="example-block">
    <label class="field" style="color: var(--nsh-breadcrumb-accent)">
      Segmented
      <input class="demo-showcase-color-picker" type="color" [value]="segmentedAccent()" (input)="setSegmentedAccent($event)"/>
    </label>
    <nsh-breadcrumb
      [items]="baseItems"
      variant="segmented"
      [shadow]="showShadow()"
      [accentColor]="segmentedAccent()"
    ></nsh-breadcrumb>
  </div>
</div>`;

export const breadcrumbStylesTs = `import { Component, signal } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'example-breadcrumb-styles',
  standalone: true,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-styles.example.html'
})
export class BreadcrumbStylesExampleComponent {
  readonly showShadow = signal(true);
  readonly softAccent = signal('#673ab7');

  readonly baseItems: NshBreadcrumbItem[] = [
    { label: 'Home', href: '#' },
    { label: 'Products', href: '#' },
    { label: 'Details' }
  ];

  setShadow(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.showShadow.set(checked);
  }

  setSoftAccent(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.softAccent.set(value);
  }
}`;
