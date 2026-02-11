import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent, NshCardComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-card-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshCardComponent],
  template: `
    <nsh-card variant="outlined">
      <div nshCardHeader>
        <strong>Project update</strong>
      </div>

      <p>A focused card layout for summarizing content.</p>

      <div nshCardFooter>
        <nsh-button variant="text" size="sm">Review</nsh-button>
      </div>
    </nsh-card>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }

      p {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      strong {
        font-size: var(--nsh-font-size-md);
      }
    `,
  ],
})
export class CardBasicExampleComponent {}

export const cardBasicHtml = `<nsh-card variant="outlined">
  <div nshCardHeader>
    <strong>Project update</strong>
  </div>

  <p>A focused card layout for summarizing content.</p>

  <div nshCardFooter>
    <nsh-button variant="text" size="sm">Review</nsh-button>
  </div>
</nsh-card>`;

export const cardBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent, NshCardComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-card-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshCardComponent],
  templateUrl: './card-basic.example.html'
})
export class CardBasicExampleComponent {}`;
