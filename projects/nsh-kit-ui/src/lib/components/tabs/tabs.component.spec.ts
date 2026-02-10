import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshTabComponent } from './tab.component';
import { NshTabsComponent } from './tabs.component';

@Component({
  standalone: true,
  imports: [NshTabsComponent, NshTabComponent],
  template: `
    <nsh-tabs
      [activeIndex]="activeIndex"
      [variant]="variant"
      [stretch]="stretch"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (activeIndexChange)="onActiveIndexChange($event)"
      (tabChange)="onTabChange($event)"
    >
      <nsh-tab label="Overview">
        <p>Overview content</p>
      </nsh-tab>
      <nsh-tab label="Details" [disabled]="disabledTwo">
        <p>Details content</p>
      </nsh-tab>
      <nsh-tab label="Settings">
        <p>Settings content</p>
      </nsh-tab>
    </nsh-tabs>
  `,
})
class HostComponent {
  activeIndex = 0;
  variant: 'underline' | 'pill' | 'contained' = 'underline';
  stretch = false;
  disabled = false;
  disabledTwo = false;
  ariaLabel: string | null = 'Example tabs';

  changes: number[] = [];
  tabChanges: Array<{ previousIndex: number; currentIndex: number }> = [];

  onActiveIndexChange(index: number) {
    this.changes.push(index);
    this.activeIndex = index;
  }

  onTabChange(change: { previousIndex: number; currentIndex: number }) {
    this.tabChanges.push(change);
  }
}

describe('NshTabsComponent', () => {
  it('renders correct number of tab headers', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(tabs.length).toBe(3);
  });

  it('only renders the active tab content', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.activeIndex = 1;
    fixture.detectChanges();

    const panels = fixture.nativeElement.querySelectorAll('[role="tabpanel"]') as NodeListOf<HTMLElement>;
    expect(panels.length).toBe(1);
    expect(panels[0].textContent).toContain('Details content');
  });

  it('clicking a header changes activeIndex and emits events', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([2]);
    expect(fixture.componentInstance.tabChanges).toEqual([{ previousIndex: 0, currentIndex: 2 }]);

    const active = fixture.nativeElement.querySelector('button[role="tab"][aria-selected="true"]') as HTMLElement;
    expect(active.textContent).toContain('Settings');
  });

  it('disabled tab cannot be activated and is skipped by keyboard navigation', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabledTwo = true;
    fixture.detectChanges();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;

    expect(buttons[1].disabled).toBe(true);

    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([]);

    buttons[0].focus();
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(buttons[2]);
  });

  it('keyboard navigation roving tabindex works and activates on Enter', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;

    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(buttons[1]);

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([1]);
  });

  it('sets a11y roles and aria attributes', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    expect(tablist.getAttribute('aria-label')).toBe('Example tabs');

    const firstTab = fixture.nativeElement.querySelector('button[role="tab"]') as HTMLElement;
    expect(firstTab.getAttribute('aria-controls')).toBeTruthy();

    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(firstTab.getAttribute('id'));
  });
});
