import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshBadgeComponent } from './badge.component';

@Component({
  standalone: true,
  imports: [NshBadgeComponent],
  template: `
    <nsh-badge
      [value]="value"
      [max]="max"
      [dot]="dot"
      [position]="position"
      [ariaLabel]="ariaLabel"
    >
      <span id="anchor">Anchor</span>
    </nsh-badge>
  `,
})
class AttachedHostComponent {
  value: string | number | null = 1;
  max = 99;
  dot = false;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  ariaLabel: string | undefined;
}

@Component({
  standalone: true,
  imports: [NshBadgeComponent],
  template: `
    <nsh-badge [value]="value" [max]="max" [dot]="dot" [position]="position" [ariaLabel]="ariaLabel" />
  `,
})
class StandaloneHostComponent {
  value: string | number | null = 1;
  max = 99;
  dot = false;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  ariaLabel: string | undefined;
}

describe('NshBadgeComponent', () => {
  it('hides badge when value is null (dot=false)', async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.componentInstance.value = null;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.nsh-badge')).toBeNull();
  });

  it('renders max+ when value is a number greater than max', async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.componentInstance.value = 120;
    fixture.componentInstance.max = 99;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.nsh-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('99+');
  });

  it('renders dot mode and ignores value text', async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.componentInstance.value = 12;
    fixture.componentInstance.dot = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.nsh-badge') as HTMLElement;
    expect(badge.classList.contains('nsh-badge--dot')).toBe(true);
    expect(badge.textContent?.trim()).toBe('');
  });

  it('applies position class', async () => {
    await TestBed.configureTestingModule({
      imports: [AttachedHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AttachedHostComponent);
    fixture.componentInstance.position = 'bottom-left';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('.nsh-badge-host') as HTMLElement;
    expect(host.classList.contains('nsh-badge-host--bottom-left')).toBe(true);
  });

  it('sets aria-hidden when decorative, and aria-label when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneHostComponent],
    }).compileComponents();

    const decorativeFixture = TestBed.createComponent(StandaloneHostComponent);
    decorativeFixture.detectChanges();
    await decorativeFixture.whenStable();
    decorativeFixture.detectChanges();

    const decorative = decorativeFixture.nativeElement.querySelector('.nsh-badge') as HTMLElement;
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('aria-label')).toBeNull();

    const labeledFixture = TestBed.createComponent(StandaloneHostComponent);
    labeledFixture.componentInstance.ariaLabel = 'New notifications';
    labeledFixture.detectChanges();
    await labeledFixture.whenStable();
    labeledFixture.detectChanges();

    const labeled = labeledFixture.nativeElement.querySelector('.nsh-badge') as HTMLElement;
    expect(labeled.getAttribute('aria-hidden')).toBeNull();
    expect(labeled.getAttribute('aria-label')).toBe('New notifications');
  });
});
