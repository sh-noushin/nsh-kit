import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshTooltipDirective } from './tooltip.directive';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTooltipPanel(): HTMLElement | null {
  return document.body.querySelector('nsh-tooltip-panel') as HTMLElement | null;
}

function getOverlayContainer(): HTMLElement | null {
  return document.body.querySelector('.nsh-overlay') as HTMLElement | null;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshTooltipDirective],
  template: `
    <button
      id="anchor"
      type="button"
      [nshTooltip]="text"
      [nshTooltipDisabled]="disabled"
      [nshTooltipPosition]="position"
      [nshTooltipShowDelay]="showDelay"
      [nshTooltipHideDelay]="hideDelay"
      [nshTooltipMaxWidth]="maxWidth"
      [nshTooltipAriaDescription]="ariaDescription"
    >
      Anchor
    </button>
  `,
})
class HostComponent {
  text: string | null = 'Hello';
  disabled = false;

  position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  showDelay = 0;
  hideDelay = 0;

  maxWidth: string | null = null;
  ariaDescription: string | null = null;
}

describe('NshTooltipDirective', () => {
  it('shows on mouseenter after showDelay, then hides on mouseleave after hideDelay', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.showDelay = 30;
    fixture.componentInstance.hideDelay = 30;
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('#anchor') as HTMLButtonElement;

    anchor.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    await sleep(10);
    expect(getTooltipPanel()).toBeFalsy();

    await sleep(40);
    const panel = getTooltipPanel();
    expect(panel).toBeTruthy();

    anchor.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();

    await sleep(10);
    expect(getTooltipPanel()).toBeTruthy();

    await sleep(40);
    expect(getTooltipPanel()).toBeFalsy();

    fixture.destroy();
  });

  it('shows on focus and wires aria-describedby only while visible', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.showDelay = 0;
    fixture.componentInstance.hideDelay = 0;
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('#anchor') as HTMLButtonElement;

    expect(anchor.getAttribute('aria-describedby')).toBeFalsy();

    anchor.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    const panel = getTooltipPanel();
    expect(panel).toBeTruthy();

    const id = panel?.getAttribute('id');
    expect(id).toBeTruthy();

    const describedBy = anchor.getAttribute('aria-describedby');
    expect(describedBy).toContain(id as string);

    anchor.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(getTooltipPanel()).toBeFalsy();
    expect(anchor.getAttribute('aria-describedby')).toBeFalsy();

    fixture.destroy();
  });

  it('does not show when disabled or when text is empty', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.showDelay = 0;
    fixture.componentInstance.hideDelay = 0;
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('#anchor') as HTMLButtonElement;

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    anchor.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    await sleep(5);
    expect(getTooltipPanel()).toBeFalsy();

    fixture.componentInstance.disabled = false;
    fixture.componentInstance.text = '   ';
    fixture.detectChanges();

    anchor.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    await sleep(5);
    expect(getTooltipPanel()).toBeFalsy();

    fixture.destroy();
  });

  it('closes immediately on Escape when visible', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.showDelay = 0;
    fixture.componentInstance.hideDelay = 0;
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('#anchor') as HTMLButtonElement;

    anchor.focus();
    anchor.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(getTooltipPanel()).toBeTruthy();

    anchor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(getTooltipPanel()).toBeFalsy();

    fixture.destroy();
  });

  it('closes on scroll and sets overlay placement for positioning', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.showDelay = 0;
    fixture.componentInstance.hideDelay = 0;
    fixture.componentInstance.position = 'right';
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('#anchor') as HTMLButtonElement;

    anchor.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(getTooltipPanel()).toBeTruthy();

    const container = getOverlayContainer();
    expect(container).toBeTruthy();
    expect(container?.dataset['placement']).toBe('right');

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(getTooltipPanel()).toBeFalsy();

    fixture.destroy();
  });
});
