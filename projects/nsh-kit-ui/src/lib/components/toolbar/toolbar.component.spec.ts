import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshToolbarComponent } from './toolbar.component';
import {
  NshToolbarCenterDirective,
  NshToolbarEndDirective,
  NshToolbarStartDirective,
} from './toolbar-slots.directive';
import { NshToolbarTitleDirective } from './toolbar-title.directive';

@Component({
  standalone: true,
  imports: [
    NshToolbarComponent,
    NshToolbarStartDirective,
    NshToolbarCenterDirective,
    NshToolbarEndDirective,
    NshToolbarTitleDirective,
  ],
  template: `
    <nsh-toolbar
      [variant]="variant"
      [density]="density"
      [sticky]="sticky"
      [elevation]="elevation"
      [ariaLabel]="ariaLabel"
    >
      <button nshToolbarStart id="start">Menu</button>
      <span nshToolbarCenter nshToolbarTitle id="title">Title</span>
      <button nshToolbarEnd id="end">Login</button>
    </nsh-toolbar>
  `,
})
class HostComponent {
  variant: 'solid' | 'surface' | 'transparent' = 'solid';
  density: 'comfortable' | 'compact' = 'comfortable';
  sticky = false;
  elevation: 'none' | 'sm' | 'md' | 'lg' = 'none';
  ariaLabel: string | null = 'Main toolbar';
}

@Component({
  standalone: true,
  imports: [NshToolbarComponent],
  template: `
    <nsh-toolbar>
      <span id="plain">Plain content</span>
    </nsh-toolbar>
  `,
})
class PlainContentHostComponent {}

describe('NshToolbarComponent', () => {
  it('renders projected content when no slots are used', async () => {
    await TestBed.configureTestingModule({
      imports: [PlainContentHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(PlainContentHostComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('#plain');
    expect(content).toBeTruthy();
  });

  it('applies host classes for variant, density, sticky, and elevation', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'surface';
    fixture.componentInstance.density = 'compact';
    fixture.componentInstance.sticky = true;
    fixture.componentInstance.elevation = 'md';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-toolbar') as HTMLElement;
    expect(host.classList.contains('nsh-toolbar-host--surface')).toBe(true);
    expect(host.classList.contains('nsh-toolbar-host--compact')).toBe(true);
    expect(host.classList.contains('nsh-toolbar-host--sticky')).toBe(true);
    expect(host.classList.contains('nsh-toolbar-host--elevation-md')).toBe(true);
  });

  it('renders start/center/end slots when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const startSlot = fixture.nativeElement.querySelector('.nsh-toolbar__start #start');
    const centerSlot = fixture.nativeElement.querySelector('.nsh-toolbar__center #title');
    const endSlot = fixture.nativeElement.querySelector('.nsh-toolbar__end #end');

    expect(startSlot).toBeTruthy();
    expect(centerSlot).toBeTruthy();
    expect(endSlot).toBeTruthy();
  });

  it('applies a11y role and aria-label', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-toolbar') as HTMLElement;
    expect(host.getAttribute('role')).toBe('toolbar');
    expect(host.getAttribute('aria-label')).toBe('Main toolbar');
  });
});
