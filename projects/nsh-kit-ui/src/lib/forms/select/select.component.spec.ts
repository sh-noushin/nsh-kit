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
  it('writeValue updates trigger label (string)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('b');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Beta');

    fixture.destroy();
  });

  it('writeValue updates trigger label (number)', async () => {
    await TestBed.configureTestingModule({ imports: [NumberHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NumberHostComponent);
    fixture.componentInstance.control.setValue(2);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Two');

    fixture.destroy();
  });

  it('selection updates form control (string)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const panel = document.body.querySelector('nsh-select-panel[role="listbox"]') as HTMLElement;
    expect(panel).toBeTruthy();

    const gamma = Array.from(panel.querySelectorAll('[role="option"]')).find(
      (o) => (o as HTMLElement).textContent?.trim() === 'Gamma',
    ) as HTMLElement | undefined;
    expect(gamma).toBeTruthy();

    gamma?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');
    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('selection round-trips number values correctly', async () => {
    await TestBed.configureTestingModule({ imports: [NumberHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NumberHostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const panel = document.body.querySelector('nsh-select-panel[role="listbox"]') as HTMLElement;
    const two = Array.from(panel.querySelectorAll('[role="option"]')).find(
      (o) => (o as HTMLElement).textContent?.trim() === 'Two',
    ) as HTMLElement | undefined;

    two?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(2);

    fixture.destroy();
  });

  it('disabled state disables trigger and prevents open', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('blur triggers touched', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new Event('focus'));
    trigger.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBe(true);

    fixture.destroy();
  });

  it('ArrowDown skips disabled options and Enter selects active', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disableB = true;
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeTruthy();

    // First enabled is Alpha
    let active = document.body.querySelector('.nsh-select-panel__row--active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('Alpha');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    // Beta is disabled, so it should skip to Gamma
    active = document.body.querySelector('.nsh-select-panel__row--active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('Gamma');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');
    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('closes on Escape and outside click', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeFalsy();

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeTruthy();

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('nsh-select-panel[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('destroys overlay on component destroy (no leaks)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('.nsh-overlay.nsh-select-overlay')).toBeTruthy();

    fixture.destroy();

    expect(document.body.querySelector('.nsh-overlay.nsh-select-overlay')).toBeFalsy();
  });
});

describe('NshSelectComponent placeholder + options', () => {
  it('when value is null and placeholder set, placeholder label is shown', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.placeholder = 'Pick one';
    fixture.componentInstance.control.setValue(null);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Pick one');

    fixture.destroy();
  });

  it('renders correct number of projected <nsh-option> elements', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('nsh-option');
    expect(options.length).toBe(3);

    fixture.destroy();
  });

  it('disabled option renders aria-disabled in overlay panel', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disableB = true;
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button.nsh-select') as HTMLButtonElement;
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const panel = document.body.querySelector('nsh-select-panel[role="listbox"]') as HTMLElement;
    const options = Array.from(panel.querySelectorAll('[role="option"]')) as HTMLElement[];
    const beta = options.find((o) => o.textContent?.trim() === 'Beta');

    expect(beta?.getAttribute('aria-disabled')).toBe('true');

    fixture.destroy();
  });
});
