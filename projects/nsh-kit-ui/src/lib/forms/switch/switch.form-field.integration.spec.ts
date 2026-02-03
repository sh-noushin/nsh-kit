import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent } from '../form-field/form-field.component';
import { NshSwitchComponent } from './switch.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshSwitchComponent],
  template: `
    <nsh-form-field label="Feature" hint="Helpful hint">
      <nsh-switch label="Enabled" [formControl]="control" />
    </nsh-form-field>
  `,
})
class HostComponent {
  control = new FormControl<boolean>(false, { nonNullable: true });
}

describe('NshSwitchComponent + NshFormFieldComponent integration', () => {
  it('wires aria-describedby from form-field', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;

    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });
});
