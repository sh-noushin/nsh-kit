import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshStepComponent } from './step.component';
import { NshStepperComponent } from './stepper.component';

@Component({
  standalone: true,
  imports: [NshStepperComponent, NshStepComponent],
  template: `
    <nsh-stepper
      [activeIndex]="activeIndex"
      [linear]="linear"
      [orientation]="orientation"
      [disabled]="disabled"
      [showStepNumbers]="showNumbers"
      [ariaLabel]="ariaLabel"
      (activeIndexChange)="onActiveIndexChange($event)"
      (stepSelectionChange)="onStepSelectionChange($event)"
    >
      <nsh-step label="Account" [completed]="completedOne" [editable]="editableOne">
        <p>Account content</p>
      </nsh-step>
      <nsh-step label="Profile" [completed]="completedTwo" [disabled]="disabledTwo">
        <p>Profile content</p>
      </nsh-step>
      <nsh-step label="Done" [error]="errorThree">
        <p>Done content</p>
      </nsh-step>
    </nsh-stepper>
  `,
})
class HostComponent {
  activeIndex = 0;
  linear = false;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  disabled = false;
  showNumbers = true;
  ariaLabel: string | null = 'Example stepper';

  completedOne = true;
  completedTwo = false;
  editableOne = true;
  disabledTwo = false;
  errorThree = false;

  changes: number[] = [];
  selections: Array<{ previousIndex: number; currentIndex: number }> = [];

  onActiveIndexChange(index: number) {
    this.changes.push(index);
    this.activeIndex = index;
  }

  onStepSelectionChange(change: { previousIndex: number; currentIndex: number }) {
    this.selections.push(change);
  }
}

describe('NshStepperComponent', () => {
  it('renders headers for all steps', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(headers.length).toBe(3);
  });

  it('only renders active step content', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.activeIndex = 1;
    fixture.detectChanges();

    const panels = fixture.nativeElement.querySelectorAll('[role="tabpanel"]') as NodeListOf<HTMLElement>;
    expect(panels.length).toBe(1);
    expect(panels[0].textContent).toContain('Profile content');
  });

  it('clicking an enabled header changes activeIndex and emits events', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([2]);
    expect(fixture.componentInstance.selections).toEqual([{ previousIndex: 0, currentIndex: 2 }]);

    const active = fixture.nativeElement.querySelector('button[role="tab"][aria-selected="true"]') as HTMLElement;
    expect(active.textContent).toContain('Done');
  });

  it('linear stepper blocks forward navigation when previous steps are incomplete', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.linear = true;
    fixture.componentInstance.completedOne = false;
    fixture.componentInstance.activeIndex = 0;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([]);
    expect(fixture.componentInstance.activeIndex).toBe(0);
  });

  it('keyboard navigation moves focus and activates a step', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabledTwo = true;
    fixture.detectChanges();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;

    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(buttons[2]);

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([2]);
  });

  it('sets a11y roles and aria attributes', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    expect(tablist.getAttribute('aria-label')).toBe('Example stepper');

    const firstTab = fixture.nativeElement.querySelector('button[role="tab"]') as HTMLElement;
    expect(firstTab.getAttribute('aria-controls')).toBeTruthy();

    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(firstTab.getAttribute('id'));
  });

  it('disabled steps are not focusable or activatable', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabledTwo = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(buttons[1].disabled).toBe(true);
    expect(buttons[1].getAttribute('tabindex')).toBe('-1');

    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([]);
  });
});
