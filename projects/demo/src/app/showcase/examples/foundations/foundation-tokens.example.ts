import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshListComponent, NshListItemComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-tokens-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshListComponent, NshListItemComponent],
  template: `
    <nsh-list role="list" [dense]="true">
      <nsh-list-item supportingText="Primary brand color">--nsh-color-primary</nsh-list-item>
      <nsh-list-item supportingText="Base surface">--nsh-color-surface</nsh-list-item>
      <nsh-list-item supportingText="Default text">--nsh-color-text</nsh-list-item>
    </nsh-list>
  `,
})
export class FoundationTokensExampleComponent {}

export const foundationTokensHtml = `<nsh-list role="list" [dense]="true">
  <nsh-list-item supportingText="Primary brand color">--nsh-color-primary</nsh-list-item>
  <nsh-list-item supportingText="Base surface">--nsh-color-surface</nsh-list-item>
  <nsh-list-item supportingText="Default text">--nsh-color-text</nsh-list-item>
</nsh-list>`;

export const foundationTokensTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshListComponent, NshListItemComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-tokens-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshListComponent, NshListItemComponent],
  templateUrl: './foundation-tokens.example.html'
})
export class FoundationTokensExampleComponent {}`;
