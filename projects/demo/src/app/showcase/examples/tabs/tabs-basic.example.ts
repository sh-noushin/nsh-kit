import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshTabComponent, NshTabsComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-tabs-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshTabComponent, NshTabsComponent],
  template: `
    <nsh-tabs variant="underline">
      <nsh-tab label="Overview">
        <div class="example-panel">Overview content</div>
      </nsh-tab>
      <nsh-tab label="Tokens">
        <div class="example-panel">Tokens content</div>
      </nsh-tab>
      <nsh-tab label="Usage">
        <div class="example-panel">Usage content</div>
      </nsh-tab>
    </nsh-tabs>
  `,
  styles: [
    `
      .example-panel {
        padding: var(--nsh-space-md);
        color: var(--nsh-color-text-muted);
      }
    `,
  ],
})
export class TabsBasicExampleComponent {}

export const tabsBasicHtml = `<nsh-tabs variant="underline">
  <nsh-tab label="Overview">Overview content</nsh-tab>
  <nsh-tab label="Tokens">Tokens content</nsh-tab>
  <nsh-tab label="Usage">Usage content</nsh-tab>
</nsh-tabs>`;

export const tabsBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshTabComponent, NshTabsComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-tabs-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshTabComponent, NshTabsComponent],
  templateUrl: './tabs-basic.example.html'
})
export class TabsBasicExampleComponent {}`;
