import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshFocusVisibleDirective } from './focus-visible.directive';

@Component({
  standalone: true,
  imports: [NshFocusVisibleDirective],
  template: `
    <button id="btn" nshFocusVisible>Click</button>
  `,
})
class HostComponent {}

describe('NshFocusVisibleDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('adds class when focus follows keyboard input', () => {
    const btn = fixture.nativeElement.querySelector('#btn') as HTMLButtonElement;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    btn.dispatchEvent(new FocusEvent('focus'));
    expect(btn.classList.contains('nsh-focus-visible')).toBe(true);
  });

  it('does not add class when focus follows pointer input', () => {
    const btn = fixture.nativeElement.querySelector('#btn') as HTMLButtonElement;
    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    btn.dispatchEvent(new FocusEvent('focus'));
    expect(btn.classList.contains('nsh-focus-visible')).toBe(false);
  });
});
