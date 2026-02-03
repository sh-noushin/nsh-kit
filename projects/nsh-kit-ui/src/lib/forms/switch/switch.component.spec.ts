import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshSwitchComponent } from './switch.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshSwitchComponent],
  template: ` <nsh-switch [formControl]="control" [label]="label" [ariaLabel]="ariaLabel" [size]="size" /> `,
})
class HostComponent {
  control = new FormControl<boolean>(false, { nonNullable: true });
  label: string | null = 'Notifications';
  ariaLabel: string | null = null;
  size: 'sm' | 'md' | 'lg' = 'md';
}

describe('NshSwitchComponent (CVA)', () => {
  it('writeValue updates checked state', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('toggling updates reactive form control value', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
    expect(fixture.componentInstance.control.value).toBe(false);

    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(true);
  });

  it('disabled prevents toggling', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);

    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(false);
  });

  it('blur triggers touched', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});

describe('NshSwitchComponent a11y + size', () => {
  it('role="switch" is present', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it('aria-label applied when label missing', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.label = null;
    fixture.componentInstance.ariaLabel = 'Toggle setting';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Toggle setting');
  });

  it('size input applies expected host class', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-switch') as HTMLElement;
    expect(host.classList.contains('nsh-switch-host--lg')).toBe(true);
  });
});
