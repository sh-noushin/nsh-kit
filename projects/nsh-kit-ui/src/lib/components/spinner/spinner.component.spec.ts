import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshSpinnerComponent } from './spinner.component';

@Component({
  standalone: true,
  imports: [NshSpinnerComponent],
  template: `
    <nsh-spinner
      [size]="size"
      [color]="color"
      [thickness]="thickness"
      [ariaLabel]="ariaLabel"
      [inline]="inline"
    />
  `,
})
class HostComponent {
  size: 'sm' | 'md' | 'lg' = 'md';
  color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warn' | 'danger' | 'neutral' = 'primary';
  thickness: 'sm' | 'md' | 'lg' = 'md';
  ariaLabel: string | undefined;
  inline = false;
}

describe('NshSpinnerComponent', () => {
  it('renders spinner', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('nsh-spinner');
    expect(el).toBeTruthy();
    expect(el.querySelector('svg')).toBeTruthy();
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.getAttribute('aria-busy')).toBe('true');
  });

  it('applies size class', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('nsh-spinner');
    expect(el.classList.contains('nsh-spinner--lg')).toBe(true);
  });

  it('sets aria-hidden when decorative, and aria-label when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const decorativeFixture = TestBed.createComponent(HostComponent);
    decorativeFixture.detectChanges();

    const decorative: HTMLElement = decorativeFixture.nativeElement.querySelector('nsh-spinner');
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('aria-label')).toBeNull();

    const labeledFixture = TestBed.createComponent(HostComponent);
    labeledFixture.componentInstance.ariaLabel = 'Loading';
    labeledFixture.detectChanges();

    const labeled: HTMLElement = labeledFixture.nativeElement.querySelector('nsh-spinner');
    expect(labeled.getAttribute('aria-hidden')).toBeNull();
    expect(labeled.getAttribute('aria-label')).toBe('Loading');
  });

  it('applies color and thickness classes', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.color = 'danger';
    fixture.componentInstance.thickness = 'lg';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('nsh-spinner');
    expect(el.classList.contains('nsh-spinner--danger')).toBe(true);
    expect(el.classList.contains('nsh-spinner--thickness-lg')).toBe(true);
  });
});
