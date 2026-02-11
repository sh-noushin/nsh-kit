import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent, NshInputComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-input-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshInputComponent],
  template: `
    <nsh-form-field label="Full name" hint="Used on your profile">
      <nsh-input placeholder="Ada Lovelace" [formControl]="control"></nsh-input>
    </nsh-form-field>
  `,
})
export class InputBasicExampleComponent {
  readonly control = new FormControl('Ada Lovelace', { nonNullable: true });
}

export const inputBasicHtml = `<nsh-form-field label="Full name" hint="Used on your profile">
  <nsh-input placeholder="Ada Lovelace" [formControl]="control"></nsh-input>
</nsh-form-field>`;

export const inputBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshFormFieldComponent, NshInputComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-input-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshInputComponent],
  templateUrl: './input-basic.example.html'
})
export class InputBasicExampleComponent {
  control = new FormControl('Ada Lovelace', { nonNullable: true });
}`;
