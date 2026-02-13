import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <div class="palette-row">
      <button type="button" class="swatch swatch--pink" (click)="setAccent('#e91e63')" aria-label="Pink"></button>
      <button type="button" class="swatch swatch--blue" (click)="setAccent('#1976d2')" aria-label="Blue"></button>
      <button type="button" class="swatch swatch--purple" (click)="setAccent('#6a5acd')" aria-label="Purple"></button>
      <button type="button" class="swatch swatch--green" (click)="setAccent('#2e7d32')" aria-label="Green"></button>
    </div>

    <nsh-breadcrumb
      [items]="items()"
      separator="chevron"
      variant="steps"
      [activeIndex]="0"
      [accentColor]="accentColor()"
      [style.--nsh-breadcrumb-item-padding-inline]="'var(--nsh-space-md)'"
      [style.--nsh-breadcrumb-item-padding-block]="'var(--nsh-space-xs)'"
      [style.--nsh-breadcrumb-item-min-width]="'132px'"
      [style.--nsh-breadcrumb-font-size]="'var(--nsh-font-size-sm)'"
      elevation="raised"
      [shadow]="true"
    ></nsh-breadcrumb>
  `,
  styles: [
    `
      .palette-row {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }

      .swatch {
        width: 22px;
        height: 22px;
        border-radius: 999px;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.16);
        cursor: pointer;
      }

      .swatch--pink { background: #e91e63; }
      .swatch--blue { background: #1976d2; }
      .swatch--purple { background: #6a5acd; }
      .swatch--green { background: #2e7d32; }
    `,
  ],
})
export class BreadcrumbBasicExampleComponent {
  readonly items = signal<NshBreadcrumbItem[]>([
    { id: 'ecmascript', label: 'ECMAScript', href: '/showcase/breadcrumb' },
    { id: 'html', label: 'HTML5', href: '/showcase/breadcrumb' },
    { id: 'node', label: 'Node.js', href: '/showcase/breadcrumb' },
    { id: 'linux', label: 'Linux' },
  ]);

  readonly accentColor = signal('#e91e63');

  setAccent(color: string): void {
    this.accentColor.set(color);
  }
}

export const breadcrumbBasicHtml = `<nsh-breadcrumb
  [items]="items"
  separator="chevron"
  variant="steps"
  [activeIndex]="0"
  [accentColor]="accentColor"
  style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px; --nsh-breadcrumb-font-size: var(--nsh-font-size-sm);"
  elevation="raised"
  [shadow]="true"
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
    { id: 'ecmascript', label: 'ECMAScript', href: '/showcase/breadcrumb' },
    { id: 'html', label: 'HTML5', href: '/showcase/breadcrumb' },
    { id: 'node', label: 'Node.js', href: '/showcase/breadcrumb' },
    { id: 'linux', label: 'Linux' }
  ];

  accentColor = '#e91e63';
}`;
