import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-styles-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="example-stack">
      <div class="example-label">Soft (card-like)</div>
      <nsh-breadcrumb
        [items]="softItems()"
        [preventNavigation]="true"
        [truncateOnClick]="true"
        variant="soft"
        separator="chevron"
        elevation="raised"
        [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
        [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
        [style.--nsh-breadcrumb-item-min-width]="'132px'"
        [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
        [shadow]="true"
      ></nsh-breadcrumb>

      <div class="example-label">Solid (vivid)</div>
      <nsh-breadcrumb
        [items]="baseItems()"
        [preventNavigation]="true"
        [truncateOnClick]="true"
        variant="solid"
        separator="slash"
        elevation="raised"
        [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
        [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
        [style.--nsh-breadcrumb-item-min-width]="'132px'"
        [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
        [shadow]="true"
      ></nsh-breadcrumb>

      <div class="example-label">Segmented / Ribbon</div>
      <nsh-breadcrumb
        [items]="baseItems()"
        [preventNavigation]="true"
        [truncateOnClick]="true"
        variant="segmented"
        separator="chevron"
        elevation="raised"
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
  readonly baseItems = signal<NshBreadcrumbItem[]>([
    { id: 'home', label: 'Home', href: '#' },
    { id: 'profile', label: 'Profile', href: '#' },
    { id: 'settings', label: 'Settings' },
  ]);

  readonly softItems = signal<NshBreadcrumbItem[]>([
    { id: 'home', label: 'Home', href: '#' },
    { id: 'profile', label: 'Profile', href: '#' },
    { id: 'settings', label: 'Settings' },
  ]);

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
