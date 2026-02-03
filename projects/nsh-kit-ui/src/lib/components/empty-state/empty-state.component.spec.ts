import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshEmptyStateComponent } from './empty-state.component';

@Component({
  standalone: true,
  imports: [NshEmptyStateComponent],
  template: `
    <nsh-empty-state
      [title]="title"
      [description]="description"
      [icon]="icon"
      [size]="size"
      [align]="align"
      [ariaLabel]="ariaLabel"
    >
      <button nshEmptyActions id="primary-action">Action</button>
      <a nshEmptySecondary id="secondary-action" href="#">Secondary</a>
    </nsh-empty-state>
  `,
})
class HostComponent {
  title: string | null = null;
  description: string | null = null;
  icon: string | null = null;
  size: 'sm' | 'md' | 'lg' = 'md';
  align: 'start' | 'center' = 'center';
  ariaLabel: string | undefined;
}

describe('NshEmptyStateComponent', () => {
  it('renders icon when provided', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.icon = 'user';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('nsh-icon')).toBeTruthy();
  });

  it('renders title/description conditionally', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const noTextFixture = TestBed.createComponent(HostComponent);
    noTextFixture.detectChanges();

    expect(noTextFixture.nativeElement.querySelector('.nsh-empty__title')).toBeNull();
    expect(noTextFixture.nativeElement.querySelector('.nsh-empty__desc')).toBeNull();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.title = 'No results';
    fixture.componentInstance.description = 'Try changing filters.';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.nsh-empty__title')?.textContent).toContain('No results');
    expect(fixture.nativeElement.querySelector('.nsh-empty__desc')?.textContent).toContain('Try changing filters.');
  });

  it('projects actions slot content', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#primary-action')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#secondary-action')).toBeTruthy();
  });

  it('applies alignment classes for start vs center', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const startFixture = TestBed.createComponent(HostComponent);
    startFixture.componentInstance.align = 'start';
    startFixture.detectChanges();

    const startHost = startFixture.nativeElement.querySelector('nsh-empty-state') as HTMLElement;
    expect(startHost.classList.contains('nsh-empty-host--align-start')).toBe(true);

    const centerFixture = TestBed.createComponent(HostComponent);
    centerFixture.componentInstance.align = 'center';
    centerFixture.detectChanges();

    const centerHost = centerFixture.nativeElement.querySelector('nsh-empty-state') as HTMLElement;
    expect(centerHost.classList.contains('nsh-empty-host--align-center')).toBe(true);
  });

  it('aria-label behavior when provided', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.ariaLabel = 'Empty state';
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section.nsh-empty') as HTMLElement;
    expect(section.getAttribute('aria-label')).toBe('Empty state');
  });
});
