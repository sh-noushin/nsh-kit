import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent } from '../form-field/form-field.component';
import { NshSliderComponent } from './slider.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshSliderComponent],
  template: `
    <nsh-slider
      [formControl]="control"
      [min]="min"
      [max]="max"
      [step]="step"
      [showValue]="showValue"
    />
  `,
})
class HostComponent {
  control = new FormControl<number>(50, { nonNullable: true });
  min = 0;
  max = 100;
  step = 1;
  showValue = false;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshSliderComponent],
  template: `
    <nsh-form-field label="Volume" hint="Helpful hint">
      <nsh-slider [formControl]="control" />
    </nsh-form-field>
  `,
})
class FormFieldHostComponent {
  control = new FormControl<number>(25, { nonNullable: true });
}

describe('NshSliderComponent (CVA)', () => {
  it('writeValue updates input.value', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue(42);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('user input updates reactive form value (number)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;

    input.value = '60';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(60);
  });

  it('disabled disables native range input', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('blur triggers touched', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});

describe('NshSliderComponent clamping + attrs', () => {
  it('writeValue below min clamps to min', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.min = 10;
    fixture.componentInstance.max = 20;
    fixture.detectChanges();

    fixture.componentInstance.control.setValue(0);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.value).toBe('10');
  });

  it('writeValue above max clamps to max', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.min = 10;
    fixture.componentInstance.max = 20;
    fixture.detectChanges();

    fixture.componentInstance.control.setValue(100);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.value).toBe('20');
  });

  it('min/max/step are applied to the input', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.min = 1;
    fixture.componentInstance.max = 9;
    fixture.componentInstance.step = 2;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.getAttribute('min')).toBe('1');
    expect(input.getAttribute('max')).toBe('9');
    expect(input.getAttribute('step')).toBe('2');
  });
});

describe('NshSliderComponent showValue + form-field', () => {
  it('when showValue=true, value label is rendered', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.showValue = true;
    fixture.detectChanges();

    const valueEl = fixture.nativeElement.querySelector('.nsh-slider__value') as HTMLElement;
    expect(valueEl).toBeTruthy();
  });

  it('wires aria-describedby from form-field', async () => {
    await TestBed.configureTestingModule({ imports: [FormFieldHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(FormFieldHostComponent);
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;

    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });
});
