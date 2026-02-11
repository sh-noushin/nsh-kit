import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshCheckboxComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-checkbox-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshCheckboxComponent],
  template: `
    <nsh-checkbox label="Email updates" [formControl]="control"></nsh-checkbox>
  `,
})
export class CheckboxBasicExampleComponent {
  readonly control = new FormControl(true, { nonNullable: true });
}

export const checkboxBasicHtml = `<nsh-checkbox label="Email updates" [formControl]="control"></nsh-checkbox>`;

export const checkboxBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshCheckboxComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-checkbox-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshCheckboxComponent],
  templateUrl: './checkbox-basic.example.html'
})
export class CheckboxBasicExampleComponent {
  control = new FormControl(true, { nonNullable: true });
}`;
