import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent, NshInputComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-form-field-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshInputComponent],
  template: `
    <nsh-form-field label="Amount" hint="Monthly budget">
      <span nshPrefix>$</span>
      <nsh-input type="number" [formControl]="control"></nsh-input>
      <span nshSuffix>USD</span>
    </nsh-form-field>
  `,
})
export class FormFieldBasicExampleComponent {
  readonly control = new FormControl(1200, { nonNullable: true });
}

export const formFieldBasicHtml = `<nsh-form-field label="Amount" hint="Monthly budget">
  <span nshPrefix>$</span>
  <nsh-input type="number" [formControl]="control"></nsh-input>
  <span nshSuffix>USD</span>
</nsh-form-field>`;

export const formFieldBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshFormFieldComponent, NshInputComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-form-field-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshInputComponent],
  templateUrl: './form-field-basic.example.html'
})
export class FormFieldBasicExampleComponent {
  control = new FormControl(1200, { nonNullable: true });
}`;
