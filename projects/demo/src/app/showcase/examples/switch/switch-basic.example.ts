import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshSwitchComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-switch-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshSwitchComponent],
  template: `
    <nsh-switch label="Notifications" [formControl]="control"></nsh-switch>
  `,
})
export class SwitchBasicExampleComponent {
  readonly control = new FormControl(true, { nonNullable: true });
}

export const switchBasicHtml = `<nsh-switch label="Notifications" [formControl]="control"></nsh-switch>`;

export const switchBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshSwitchComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-switch-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshSwitchComponent],
  templateUrl: './switch-basic.example.html'
})
export class SwitchBasicExampleComponent {
  control = new FormControl(true, { nonNullable: true });
}`;
