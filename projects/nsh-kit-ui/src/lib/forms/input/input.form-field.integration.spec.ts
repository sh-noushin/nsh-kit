import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent } from '../form-field/form-field.component';
import { NshInputComponent } from './input.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshInputComponent],
  template: `
    <nsh-form-field label="Name" hint="H">
      <nsh-input [formControl]="control" />
    </nsh-form-field>
  `,
})
class HostComponent {
  control = new FormControl<string | null>('');
}

describe('NshInputComponent + NshFormFieldComponent integration', () => {
  it('wires id + aria-describedby correctly', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.nsh-ff__label') as HTMLLabelElement;
    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input.nsh-input') as HTMLInputElement;

    expect(label.getAttribute('for')).toBeTruthy();
    expect(input.id).toBe(label.getAttribute('for'));

    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });
});
