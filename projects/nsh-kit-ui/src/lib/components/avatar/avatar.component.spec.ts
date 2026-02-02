import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshIconRegistry } from '../../foundations/icon';
import { NshAvatarComponent } from './avatar.component';

@Component({
  standalone: true,
  imports: [NshAvatarComponent],
  template: `
    <nsh-avatar
      [src]="src"
      [alt]="alt"
      [name]="name"
      [initials]="initials"
      [size]="size"
      [shape]="shape"
      [status]="status"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class HostComponent {
  src: string | null = null;
  alt: string | null = null;
  name: string | null = null;
  initials: string | null = null;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  shape: 'circle' | 'rounded' = 'circle';
  status: 'none' | 'online' | 'offline' | 'busy' | 'away' = 'none';
  ariaLabel: string | undefined;
}

describe('NshAvatarComponent', () => {
  it('shows <img> when src is provided and loads (mock)', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.src = 'https://example.com/avatar.png';
    fixture.componentInstance.alt = 'Profile photo';
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img.nsh-avatar__img') as HTMLImageElement;
    expect(img).toBeTruthy();

    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-avatar') as HTMLElement;
    expect(host.classList.contains('nsh-avatar--img-loaded')).toBe(true);
    expect(host.getAttribute('aria-hidden')).toBeNull();
  });

  it('falls back to initials when image errors', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.src = 'https://example.com/avatar.png';
    fixture.componentInstance.initials = 'NS';
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img.nsh-avatar__img') as HTMLImageElement;
    expect(img).toBeTruthy();

    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img.nsh-avatar__img')).toBeNull();
    const initials = fixture.nativeElement.querySelector('.nsh-avatar__initials') as HTMLElement;
    expect(initials.textContent?.trim()).toBe('NS');
  });

  it('computes initials from name correctly', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.name = 'Nooshin Shokrollahi';
    fixture.detectChanges();

    const initials = fixture.nativeElement.querySelector('.nsh-avatar__initials') as HTMLElement;
    expect(initials.textContent?.trim()).toBe('NS');
  });

  it('shows placeholder when no src/name/initials', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const registry = TestBed.inject(NshIconRegistry);
    expect(registry.get('user')).toBeNull();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img.nsh-avatar__img')).toBeNull();
    expect(fixture.nativeElement.querySelector('.nsh-avatar__initials')).toBeNull();
    expect(fixture.nativeElement.querySelector('.nsh-avatar__fallback-shape')).toBeTruthy();
  });

  it('aria-hidden by default and aria-label when provided', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const decorativeFixture = TestBed.createComponent(HostComponent);
    decorativeFixture.detectChanges();

    const decorative = decorativeFixture.nativeElement.querySelector('nsh-avatar') as HTMLElement;
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('aria-label')).toBeNull();
    expect(decorative.getAttribute('role')).toBeNull();

    const labeledFixture = TestBed.createComponent(HostComponent);
    labeledFixture.componentInstance.ariaLabel = 'User avatar';
    labeledFixture.detectChanges();

    const labeled = labeledFixture.nativeElement.querySelector('nsh-avatar') as HTMLElement;
    expect(labeled.getAttribute('aria-hidden')).toBeNull();
    expect(labeled.getAttribute('role')).toBe('img');
    expect(labeled.getAttribute('aria-label')).toBe('User avatar');
  });

  it('size + shape apply expected host classes', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.size = 'xl';
    fixture.componentInstance.shape = 'rounded';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-avatar') as HTMLElement;
    expect(host.classList.contains('nsh-avatar--xl')).toBe(true);
    expect(host.classList.contains('nsh-avatar--rounded')).toBe(true);
  });
});
