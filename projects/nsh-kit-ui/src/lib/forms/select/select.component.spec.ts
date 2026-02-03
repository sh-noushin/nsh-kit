import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshSelectComponent } from './select.component';
import { NshOptionComponent } from './option.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshSelectComponent, NshOptionComponent],
  template: `
    <nsh-select [formControl]="control" [placeholder]="placeholder">
      <nsh-option [value]="'a'">Alpha</nsh-option>
      <nsh-option [value]="'b'" [disabled]="disableB">Beta</nsh-option>
      <nsh-option [value]="'c'">Gamma</nsh-option>
    </nsh-select>
  `,
})
class HostComponent {
  control = new FormControl<string | number | null>(null);
  placeholder: string | null = null;
  disableB = false;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshSelectComponent, NshOptionComponent],
  template: `
    <nsh-select [formControl]="control">
      <nsh-option [value]="1">One</nsh-option>
      <nsh-option [value]="2">Two</nsh-option>
    </nsh-select>
  `,
})
class NumberHostComponent {
  control = new FormControl<string | number | null>(1);
}

describe('NshSelectComponent (CVA)', () => {
  it('writeValue selects correct option (string)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('b');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    expect(select.value).toBe('s:b');
  });

  it('writeValue selects correct option (number)', async () => {
    await TestBed.configureTestingModule({ imports: [NumberHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NumberHostComponent);
    fixture.componentInstance.control.setValue(2);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    expect(select.value).toBe('n:2');
  });

  it('change event updates form control (string)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    select.value = 's:c';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');
  });

  it('change event round-trips number values correctly', async () => {
    await TestBed.configureTestingModule({ imports: [NumberHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NumberHostComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    select.value = 'n:2';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(2);
  });

  it('disabled state disables native select', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('blur triggers touched', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    select.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});

describe('NshSelectComponent placeholder + options', () => {
  it('when value is null and placeholder set, placeholder option is selected', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.placeholder = 'Pick one';
    fixture.componentInstance.control.setValue(null);
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-select') as HTMLSelectElement;
    expect(select.value).toBe('');

    const placeholderOpt = fixture.nativeElement.querySelector('option[value=""]') as HTMLOptionElement;
    expect(placeholderOpt.disabled).toBe(true);
  });

  it('renders correct number of native <option> elements', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('select option') as NodeListOf<HTMLOptionElement>;
    expect(options.length).toBe(3);
  });

  it('disabled option is disabled', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disableB = true;
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('select option') as NodeListOf<HTMLOptionElement>;
    const beta = Array.from(options).find((o) => o.textContent?.includes('Beta'))!;

    expect(beta.disabled).toBe(true);
  });
});
