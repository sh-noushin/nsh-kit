import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import type { NshAutocompleteItem } from './autocomplete.types';
import { NshAutocompleteComponent } from './autocomplete.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NshAutocompleteComponent],
  template: `
    <nsh-autocomplete
      [items]="items"
      [minChars]="minChars"
      [filterMode]="filterMode"
      [loading]="loading"
      [noResultsText]="noResultsText"
      [formControl]="control"
    />
  `,
})
class HostComponent {
  control = new FormControl<any | null>(null);

  items: ReadonlyArray<NshAutocompleteItem<any>> = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta', disabled: true },
    { value: 'c', label: 'Gamma' },
  ];

  minChars = 0;
  filterMode: 'contains' | 'startsWith' = 'contains';
  loading = false;
  noResultsText = 'No results';
}

describe('NshAutocompleteComponent (CVA + combobox)', () => {
  it('writeValue updates input text to matching label', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('c');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Gamma');

    fixture.destroy();
  });

  it('opens on focus when minChars satisfied', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const panel = document.body.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel).toBeTruthy();

    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(combobox.getAttribute('aria-controls')).toBe(panel.id);

    fixture.destroy();
  });

  it('filters items as user types (contains)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.filterMode = 'contains';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));

    input.value = 'am';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const rows = Array.from(document.body.querySelectorAll('.nsh-ac__row') as NodeListOf<HTMLElement>);

    expect(rows.some((r) => r.textContent?.includes('Gamma'))).toBe(true);
    expect(rows.some((r) => r.textContent?.includes('Alpha'))).toBe(false);

    fixture.destroy();
  });

  it('does not open until minChars is reached', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.minChars = 2;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="listbox"]')).toBeFalsy();

    input.value = 'ga';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

    fixture.destroy();
  });

  it('closes on Escape', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('closes on outside click', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('disabled state disables input and prevents open', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('selection works via option mousedown (click-like)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const panel = document.body.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel).toBeTruthy();

    const gamma = Array.from(panel.querySelectorAll('[role="option"]')).find(
      (o) => (o as HTMLElement).textContent?.trim() === 'Gamma',
    ) as HTMLElement | undefined;
    expect(gamma).toBeTruthy();

    gamma?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');
    expect(document.body.querySelector('[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('ArrowDown/ArrowUp moves active option (skips disabled) and Enter selects active', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    // First enabled is Alpha
    let active = document.body.querySelector('.nsh-ac__row--active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('Alpha');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    // Beta is disabled, so it should skip to Gamma
    active = document.body.querySelector('.nsh-ac__row--active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('Gamma');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');

    // Panel closes after selection
    expect(document.body.querySelector('[role="listbox"]')).toBeFalsy();

    fixture.destroy();
  });

  it('renders listbox/options roles and aria-disabled for disabled options', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const panel = document.body.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel).toBeTruthy();

    const options = Array.from(panel.querySelectorAll('[role="option"]')) as HTMLElement[];
    expect(options.length).toBeGreaterThan(0);

    const beta = options.find((o) => o.textContent?.trim() === 'Beta');
    expect(beta?.getAttribute('aria-disabled')).toBe('true');

    fixture.destroy();
  });

  it('destroys overlay on component destroy (no leaks)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(document.body.querySelector('.nsh-overlay')).toBeTruthy();

    fixture.destroy();

    expect(document.body.querySelector('.nsh-overlay')).toBeFalsy();
  });
});
