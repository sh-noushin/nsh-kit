import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent, NshTextareaComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-textarea-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshTextareaComponent],
  template: `
    <nsh-form-field label="Notes" hint="Max 280 characters">
      <nsh-textarea placeholder="Add details" [formControl]="control"></nsh-textarea>
    </nsh-form-field>
  `,
})
export class TextareaBasicExampleComponent {
  readonly control = new FormControl('Follow up with the design team.', { nonNullable: true });
}

export const textareaBasicHtml = `<nsh-form-field label="Notes" hint="Max 280 characters">
  <nsh-textarea placeholder="Add details" [formControl]="control"></nsh-textarea>
</nsh-form-field>`;

export const textareaBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshFormFieldComponent, NshTextareaComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-textarea-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshTextareaComponent],
  templateUrl: './textarea-basic.example.html'
})
export class TextareaBasicExampleComponent {
  control = new FormControl('Follow up with the design team.', { nonNullable: true });
}`;
