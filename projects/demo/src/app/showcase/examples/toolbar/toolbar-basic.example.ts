import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  NshButtonComponent,
  NshToolbarComponent,
  NshToolbarEndDirective,
  NshToolbarStartDirective,
  NshToolbarTitleDirective,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-toolbar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshButtonComponent,
    NshToolbarComponent,
    NshToolbarEndDirective,
    NshToolbarStartDirective,
    NshToolbarTitleDirective,
  ],
  template: `
    <nsh-toolbar color="surface" variant="surface" density="compact">
      <span nshToolbarTitle nshToolbarStart>Project</span>
      <span nshToolbarEnd>
        <nsh-button variant="text" size="sm" leadingIcon="plus">New</nsh-button>
      </span>
    </nsh-toolbar>
  `,
})
export class ToolbarBasicExampleComponent {}

export const toolbarBasicHtml = `<nsh-toolbar color="surface" variant="surface" density="compact">
  <span nshToolbarTitle nshToolbarStart>Project</span>
  <span nshToolbarEnd>
    <nsh-button variant="text" size="sm" leadingIcon="plus">New</nsh-button>
  </span>
</nsh-toolbar>`;

export const toolbarBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent, NshToolbarComponent, NshToolbarTitleDirective } from 'nsh-kit-ui';

@Component({
  selector: 'demo-toolbar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshToolbarComponent, NshToolbarTitleDirective],
  templateUrl: './toolbar-basic.example.html'
})
export class ToolbarBasicExampleComponent {}`;
