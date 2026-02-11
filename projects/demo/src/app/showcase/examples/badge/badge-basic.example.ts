import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshBadgeComponent, NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-badge-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBadgeComponent, NshButtonComponent],
  template: `
    <div class="example-row">
      <nsh-badge value="3">
        <nsh-button variant="text" type="button" tabindex="-1">Inbox</nsh-button>
      </nsh-badge>
      <nsh-badge [dot]="true" color="success">
        <nsh-button variant="text" type="button" tabindex="-1">Live</nsh-button>
      </nsh-badge>
    </div>
  `,
  styles: [
    `
      .example-row {
        display: flex;
        align-items: center;
        gap: var(--nsh-space-lg);
      }
    `,
  ],
})
export class BadgeBasicExampleComponent {}

export const badgeBasicHtml = `<div class="example-row">
  <nsh-badge value="3">
    <nsh-button variant="text" type="button" tabindex="-1">Inbox</nsh-button>
  </nsh-badge>
  <nsh-badge [dot]="true" color="success">
    <nsh-button variant="text" type="button" tabindex="-1">Live</nsh-button>
  </nsh-badge>
</div>`;

export const badgeBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshBadgeComponent, NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-badge-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshBadgeComponent, NshButtonComponent],
  templateUrl: './badge-basic.example.html'
})
export class BadgeBasicExampleComponent {}`;
