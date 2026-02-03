import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshInputComponent } from './input.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshInputComponent],
  template: ` <nsh-input [formControl]="control" /> `,
})
class HostComponent {
  control = new FormControl<string | null>('');
}

describe('NshInputComponent (CVA)', () => {
  it('writeValue sets input value', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('Hello');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input.nsh-input') as HTMLInputElement;
    expect(input.value).toBe('Hello');
  });

  it('typing updates form control', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input.nsh-input') as HTMLInputElement;
    input.value = 'Typed';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('Typed');
  });

  it('disabled state disables input', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input.nsh-input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('blur triggers touched', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input.nsh-input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});
