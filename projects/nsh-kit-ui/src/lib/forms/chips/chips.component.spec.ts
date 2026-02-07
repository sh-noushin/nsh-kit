import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshChipComponent } from './chip.component';
import { NshChipsComponent } from './chips.component';

@Component({
  standalone: true,
  imports: [NshChipsComponent, NshChipComponent],
  template: `
    <nsh-chips [wrap]="wrap" [gap]="gap" ariaLabel="Example chips">
      <nsh-chip>One</nsh-chip>
      <nsh-chip>Two</nsh-chip>
    </nsh-chips>
  `,
})
class HostComponent {
  wrap = true;
  gap: 'sm' | 'md' | 'lg' = 'md';
}

describe('NshChipsComponent', () => {
  it('applies wrap and gap CSS variables', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.wrap = false;
    fixture.componentInstance.gap = 'lg';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-chips') as HTMLElement;

    expect(host.style.getPropertyValue('--nsh-chips-wrap')).toBe('nowrap');
    expect(host.style.getPropertyValue('--nsh-chips-gap')).toBe('var(--nsh-space-md)');
  });
});
