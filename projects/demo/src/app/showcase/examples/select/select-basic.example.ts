import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent, NshOptionComponent, NshSelectComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-select-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshOptionComponent, NshSelectComponent],
  template: `
    <nsh-form-field label="Team" hint="Choose a workspace">
      <nsh-select [formControl]="control" placeholder="Select team">
        <nsh-option [value]="'design'">Design</nsh-option>
        <nsh-option [value]="'engineering'">Engineering</nsh-option>
        <nsh-option [value]="'product'">Product</nsh-option>
      </nsh-select>
    </nsh-form-field>
  `,
})
export class SelectBasicExampleComponent {
  readonly control = new FormControl('design', { nonNullable: true });
}

export const selectBasicHtml = `<nsh-form-field label="Team" hint="Choose a workspace">
  <nsh-select [formControl]="control" placeholder="Select team">
    <nsh-option [value]="'design'">Design</nsh-option>
    <nsh-option [value]="'engineering'">Engineering</nsh-option>
    <nsh-option [value]="'product'">Product</nsh-option>
  </nsh-select>
</nsh-form-field>`;

export const selectBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshFormFieldComponent, NshOptionComponent, NshSelectComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-select-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshOptionComponent, NshSelectComponent],
  templateUrl: './select-basic.example.html'
})
export class SelectBasicExampleComponent {
  control = new FormControl('design', { nonNullable: true });
}`;
