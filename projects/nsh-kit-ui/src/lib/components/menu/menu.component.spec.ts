import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshMenuComponent } from './menu.component';
import { NshMenuItemDirective } from './menu-item.directive';
import { NshMenuTriggerForDirective } from './menu-trigger.directive';

@Component({
  standalone: true,
  imports: [NshMenuComponent, NshMenuTriggerForDirective, NshMenuItemDirective],
  template: `
    <button id="trigger" [nshMenuTriggerFor]="menu">Open</button>

    <nsh-menu #menu="nshMenu" ariaLabel="User menu">
      <button id="profile" nshMenuItem>Profile</button>
      <button id="disabled" nshMenuItem disabled>Disabled</button>
      <button id="logout" nshMenuItem (click)="logoutClicks = logoutClicks + 1">Logout</button>
    </nsh-menu>
  `,
})
class HostComponent {
  logoutClicks = 0;
}

@Component({
  standalone: true,
  imports: [NshMenuComponent, NshMenuTriggerForDirective, NshMenuItemDirective],
  template: `
    <button id="trigger" [nshMenuTriggerFor]="menu">Open</button>

    <nsh-menu #menu="nshMenu" [closeOnItemClick]="false" ariaLabel="User menu">
      <button id="profile" nshMenuItem>Profile</button>
      <button id="logout" nshMenuItem>Logout</button>
    </nsh-menu>
  `,
})
class NoCloseOnItemClickHostComponent {}

describe('Menu (overlay)', () => {
  it('opens on click and attaches overlay to document.body', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const overlay = document.body.querySelector('.nsh-overlay.nsh-menu-overlay') as HTMLElement;
    expect(overlay).toBeTruthy();

    const panel = document.body.querySelector('[role="menu"]') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('aria-label')).toBe('User menu');

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);

    fixture.destroy();
  });

  it('closes on outside click', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(document.body.querySelector('[role="menu"]')).toBeTruthy();

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="menu"]')).toBeFalsy();

    fixture.destroy();
  });

  it('closes on Escape and returns focus to trigger', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const profile = document.body.querySelector('#profile') as HTMLButtonElement;
    expect(profile).toBeTruthy();
    expect(document.activeElement).toBe(profile);

    profile.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="menu"]')).toBeFalsy();
    expect(document.activeElement).toBe(trigger);

    fixture.destroy();
  });

  it('keyboard navigation skips disabled items and activates with Enter', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const profile = document.body.querySelector('#profile') as HTMLButtonElement;
    expect(document.activeElement).toBe(profile);

    profile.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const logout = document.body.querySelector('#logout') as HTMLButtonElement;
    expect(document.activeElement).toBe(logout);

    logout.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.logoutClicks).toBe(1);
    expect(document.body.querySelector('[role="menu"]')).toBeFalsy();

    fixture.destroy();
  });

  it('clicking an item closes the menu when closeOnItemClick=true', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const logout = document.body.querySelector('#logout') as HTMLButtonElement;
    logout.click();
    fixture.detectChanges();

    expect(document.body.querySelector('[role="menu"]')).toBeFalsy();

    fixture.destroy();
  });

  it('does not close on item click when closeOnItemClick=false', async () => {
    await TestBed.configureTestingModule({ imports: [NoCloseOnItemClickHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NoCloseOnItemClickHostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const logout = document.body.querySelector('#logout') as HTMLButtonElement;
    logout.click();
    fixture.detectChanges();

    expect(document.body.querySelector('[role="menu"]')).toBeTruthy();

    fixture.destroy();
  });

  it('menu items have role=menuitem', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const items = Array.from(document.body.querySelectorAll('[nshMenuItem]')) as HTMLElement[];
    expect(items.length).toBeGreaterThan(0);
    for (const el of items) {
      expect(el.getAttribute('role')).toBe('menuitem');
    }

    fixture.destroy();
  });

  it('destroys overlay on trigger destroy (no leaks)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(document.body.querySelector('.nsh-overlay.nsh-menu-overlay')).toBeTruthy();

    fixture.destroy();

    expect(document.body.querySelector('.nsh-overlay.nsh-menu-overlay')).toBeFalsy();
  });
});
