import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshMenuItemDirective,
  NshMenuPanelComponent,
  type NshMenuCloseReason,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-menu-panel-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshMenuItemDirective, NshMenuPanelComponent],
  template: `
    <div class="example-stack">
      <nsh-menu-panel
        ariaLabel="Menu panel example"
        [template]="menuTemplate"
        (closeRequested)="onClose($event)"
      ></nsh-menu-panel>

      <div class="example-meta">Last close: {{ lastClose() }}</div>
    </div>

    <ng-template #menuTemplate>
      <button nshMenuItem type="button">Profile</button>
      <button nshMenuItem type="button">Settings</button>
      <button nshMenuItem type="button" disabled>Invite</button>
    </ng-template>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-sm);
        max-width: 240px;
      }

      .example-meta {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class MenuPanelExampleComponent {
  readonly lastClose = signal<NshMenuCloseReason | 'none'>('none');

  onClose(reason: NshMenuCloseReason): void {
    this.lastClose.set(reason);
  }
}

export const menuPanelHtml = `<nsh-menu-panel
  ariaLabel="Menu panel example"
  [template]="menuTemplate"
  (closeRequested)="onClose($event)"
></nsh-menu-panel>

<ng-template #menuTemplate>
  <button nshMenuItem type="button">Profile</button>
  <button nshMenuItem type="button">Settings</button>
  <button nshMenuItem type="button" disabled>Invite</button>
</ng-template>`;

export const menuPanelTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshMenuItemDirective, NshMenuPanelComponent, type NshMenuCloseReason } from 'nsh-kit-ui';

@Component({
  selector: 'demo-menu-panel-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshMenuItemDirective, NshMenuPanelComponent],
  templateUrl: './menu-panel.example.html'
})
export class MenuPanelExampleComponent {
  onClose(reason: NshMenuCloseReason): void {
    // handle close
  }
}`;
