import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshDividerComponent } from './divider.component';

@Component({
  standalone: true,
  imports: [NshDividerComponent],
  template: `
    <nsh-divider [orientation]="orientation" [inset]="inset" [thickness]="thickness" />
  `,
})
class HostComponent {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  inset = false;
  thickness: 'hairline' | 'sm' | 'md' = 'hairline';
}

describe('NshDividerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  function createFixture(init?: (instance: HostComponent) => void): ComponentFixture<HostComponent> {
    const fixture = TestBed.createComponent(HostComponent);
    init?.(fixture.componentInstance);
    fixture.detectChanges();
    return fixture;
  }

  it('renders <hr> for horizontal orientation', () => {
    const fixture = createFixture((instance) => {
      instance.orientation = 'horizontal';
    });

    const hr = fixture.nativeElement.querySelector('hr.nsh-divider') as HTMLHRElement | null;
    expect(hr).toBeTruthy();
    expect(hr?.classList.contains('nsh-divider--horizontal')).toBe(true);
  });

  it('renders role="separator" with aria-orientation="vertical" for vertical orientation', () => {
    const fixture = createFixture((instance) => {
      instance.orientation = 'vertical';
    });

    const sep = fixture.nativeElement.querySelector('[role="separator"]') as HTMLElement | null;
    expect(sep).toBeTruthy();
    expect(sep?.getAttribute('aria-orientation')).toBe('vertical');
    expect(sep?.classList.contains('nsh-divider--vertical')).toBe(true);
  });

  it('applies inset class when inset=true', () => {
    const fixture = createFixture((instance) => {
      instance.inset = true;
    });

    const el = fixture.nativeElement.querySelector('.nsh-divider') as HTMLElement;
    expect(el.classList.contains('nsh-divider--inset')).toBe(true);
  });

  it('applies thickness classes', () => {
    const sm = createFixture((instance) => {
      instance.thickness = 'sm';
    });
    const smEl = sm.nativeElement.querySelector('.nsh-divider') as HTMLElement;
    expect(smEl.classList.contains('nsh-divider--sm')).toBe(true);

    const md = createFixture((instance) => {
      instance.thickness = 'md';
    });
    const mdEl = md.nativeElement.querySelector('.nsh-divider') as HTMLElement;
    expect(mdEl.classList.contains('nsh-divider--md')).toBe(true);
  });
});
