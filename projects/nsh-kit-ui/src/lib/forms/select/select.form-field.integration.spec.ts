import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent } from '../form-field/form-field.component';
import { NshSelectComponent } from './select.component';
import { NshOptionComponent } from './option.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshSelectComponent, NshOptionComponent],
  template: `
    <nsh-form-field label="Flavor" hint="Helpful hint">
      <nsh-select [formControl]="control">
        <nsh-option [value]="'vanilla'">Vanilla</nsh-option>
        <nsh-option [value]="'chocolate'">Chocolate</nsh-option>
      </nsh-select>
    </nsh-form-field>
  `,
})
class HostComponent {
  control = new FormControl<string | number | null>('vanilla');
}

describe('NshSelectComponent + NshFormFieldComponent integration', () => {
  it('wires id and aria-describedby from form-field', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;

    expect(trigger.id).toContain('nsh-ff-');
    expect(trigger.getAttribute('aria-describedby')).toBe(hint.id);
  });
});
