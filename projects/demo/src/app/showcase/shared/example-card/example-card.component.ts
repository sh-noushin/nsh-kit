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
        border-radius: 16px;
        box-shadow: none;
        background: #f6f8fc;
        border: 1px solid #d3dae8;
      }

      .example-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 20px;
        border-bottom: 1px solid #d5dce8;
        background: transparent;
      }

      .example-card__title {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2533;
      }

      .example-card__body {
        padding: 20px;
      }
    `,
  ],
})
export class ExampleCardComponent {
  readonly title = input('');
  readonly html = input('');
  readonly ts = input('');
}
