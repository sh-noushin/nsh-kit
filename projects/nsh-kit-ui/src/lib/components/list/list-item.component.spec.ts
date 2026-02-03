import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshListComponent } from './list.component';
import { NshListItemComponent } from './list-item.component';

@Component({
  standalone: true,
  imports: [NshListComponent, NshListItemComponent],
  template: `
    <nsh-list [role]="role">
      <nsh-list-item
        [href]="href"
        [disabled]="disabled"
        [selected]="selected"
        [leadingIcon]="leadingIcon"
        [trailingIcon]="trailingIcon"
        ariaLabel="Item"
      >
        Label
      </nsh-list-item>
    </nsh-list>
  `,
})
class HostComponent {
  role: 'list' | 'menu' | 'navigation' = 'list';
  href: string | null = null;
  disabled = false;
  selected = false;
  leadingIcon: string | null = null;
  trailingIcon: string | null = null;
}

describe('NshListItemComponent', () => {
  it('renders as <a> when href is set', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.href = '/test';
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a.nsh-list-item') as HTMLAnchorElement;
    expect(a).toBeTruthy();
    expect(a.getAttribute('href')).toBe('/test');
  });

  it('renders as <button> when actionable without href', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.href = null;
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button.nsh-list-item') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('disabled prevents interaction and sets aria-disabled', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.href = '/x';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a.nsh-list-item')).toBeNull();
    expect(fixture.nativeElement.querySelector('button.nsh-list-item')).toBeNull();

    const div = fixture.nativeElement.querySelector('div.nsh-list-item') as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.getAttribute('aria-disabled')).toBe('true');
  });

  it("selected sets aria-selected for menu role", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.role = 'menu';
    fixture.componentInstance.selected = true;
    fixture.detectChanges();

    expect((fixture.nativeElement.textContent as string) ?? '').toContain('Label');

    const root = fixture.nativeElement.querySelector(
      'button.nsh-list-item, a.nsh-list-item, div.nsh-list-item'
    ) as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('aria-selected')).toBe('true');
    expect(root.getAttribute('aria-current')).toBeNull();
    expect(root.getAttribute('role')).toBe('menuitem');
  });

  it("selected sets aria-current='page' for navigation role", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.role = 'navigation';
    fixture.componentInstance.selected = true;
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.nsh-list-item') as HTMLElement;
    expect(root.getAttribute('aria-current')).toBe('page');
    expect(root.getAttribute('aria-selected')).toBeNull();
  });

  it('renders icons when leadingIcon/trailingIcon provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.leadingIcon = 'user';
    fixture.componentInstance.trailingIcon = 'chevron-right';
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll('nsh-icon') as NodeListOf<HTMLElement>;
    expect(icons.length).toBe(2);
  });
});
