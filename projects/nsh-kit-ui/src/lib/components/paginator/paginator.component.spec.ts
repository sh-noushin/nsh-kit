import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshPaginatorComponent, type NshPageChangeEvent } from './paginator.component';

@Component({
  standalone: true,
  imports: [NshPaginatorComponent],
  template: `
    <nsh-paginator
      [length]="length"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      [showFirstLast]="showFirstLast"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (pageChange)="onPageChange($event)"
    />
  `,
})
class HostComponent {
  length = 100;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];
  showFirstLast = true;
  disabled = false;
  ariaLabel = 'Pagination';

  events: NshPageChangeEvent[] = [];

  onPageChange(ev: NshPageChangeEvent) {
    this.events.push(ev);
    this.pageIndex = ev.pageIndex;
    this.pageSize = ev.pageSize;
  }
}

function getButtons(root: HTMLElement) {
  const first = root.querySelector('button[aria-label="First page"]') as HTMLButtonElement | null;
  const prev = root.querySelector('button[aria-label="Previous page"]') as HTMLButtonElement;
  const next = root.querySelector('button[aria-label="Next page"]') as HTMLButtonElement;
  const last = root.querySelector('button[aria-label="Last page"]') as HTMLButtonElement | null;
  return { first, prev, next, last };
}

describe('NshPaginatorComponent', () => {
  it('computes total pages correctly (last page index)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.length = 101;
    fixture.componentInstance.pageSize = 10;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-paginator') as HTMLElement;
    const { last } = getButtons(host);
    expect(last).toBeTruthy();

    last!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.at(-1)).toEqual({ pageIndex: 10, pageSize: 10, length: 101 });
  });

  it('emits pageChange on next/prev/first/last click with correct values', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.length = 100;
    fixture.componentInstance.pageSize = 10;
    fixture.componentInstance.pageIndex = 5;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-paginator') as HTMLElement;
    const { first, prev, next, last } = getButtons(host);

    prev.click();
    fixture.detectChanges();
    next.click();
    fixture.detectChanges();
    first!.click();
    fixture.detectChanges();
    last!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events).toEqual([
      { pageIndex: 4, pageSize: 10, length: 100 },
      { pageIndex: 5, pageSize: 10, length: 100 },
      { pageIndex: 0, pageSize: 10, length: 100 },
      { pageIndex: 9, pageSize: 10, length: 100 },
    ]);
  });

  it('disables buttons at boundaries', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const firstFixture = TestBed.createComponent(HostComponent);
    firstFixture.componentInstance.pageIndex = 0;
    firstFixture.detectChanges();

    const firstHost = firstFixture.nativeElement.querySelector('nsh-paginator') as HTMLElement;
    const firstButtons = getButtons(firstHost);
    expect(firstButtons.prev.disabled).toBe(true);
    expect(firstButtons.first!.disabled).toBe(true);

    const lastFixture = TestBed.createComponent(HostComponent);
    lastFixture.componentInstance.length = 100;
    lastFixture.componentInstance.pageSize = 10;
    lastFixture.componentInstance.pageIndex = 9;
    lastFixture.detectChanges();

    const lastHost = lastFixture.nativeElement.querySelector('nsh-paginator') as HTMLElement;
    const lastButtons = getButtons(lastHost);
    expect(lastButtons.next.disabled).toBe(true);
    expect(lastButtons.last!.disabled).toBe(true);
  });

  it('changing pageSize emits pageChange and resets pageIndex to 0', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.pageIndex = 3;
    fixture.componentInstance.pageSize = 10;
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select.nsh-paginator__select') as HTMLSelectElement;
    select.value = '25';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.events.at(-1)).toEqual({ pageIndex: 0, pageSize: 25, length: 100 });
  });

  it('range text (X–Y of length) computed correctly', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const firstFixture = TestBed.createComponent(HostComponent);
    firstFixture.componentInstance.length = 100;
    firstFixture.componentInstance.pageSize = 10;
    firstFixture.componentInstance.pageIndex = 0;
    firstFixture.detectChanges();

    const firstRange = firstFixture.nativeElement.querySelector('.nsh-paginator__range') as HTMLElement;
    expect(firstRange.textContent).toContain('1–10 of 100');

    const lastFixture = TestBed.createComponent(HostComponent);
    lastFixture.componentInstance.length = 100;
    lastFixture.componentInstance.pageSize = 10;
    lastFixture.componentInstance.pageIndex = 9;
    lastFixture.detectChanges();

    const lastRange = lastFixture.nativeElement.querySelector('.nsh-paginator__range') as HTMLElement;
    expect(lastRange.textContent).toContain('91–100 of 100');
  });

  it('a11y: navigation aria-label present, button aria-labels present', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.ariaLabel = 'Pager';
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav[role="navigation"]') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Pager');

    expect(fixture.nativeElement.querySelector('button[aria-label="Previous page"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button[aria-label="Next page"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button[aria-label="First page"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button[aria-label="Last page"]')).toBeTruthy();
  });
});
