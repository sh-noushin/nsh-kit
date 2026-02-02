import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshProgressComponent } from './progress.component';

@Component({
  standalone: true,
  imports: [NshProgressComponent],
  template: `
    <nsh-progress
      [value]="value"
      [min]="min"
      [max]="max"
      [color]="color"
      [size]="size"
      [rounded]="rounded"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class HostComponent {
  value: number | null = 50;
  min = 0;
  max = 100;
  color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warn' | 'danger' | 'neutral' = 'primary';
  size: 'sm' | 'md' | 'lg' = 'md';
  rounded = true;
  ariaLabel: string | undefined;
}

describe('NshProgressComponent', () => {
  it('renders determinate percent width for normal values', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.value = 25;
    fixture.componentInstance.min = 0;
    fixture.componentInstance.max = 100;
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector('.nsh-progress__bar') as HTMLElement;
    expect(bar).toBeTruthy();
    expect(bar.style.width).toBe('25%');
  });

  it('clamps below min and above max', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const below = TestBed.createComponent(HostComponent);
    below.componentInstance.value = -10;
    below.componentInstance.min = 0;
    below.componentInstance.max = 100;
    below.detectChanges();

    const belowBar = below.nativeElement.querySelector('.nsh-progress__bar') as HTMLElement;
    expect(belowBar.style.width).toBe('0%');

    const above = TestBed.createComponent(HostComponent);
    above.componentInstance.value = 999;
    above.componentInstance.min = 0;
    above.componentInstance.max = 100;
    above.detectChanges();

    const aboveBar = above.nativeElement.querySelector('.nsh-progress__bar') as HTMLElement;
    expect(aboveBar.style.width).toBe('100%');
  });

  it('handles max==min without NaN', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.min = 10;
    fixture.componentInstance.max = 10;
    fixture.componentInstance.value = 10;
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector('.nsh-progress__bar') as HTMLElement;
    expect(bar.style.width).toBe('100%');
    expect(bar.style.width).not.toContain('NaN');
  });

  it('renders indeterminate markup when value is null', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.value = null;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-progress') as HTMLElement;
    expect(host.classList.contains('nsh-progress--indeterminate')).toBe(true);

    const bar = fixture.nativeElement.querySelector('.nsh-progress__bar') as HTMLElement;
    expect(bar.classList.contains('nsh-progress__bar--indeterminate')).toBe(true);
  });

  it('sets a11y attributes (role/min/max, now only for determinate, label vs hidden)', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const determinateFixture = TestBed.createComponent(HostComponent);
    determinateFixture.componentInstance.value = 50;
    determinateFixture.componentInstance.min = 0;
    determinateFixture.componentInstance.max = 100;
    determinateFixture.detectChanges();

    const determinate = determinateFixture.nativeElement.querySelector('nsh-progress') as HTMLElement;
    expect(determinate.getAttribute('role')).toBe('progressbar');
    expect(determinate.getAttribute('aria-valuemin')).toBe('0');
    expect(determinate.getAttribute('aria-valuemax')).toBe('100');
    expect(determinate.getAttribute('aria-valuenow')).toBe('50');
    expect(determinate.getAttribute('aria-hidden')).toBe('true');

    const labeledFixture = TestBed.createComponent(HostComponent);
    labeledFixture.componentInstance.ariaLabel = 'Loading';
    labeledFixture.componentInstance.value = 50;
    labeledFixture.detectChanges();

    const labeled = labeledFixture.nativeElement.querySelector('nsh-progress') as HTMLElement;
    expect(labeled.getAttribute('aria-hidden')).toBeNull();
    expect(labeled.getAttribute('aria-label')).toBe('Loading');

    const indeterminateFixture = TestBed.createComponent(HostComponent);
    indeterminateFixture.componentInstance.value = null;
    indeterminateFixture.detectChanges();

    const indeterminate = indeterminateFixture.nativeElement.querySelector('nsh-progress') as HTMLElement;
    expect(indeterminate.getAttribute('aria-valuenow')).toBeNull();
  });

  it('applies size class for height mapping', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('nsh-progress') as HTMLElement;
    expect(el.classList.contains('nsh-progress--lg')).toBe(true);
  });
});
