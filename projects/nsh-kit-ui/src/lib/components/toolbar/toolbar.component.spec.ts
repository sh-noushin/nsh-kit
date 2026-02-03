import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshToolbarComponent } from './toolbar.component';

@Component({
  standalone: true,
  imports: [NshToolbarComponent],
  template: `
    <nsh-toolbar
      [sticky]="sticky"
      [elevation]="elevation"
      [ariaLabel]="ariaLabel"
    >
      <span nshToolbarStart id="start">Start</span>
      <span nshToolbarCenter id="center">Center</span>
      <span nshToolbarEnd id="end">End</span>
    </nsh-toolbar>
  `,
})
class HostComponent {
  sticky = false;
  elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0;
  ariaLabel: string | undefined;
}

describe('NshToolbarComponent', () => {
  it('projects content into start/center/end slots', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const start = fixture.nativeElement.querySelector('#start');
    const center = fixture.nativeElement.querySelector('#center');
    const end = fixture.nativeElement.querySelector('#end');

    expect(start).toBeTruthy();
    expect(center).toBeTruthy();
    expect(end).toBeTruthy();

    const startSlot = fixture.nativeElement.querySelector('.nsh-toolbar__start #start');
    const centerSlot = fixture.nativeElement.querySelector('.nsh-toolbar__center #center');
    const endSlot = fixture.nativeElement.querySelector('.nsh-toolbar__end #end');

    expect(startSlot).toBeTruthy();
    expect(centerSlot).toBeTruthy();
    expect(endSlot).toBeTruthy();
  });

  it('applies sticky behavior (class)', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.sticky = true;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-toolbar') as HTMLElement;
    expect(host.classList.contains('nsh-toolbar-host--sticky')).toBe(true);
  });

  it('applies elevation class based on input', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.elevation = 3;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-toolbar') as HTMLElement;
    expect(host.classList.contains('nsh-toolbar-host--elevation-3')).toBe(true);
  });

  it('sets aria-label when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.ariaLabel = 'Main toolbar';
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('header.nsh-toolbar') as HTMLElement;
    expect(header.getAttribute('aria-label')).toBe('Main toolbar');
  });
});
