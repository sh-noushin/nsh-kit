import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshBreadcrumbComponent, type NshBreadcrumbItem } from './breadcrumb.component';

@Component({
  standalone: true,
  imports: [NshBreadcrumbComponent],
  template: `
    <nsh-breadcrumb
      [items]="items"
      [separator]="separator"
      [maxItems]="maxItems"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class HostComponent {
  items: NshBreadcrumbItem[] = [];
  separator: 'slash' | 'chevron' | 'dot' | 'custom' = 'chevron';
  maxItems: number | null = null;
  ariaLabel = 'Breadcrumb';
}

describe('NshBreadcrumbComponent', () => {
  it('renders correct number of items', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'Home', href: '/' },
      { label: 'Section', href: '/section' },
      { label: 'Page' },
    ];
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__item') as NodeListOf<HTMLElement>;
    expect(items.length).toBe(3);
  });

  it('last item has aria-current="page"', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'Home', href: '/' },
      { label: 'Section', href: '/section' },
      { label: 'Current', href: '/current' },
    ];
    fixture.detectChanges();

    const current = fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;
    expect(current).toBeTruthy();
    expect(current.textContent).toContain('Current');

    const currentLink = fixture.nativeElement.querySelector('[aria-current="page"]').tagName.toLowerCase();
    expect(currentLink).toBe('span');
  });

  it('renders links vs spans based on href and disabled, and forces last to span', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'Home', href: '/' },
      { label: 'Disabled', href: '/disabled', disabled: true },
      { label: 'Plain' },
      { label: 'Current', href: '/current' },
    ];
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.nsh-breadcrumb__link') as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBe(1);
    expect(links[0].textContent).toContain('Home');

    const current = fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;
    expect(current.tagName.toLowerCase()).toBe('span');
    expect(current.textContent).toContain('Current');
  });

  it('maxItems collapsing creates ellipsis and keeps last items', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'A', href: '/a' },
      { label: 'B', href: '/b' },
      { label: 'C', href: '/c' },
      { label: 'D', href: '/d' },
      { label: 'E', href: '/e' },
    ];
    fixture.componentInstance.maxItems = 3;
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__item') as NodeListOf<HTMLElement>;
    expect(items.length).toBe(4);

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('…');
    expect(text).toContain('A');
    expect(text).toContain('D');
    expect(text).toContain('E');
    expect(text).not.toContain('B');
  });

  it('separators are aria-hidden', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'Home', href: '/' },
      { label: 'Section' },
      { label: 'Current' },
    ];
    fixture.detectChanges();

    const seps = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__separator') as NodeListOf<HTMLElement>;
    expect(seps.length).toBe(2);

    for (const sep of Array.from(seps)) {
      expect(sep.getAttribute('aria-hidden')).toBe('true');
    }
  });
});
