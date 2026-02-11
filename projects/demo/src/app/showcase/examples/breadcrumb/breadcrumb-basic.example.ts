import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <nsh-breadcrumb [items]="items()" separator="chevron"></nsh-breadcrumb>
  `,
})
export class BreadcrumbBasicExampleComponent {
  readonly items = signal<NshBreadcrumbItem[]>([
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' },
  ]);
}

export const breadcrumbBasicHtml = `<nsh-breadcrumb [items]="items" separator="chevron"></nsh-breadcrumb>`;

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
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb' }
  ];
}`;
