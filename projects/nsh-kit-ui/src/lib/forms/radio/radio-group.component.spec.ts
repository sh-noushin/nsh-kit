import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshFormFieldComponent } from '../form-field/form-field.component';
import { NshRadioComponent } from './radio.component';
import { NshRadioGroupComponent } from './radio-group.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshRadioGroupComponent, NshRadioComponent],
  template: `
    <nsh-radio-group [formControl]="control" [orientation]="orientation" [ariaLabel]="ariaLabel">
      <nsh-radio [value]="'a'" label="A" />
      <nsh-radio [value]="'b'" label="B" [disabled]="disableB" />
      <nsh-radio [value]="'c'" label="C" />
    </nsh-radio-group>
  `,
})
class HostComponent {
  control = new FormControl<string | null>('a');
  orientation: 'vertical' | 'horizontal' = 'vertical';
  ariaLabel: string | null = null;
  disableB = false;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshFormFieldComponent, NshRadioGroupComponent, NshRadioComponent],
  template: `
    <nsh-form-field label="Pick one" hint="Helpful hint">
      <nsh-radio-group [formControl]="control">
        <nsh-radio [value]="'a'" label="A" />
        <nsh-radio [value]="'b'" label="B" />
      </nsh-radio-group>
    </nsh-form-field>
  `,
})
class FormFieldHostComponent {
  control = new FormControl<string | null>('a');
}

describe('NshRadioGroupComponent (CVA)', () => {
  it('writeValue selects correct radio', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('c');
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[2].checked).toBe(true);
  });

  it('clicking a radio updates the form control value', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    inputs[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('b');
  });

  it('disabled state prevents selection', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[0].disabled).toBe(true);

    inputs[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('a');
  });

  it('touched state triggered on blur', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="radio"]') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});

describe('NshRadioGroupComponent keyboard + roving tabindex', () => {
  it('arrow keys move selection and skip disabled radios', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disableB = true;
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(fixture.componentInstance.control.value).toBe('a');

    group.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');
  });

  it('roving tabindex keeps exactly one enabled radio tabbable', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>,
    );

    const zeroTab = inputs.filter((i) => i.getAttribute('tabindex') === '0');
    expect(zeroTab.length).toBe(1);
  });
});

describe('NshRadioGroupComponent a11y + orientation + form-field', () => {
  it('renders role="radiogroup"', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group).toBeTruthy();
  });

  it('applies aria-label when provided', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.ariaLabel = 'Choose one';
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.getAttribute('aria-label')).toBe('Choose one');
  });

  it('horizontal orientation applies host class and css var mapping', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.orientation = 'horizontal';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-radio-group') as HTMLElement;
    expect(host.classList.contains('nsh-radio-group-host--horizontal')).toBe(true);

    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group).toBeTruthy();
  });

  it('wires aria-describedby from form-field', async () => {
    await TestBed.configureTestingModule({ imports: [FormFieldHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(FormFieldHostComponent);
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;

    expect(group.getAttribute('aria-describedby')).toBe(hint.id);
  });
});
