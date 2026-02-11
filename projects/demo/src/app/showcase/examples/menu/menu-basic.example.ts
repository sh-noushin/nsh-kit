import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshButtonComponent,
  NshMenuComponent,
  NshMenuItemDirective,
  NshMenuTriggerForDirective,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-menu-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshMenuComponent, NshMenuItemDirective, NshMenuTriggerForDirective],
  template: `
    <div class="example-row">
      <nsh-button variant="outlined" [nshMenuTriggerFor]="menu">Open menu</nsh-button>
      <span class="example-meta">Selected: {{ selected() }}</span>
    </div>

    <nsh-menu #menu="nshMenu" ariaLabel="Menu example">
      <button nshMenuItem type="button" (click)="select('Profile')">Profile</button>
      <button nshMenuItem type="button" (click)="select('Settings')">Settings</button>
      <button nshMenuItem type="button" (click)="select('Sign out')">Sign out</button>
    </nsh-menu>
  `,
  styles: [
    `
      .example-row {
        display: flex;
        align-items: center;
        gap: var(--nsh-space-md);
      }

      .example-meta {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class MenuBasicExampleComponent {
  readonly selected = signal('Profile');

  select(value: string): void {
    this.selected.set(value);
  }
}

export const menuBasicHtml = `<nsh-button variant="outlined" [nshMenuTriggerFor]="menu">Open menu</nsh-button>

<nsh-menu #menu="nshMenu" ariaLabel="Menu example">
  <button nshMenuItem type="button">Profile</button>
  <button nshMenuItem type="button">Settings</button>
  <button nshMenuItem type="button">Sign out</button>
</nsh-menu>`;

export const menuBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent, NshMenuComponent, NshMenuItemDirective, NshMenuTriggerForDirective } from 'nsh-kit-ui';

@Component({
  selector: 'demo-menu-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshMenuComponent, NshMenuItemDirective, NshMenuTriggerForDirective],
  templateUrl: './menu-basic.example.html'
})
export class MenuBasicExampleComponent {}`;
