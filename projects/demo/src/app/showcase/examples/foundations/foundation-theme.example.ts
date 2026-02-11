import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent, NshCardComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-theme-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshCardComponent],
  template: `
    <nsh-card variant="filled">
      <div nshCardHeader>
        <strong>Theme surfaces</strong>
      </div>
      <p>Use CSS variables to align components with your brand palette.</p>
      <div nshCardFooter>
        <nsh-button variant="outlined" size="sm">Customize theme</nsh-button>
      </div>
    </nsh-card>
  `,
  styles: [
    `
      p {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }
    `,
  ],
})
export class FoundationThemeExampleComponent {}

export const foundationThemeHtml = `<nsh-card variant="filled">
  <div nshCardHeader>
    <strong>Theme surfaces</strong>
  </div>
  <p>Use CSS variables to align components with your brand palette.</p>
  <div nshCardFooter>
    <nsh-button variant="outlined" size="sm">Customize theme</nsh-button>
  </div>
</nsh-card>`;

export const foundationThemeTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent, NshCardComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-theme-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshCardComponent],
  templateUrl: './foundation-theme.example.html'
})
export class FoundationThemeExampleComponent {}`;
