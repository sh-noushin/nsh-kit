import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent, NshEmptyStateComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-empty-state-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshEmptyStateComponent],
  template: `
    <nsh-empty-state
      align="center"
      icon="inbox"
      title="No updates yet"
      description="Invite teammates or connect a data source to see activity here."
    >
      <div nshEmptyActions>
        <nsh-button variant="filled">Invite team</nsh-button>
      </div>
    </nsh-empty-state>
  `,
})
export class EmptyStateBasicExampleComponent {}

export const emptyStateBasicHtml = `<nsh-empty-state
  align="center"
  icon="inbox"
  title="No updates yet"
  description="Invite teammates or connect a data source to see activity here."
>
  <div nshEmptyActions>
    <nsh-button variant="filled">Invite team</nsh-button>
  </div>
</nsh-empty-state>`;

export const emptyStateBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent, NshEmptyStateComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-empty-state-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshEmptyStateComponent],
  templateUrl: './empty-state-basic.example.html'
})
export class EmptyStateBasicExampleComponent {}`;
