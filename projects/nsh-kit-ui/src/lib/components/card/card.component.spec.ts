import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshCardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [NshCardComponent],
  template: `
    <nsh-card [variant]="variant" [padding]="padding" [ariaLabel]="ariaLabel">
      <div nshCardHeader>Header</div>
      Body
      <div nshCardFooter>Footer</div>
    </nsh-card>
  `,
})
class HostComponent {
  variant: 'elevated' | 'outlined' | 'filled' = 'elevated';
  padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  ariaLabel: string | undefined;
}

describe('NshCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
  });

  function createFixture(init?: (instance: HostComponent) => void) {
    const fixture = TestBed.createComponent(HostComponent);
    init?.(fixture.componentInstance);
    fixture.detectChanges();
    return fixture;
  }

  it('projects header, body, and footer', () => {
    const fixture = createFixture();
    const header = fixture.nativeElement.querySelector('[nshcardheader]') as HTMLElement;
    const footer = fixture.nativeElement.querySelector('[nshcardfooter]') as HTMLElement;
    const bodySlot = fixture.nativeElement.querySelector('.nsh-card__body') as HTMLElement;

    expect(header.textContent).toContain('Header');
    expect(footer.textContent).toContain('Footer');
    expect(bodySlot.textContent).toContain('Body');
  });

  it('applies variant classes', () => {
    const fixture = createFixture((instance) => {
      instance.variant = 'outlined';
    });
    const card = fixture.nativeElement.querySelector('.nsh-card') as HTMLElement;
    expect(card.classList.contains('nsh-card--outlined')).toBe(true);
  });

  it('applies padding classes', () => {
    const fixture = createFixture((instance) => {
      instance.padding = 'lg';
    });
    const card = fixture.nativeElement.querySelector('.nsh-card') as HTMLElement;
    expect(card.classList.contains('nsh-card--p-lg')).toBe(true);
  });

  it('adds region role only when ariaLabel is provided', () => {
    const withLabel = createFixture((instance) => {
      instance.ariaLabel = 'Settings';
    });
    const cardWithLabel = withLabel.nativeElement.querySelector('.nsh-card') as HTMLElement;
    expect(cardWithLabel.getAttribute('role')).toBe('region');
    expect(cardWithLabel.getAttribute('aria-label')).toBe('Settings');

    const withoutLabel = createFixture();
    const cardWithoutLabel = withoutLabel.nativeElement.querySelector('.nsh-card') as HTMLElement;
    expect(cardWithoutLabel.getAttribute('role')).toBeNull();
    expect(cardWithoutLabel.getAttribute('aria-label')).toBeNull();
  });
});
