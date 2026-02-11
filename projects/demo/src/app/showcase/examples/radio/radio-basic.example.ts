import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshRadioComponent, NshRadioGroupComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-radio-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshRadioComponent, NshRadioGroupComponent],
  template: `
    <nsh-radio-group [formControl]="control" ariaLabel="Role">
      <nsh-radio label="Design" value="design"></nsh-radio>
      <nsh-radio label="Engineering" value="engineering"></nsh-radio>
      <nsh-radio label="Product" value="product"></nsh-radio>
    </nsh-radio-group>
  `,
})
export class RadioBasicExampleComponent {
  readonly control = new FormControl('design', { nonNullable: true });
}

export const radioBasicHtml = `<nsh-radio-group [formControl]="control" ariaLabel="Role">
  <nsh-radio label="Design" value="design"></nsh-radio>
  <nsh-radio label="Engineering" value="engineering"></nsh-radio>
  <nsh-radio label="Product" value="product"></nsh-radio>
</nsh-radio-group>`;

export const radioBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshRadioComponent, NshRadioGroupComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-radio-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshRadioComponent, NshRadioGroupComponent],
  templateUrl: './radio-basic.example.html'
})
export class RadioBasicExampleComponent {
  control = new FormControl('design', { nonNullable: true });
}`;
