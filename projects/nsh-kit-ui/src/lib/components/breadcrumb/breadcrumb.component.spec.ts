import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshBreadcrumbComponent, type NshBreadcrumbIconValue, type NshBreadcrumbItem } from './breadcrumb.component';

@Component({
  standalone: true,
  imports: [NshBreadcrumbComponent],
  template: `
    <nsh-breadcrumb
      [items]="items"
      [separator]="separator"
      [variant]="variant"
      [elevation]="elevation"
      [shadow]="shadow"
      [compact]="compact"
      [activeIndex]="activeIndex"
      [truncateOnClick]="truncateOnClick"
      [accentColor]="accentColor"
      [itemIcons]="itemIcons"
      [maxItems]="maxItems"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class HostComponent {
  items: NshBreadcrumbItem[] = [];
  separator: 'slash' | 'chevron' | 'dot' | 'custom' = 'chevron';
  variant: 'minimal' | 'soft' | 'solid' | 'segmented' | 'steps' = 'minimal';
  elevation: 'flat' | 'raised' = 'flat';
  shadow = false;
  compact = false;
  truncateOnClick = false;
  activeIndex: number | null = null;
  accentColor: string | null = null;
  itemIcons: Record<string, NshBreadcrumbIconValue> | null = null;
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

  it('renders item icons from item and object map', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { id: 'home', label: 'Home' },
      { label: 'Library', icon: 'folder' },
      { label: 'Current' },
    ];
    fixture.componentInstance.itemIcons = {
      home: 'home',
    };
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__item-icon') as NodeListOf<HTMLElement>;
    expect(icons.length).toBe(2);
  });

  it('renders inline svg icons from icon object map', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { id: 'home', label: 'Home' },
      { label: 'Current' },
    ];
    fixture.componentInstance.itemIcons = {
      home: {
        svg: '<svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5"></path><path d="M5 10v10h14V10"></path></svg>',
      },
    };
    fixture.detectChanges();

    const svgIcons = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__item-icon--svg') as NodeListOf<HTMLElement>;
    expect(svgIcons.length).toBe(1);
    expect(svgIcons[0]?.innerHTML).toContain('<svg');
  });

  it('applies variant and elevation/shadow classes', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [{ label: 'Home' }, { label: 'Current' }];
    fixture.componentInstance.variant = 'segmented';
    fixture.componentInstance.elevation = 'raised';
    fixture.componentInstance.shadow = true;
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.nsh-breadcrumb') as HTMLElement;
    expect(nav.getAttribute('data-variant')).toBe('segmented');
    expect(nav.classList.contains('nsh-breadcrumb--raised')).toBe(true);
    expect(nav.classList.contains('nsh-breadcrumb--shadow')).toBe(true);
  });

  it('applies steps variant active item and accent color variable', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'ECMAScript', href: '/a' },
      { label: 'HTML5', href: '/b' },
      { label: 'Node.js', href: '/c' },
      { label: 'Linux' },
    ];
    fixture.componentInstance.variant = 'steps';
    fixture.componentInstance.activeIndex = 0;
    fixture.componentInstance.accentColor = '#e91e63';
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.nsh-breadcrumb') as HTMLElement;
    expect(nav.style.getPropertyValue('--nsh-breadcrumb-accent').trim()).toBe('#e91e63');

    const activeItems = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__item--active') as NodeListOf<HTMLElement>;
    expect(activeItems.length).toBe(1);
    expect(activeItems[0]?.textContent).toContain('ECMAScript');
  });

  it('truncateOnClick removes trailing crumbs when clicking a previous crumb', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.items = [
      { label: 'Home', href: '/a' },
      { label: 'Section', href: '/b' },
      { label: 'Article', href: '/c' },
      { label: 'Details' },
    ];
    fixture.componentInstance.truncateOnClick = true;
    fixture.detectChanges();

    const linksBefore = fixture.nativeElement.querySelectorAll('a.nsh-breadcrumb__link') as NodeListOf<HTMLAnchorElement>;
    expect(linksBefore.length).toBe(3);

    linksBefore[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const itemsAfter = fixture.nativeElement.querySelectorAll('.nsh-breadcrumb__item') as NodeListOf<HTMLElement>;
    expect(itemsAfter.length).toBe(2);

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Home');
    expect(text).toContain('Section');
    expect(text).not.toContain('Article');
    expect(text).not.toContain('Details');
  });
});
