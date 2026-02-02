import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshSkeletonComponent } from './skeleton.component';

@Component({
  standalone: true,
  imports: [NshSkeletonComponent],
  template: `
    <nsh-skeleton
      [variant]="variant"
      [width]="width"
      [height]="height"
      [lines]="lines"
      [radius]="radius"
      [animation]="animation"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class HostComponent {
  variant: 'text' | 'rect' | 'circle' = 'text';
  width: string | null = null;
  height: string | null = null;
  lines = 1;
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'md';
  animation: 'pulse' | 'wave' | 'none' = 'wave';
  ariaLabel: string | undefined;
}

describe('NshSkeletonComponent', () => {
  it("renders correct number of lines when variant='text' and lines>1", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'text';
    fixture.componentInstance.lines = 3;
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll('.nsh-skeleton__line') as NodeListOf<HTMLElement>;
    expect(lines.length).toBe(3);
    expect(lines[2].classList.contains('nsh-skeleton__line--last')).toBe(true);
  });

  it('applies circle vs rect vs text classes', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const rectFixture = TestBed.createComponent(HostComponent);
    rectFixture.componentInstance.variant = 'rect';
    rectFixture.detectChanges();
    const rect = rectFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(rect.classList.contains('nsh-skeleton--rect')).toBe(true);

    const circleFixture = TestBed.createComponent(HostComponent);
    circleFixture.componentInstance.variant = 'circle';
    circleFixture.detectChanges();
    const circle = circleFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(circle.classList.contains('nsh-skeleton--circle')).toBe(true);

    const textFixture = TestBed.createComponent(HostComponent);
    textFixture.componentInstance.variant = 'text';
    textFixture.detectChanges();
    const text = textFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(text.classList.contains('nsh-skeleton--text')).toBe(true);
  });

  it('applies width/height when provided (via host CSS vars)', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.width = '50%';
    fixture.componentInstance.height = '2rem';
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(el.style.getPropertyValue('--nsh-skeleton-width')).toBe('50%');
    expect(el.style.getPropertyValue('--nsh-skeleton-height')).toBe('2rem');
  });

  it('sets aria-hidden by default and role/aria-label when ariaLabel is provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const decorativeFixture = TestBed.createComponent(HostComponent);
    decorativeFixture.detectChanges();
    const decorative = decorativeFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('role')).toBeNull();
    expect(decorative.getAttribute('aria-label')).toBeNull();

    const labeledFixture = TestBed.createComponent(HostComponent);
    labeledFixture.componentInstance.ariaLabel = 'Loading content';
    labeledFixture.detectChanges();
    const labeled = labeledFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(labeled.getAttribute('aria-hidden')).toBeNull();
    expect(labeled.getAttribute('role')).toBe('status');
    expect(labeled.getAttribute('aria-label')).toBe('Loading content');
  });

  it('applies animation classes for pulse/wave/none', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const pulseFixture = TestBed.createComponent(HostComponent);
    pulseFixture.componentInstance.animation = 'pulse';
    pulseFixture.detectChanges();
    const pulse = pulseFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(pulse.classList.contains('nsh-skeleton--anim-pulse')).toBe(true);

    const waveFixture = TestBed.createComponent(HostComponent);
    waveFixture.componentInstance.animation = 'wave';
    waveFixture.detectChanges();
    const wave = waveFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(wave.classList.contains('nsh-skeleton--anim-wave')).toBe(true);

    const noneFixture = TestBed.createComponent(HostComponent);
    noneFixture.componentInstance.animation = 'none';
    noneFixture.detectChanges();
    const none = noneFixture.nativeElement.querySelector('nsh-skeleton') as HTMLElement;
    expect(none.classList.contains('nsh-skeleton--anim-none')).toBe(true);
  });
});
