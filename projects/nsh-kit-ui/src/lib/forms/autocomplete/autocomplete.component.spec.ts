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
  });

  it('opens on focus when minChars satisfied', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel).toBeTruthy();

    const combobox = fixture.nativeElement.querySelector('[role="combobox"]') as HTMLInputElement;
    expect(combobox.getAttribute('aria-expanded')).toBe('true');
    expect(combobox.getAttribute('aria-controls')).toBe(panel.id);
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

    const rows = Array.from(
      fixture.nativeElement.querySelectorAll('.nsh-ac__row') as NodeListOf<HTMLElement>,
    );

    expect(rows.some((r) => r.textContent?.includes('Gamma'))).toBe(true);
    expect(rows.some((r) => r.textContent?.includes('Alpha'))).toBe(false);
  });

  it('does not open until minChars is reached', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.minChars = 2;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeFalsy();

    input.value = 'ga';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it('closes on Escape', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeFalsy();
  });

  it('closes on outside click', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeFalsy();
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

    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeFalsy();
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
    let active = fixture.nativeElement.querySelector('.nsh-ac__row--active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('Alpha');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    // Beta is disabled, so it should skip to Gamma
    active = fixture.nativeElement.querySelector('.nsh-ac__row--active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('Gamma');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('c');

    // Panel closes after selection
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeFalsy();
  });

  it('renders listbox/options roles and aria-disabled for disabled options', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel).toBeTruthy();

    const options = Array.from(panel.querySelectorAll('[role="option"]')) as HTMLElement[];
    expect(options.length).toBeGreaterThan(0);

    const beta = options.find((o) => o.textContent?.trim() === 'Beta');
    expect(beta?.getAttribute('aria-disabled')).toBe('true');
  });
});
