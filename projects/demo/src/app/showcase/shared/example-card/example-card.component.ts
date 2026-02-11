import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NshCardComponent } from 'nsh-kit-ui';

import { CodeTabsComponent } from '../code-tabs/code-tabs.component';

@Component({
  selector: 'demo-example-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshCardComponent, CodeTabsComponent],
  template: `
    <nsh-card variant="outlined" padding="none" class="example-card">
      <div nshCardHeader class="example-card__header">
        <div class="example-card__title">{{ title() }}</div>
      </div>

      <div class="example-card__body">
        <demo-code-tabs [html]="html()" [ts]="ts()">
          <ng-content></ng-content>
        </demo-code-tabs>
      </div>
    </nsh-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .example-card {
        border-radius: var(--nsh-radius-xl);
        box-shadow: var(--nsh-elevation-1);
        background: #ffffff;
      }

      .example-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--nsh-space-md) var(--nsh-space-lg);
        border-bottom: 1px solid color-mix(in srgb, var(--nsh-color-outline) 70%, transparent);
        background: linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%);
      }

      .example-card__title {
        font-size: var(--nsh-font-size-md);
        font-weight: var(--nsh-font-weight-semibold);
      }

      .example-card__body {
        padding: var(--nsh-space-lg);
      }
    `,
  ],
})
export class ExampleCardComponent {
  readonly title = input('');
  readonly html = input('');
  readonly ts = input('');
}
