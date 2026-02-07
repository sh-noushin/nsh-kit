import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent } from '../form-field/form-field.component';
import { NshAutocompleteComponent } from './autocomplete.component';
import type { NshAutocompleteItem } from './autocomplete.types';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshAutocompleteComponent],
  template: `
    <nsh-form-field label="Fruit" hint="Helpful hint">
      <nsh-autocomplete [items]="items" [formControl]="control" />
    </nsh-form-field>
  `,
})
class HostComponent {
  control = new FormControl<any | null>(null);
  items: ReadonlyArray<NshAutocompleteItem<any>> = [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
  ];
}

describe('NshAutocompleteComponent + NshFormFieldComponent integration', () => {
  it('wires id and aria-describedby from form-field', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.nsh-ff__label') as HTMLLabelElement;
    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });
});
