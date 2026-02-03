import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshTabComponent } from './tab.component';
import { NshTabsComponent } from './tabs.component';

@Component({
  standalone: true,
  imports: [NshTabsComponent, NshTabComponent],
  template: `
    <nsh-tabs
      [selectedIndex]="selectedIndex"
      [lazy]="lazy"
      [ariaLabel]="ariaLabel"
      (selectedIndexChange)="onSelectedIndexChange($event)"
    >
      <nsh-tab label="One">One content</nsh-tab>
      <nsh-tab label="Two" [disabled]="disabledTwo">Two content</nsh-tab>
      <nsh-tab label="Three">Three content</nsh-tab>
    </nsh-tabs>
  `,
})
class HostComponent {
  selectedIndex = 0;
  disabledTwo = false;
  lazy = true;
  ariaLabel: string | undefined;

  changes: number[] = [];

  onSelectedIndexChange(index: number) {
    this.changes.push(index);
    this.selectedIndex = index;
  }
}

describe('NshTabsComponent', () => {
  it('renders correct number of tabs from projected nsh-tab', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(tabs.length).toBe(3);
  });

  it('clicking changes selected index and emits selectedIndexChange', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([2]);

    const active = fixture.nativeElement.querySelector('button[role="tab"][aria-selected="true"]') as HTMLElement;
    expect(active.textContent).toContain('Three');
  });

  it('disabled tab cannot be selected by click', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabledTwo = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(buttons[1].disabled).toBe(true);

    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.changes).toEqual([]);
    expect(fixture.componentInstance.selectedIndex).toBe(0);
  });

  it('keyboard navigation: Arrow keys move focus, Enter selects, disabled is skipped', async () => {
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

  it('a11y roles and aria attributes are present and correct', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.ariaLabel = 'Example tabs';
    fixture.detectChanges();

    const tablist = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    expect(tablist.getAttribute('aria-label')).toBe('Example tabs');

    const firstTab = fixture.nativeElement.querySelector('button[role="tab"]') as HTMLElement;
    expect(firstTab.getAttribute('aria-controls')).toBeTruthy();

    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;
    expect(panel.getAttribute('aria-labelledby')).toBe(firstTab.getAttribute('id'));
  });

  it('lazy behavior: only active panel rendered when lazy=true', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.lazy = true;
    fixture.componentInstance.selectedIndex = 0;
    fixture.detectChanges();

    const panels = fixture.nativeElement.querySelectorAll('[role="tabpanel"]') as NodeListOf<HTMLElement>;
    expect(panels.length).toBe(1);
    expect(panels[0].textContent).toContain('One content');
  });
});
