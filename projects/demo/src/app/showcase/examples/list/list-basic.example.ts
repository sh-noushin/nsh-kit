import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshListComponent, NshListItemComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-list-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshListComponent, NshListItemComponent],
  template: `
    <nsh-list role="navigation" [divider]="true">
      <nsh-list-item leadingIcon="home" supportingText="Overview">
        Dashboard
      </nsh-list-item>
      <nsh-list-item leadingIcon="grid" supportingText="Browse components">
        Library
      </nsh-list-item>
      <nsh-list-item leadingIcon="settings" supportingText="Theme + tokens">
        Settings
      </nsh-list-item>
    </nsh-list>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
    `,
  ],
})
export class ListBasicExampleComponent {}

export const listBasicHtml = `<nsh-list role="navigation" [divider]="true">
  <nsh-list-item leadingIcon="home" supportingText="Overview">Dashboard</nsh-list-item>
  <nsh-list-item leadingIcon="grid" supportingText="Browse components">Library</nsh-list-item>
  <nsh-list-item leadingIcon="settings" supportingText="Theme + tokens">Settings</nsh-list-item>
</nsh-list>`;

export const listBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshListComponent, NshListItemComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-list-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshListComponent, NshListItemComponent],
  templateUrl: './list-basic.example.html'
})
export class ListBasicExampleComponent {}`;
