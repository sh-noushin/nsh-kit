import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-checkout-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  template: `
    <nsh-breadcrumb
      [items]="items()"
      [itemIcons]="iconMap()"
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
  `,
})
export class BreadcrumbCheckoutExampleComponent {
  readonly items = signal<NshBreadcrumbItem[]>([
    { id: 'cart', label: 'Cart', href: '#' },
    { id: 'billing', label: 'Billing', href: '#' },
    { id: 'shipping', label: 'Shipping', href: '#' },
    { id: 'payment', label: 'Payment' },
  ]);

  readonly iconMap = signal<Record<string, string>>({
    cart: 'shopping-cart',
    billing: 'credit-card',
    shipping: 'truck',
    payment: 'check',
  });
}

export const breadcrumbCheckoutHtml = `<nsh-breadcrumb
  [items]="items"
  [itemIcons]="iconMap"
  [preventNavigation]="true"
  [truncateOnClick]="true"
  variant="segmented"
  separator="chevron"
  style="--nsh-breadcrumb-item-padding-inline: var(--nsh-space-md); --nsh-breadcrumb-item-padding-block: var(--nsh-space-xs); --nsh-breadcrumb-item-min-width: 132px; --nsh-breadcrumb-font-size: var(--nsh-font-size-sm);"
  elevation="raised"
  [shadow]="true"
></nsh-breadcrumb>`;

export const breadcrumbCheckoutTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshBreadcrumbComponent, type NshBreadcrumbItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-breadcrumb-checkout-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBreadcrumbComponent],
  templateUrl: './breadcrumb-checkout.example.html'
})
export class BreadcrumbCheckoutExampleComponent {
  readonly items: NshBreadcrumbItem[] = [
    { id: 'cart', label: 'Cart', href: '#' },
    { id: 'billing', label: 'Billing', href: '#' },
    { id: 'shipping', label: 'Shipping', href: '#' },
    { id: 'payment', label: 'Payment' }
  ];

  readonly iconMap: Record<string, string> = {
    cart: 'shopping-cart',
    billing: 'credit-card',
    shipping: 'truck',
    payment: 'check'
  };
}`;
