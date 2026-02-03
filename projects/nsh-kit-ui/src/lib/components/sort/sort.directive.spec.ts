import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshSortDirective, type NshSortChange } from './sort.directive';
import { NshSortHeaderDirective } from './sort-header.directive';

@Component({
  standalone: true,
  imports: [NshSortDirective, NshSortHeaderDirective],
  template: `
    <div
      nshSort
      [active]="active"
      [direction]="direction"
      [disableClear]="disableClear"
      (sortChange)="onSortChange($event)"
    >
      <div class="h" nshSortHeader id="name">Name</div>
      <div class="h" nshSortHeader id="age">Age</div>
      <div class="h" nshSortHeader id="disabled" [disabled]="disabledHeader">Disabled</div>
    </div>
  `,
})
class HostComponent {
  active: string | null = null;
  direction: 'asc' | 'desc' | '' = '';
  disableClear = false;
  disabledHeader = false;

  events: NshSortChange[] = [];

  onSortChange(ev: NshSortChange) {
    this.events.push(ev);
    this.active = ev.active;
    this.direction = ev.direction;
  }
}

function getHeader(fixture: any, id: string): HTMLElement {
  return fixture.nativeElement.querySelector(`.h[id="${id}"]`) as HTMLElement;
}

describe('Sort primitives', () => {
  it('clicking a sort header sets active and direction and emits sortChange', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    getHeader(fixture, 'name').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.at(-1)).toEqual({ active: 'name', direction: 'asc' });
  });

  it('direction cycles correctly with disableClear=false ("" -> asc -> desc -> "")', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disableClear = false;
    fixture.detectChanges();

    const name = getHeader(fixture, 'name');
    name.click();
    fixture.detectChanges();
    name.click();
    fixture.detectChanges();
    name.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.map((e) => e.direction)).toEqual(['asc', 'desc', '']);
  });

  it('direction cycles correctly with disableClear=true (asc <-> desc)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disableClear = true;
    fixture.detectChanges();

    const name = getHeader(fixture, 'name');
    name.click();
    fixture.detectChanges();
    name.click();
    fixture.detectChanges();
    name.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.map((e) => e.direction)).toEqual(['asc', 'desc', 'asc']);
  });

  it('sorting a different id resets direction to asc', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.active = 'name';
    fixture.componentInstance.direction = 'desc';
    fixture.detectChanges();

    getHeader(fixture, 'age').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.events.at(-1)).toEqual({ active: 'age', direction: 'asc' });
  });

  it('aria-sort attribute set correctly on active header', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const name = getHeader(fixture, 'name');
    const age = getHeader(fixture, 'age');

    name.click();
    fixture.detectChanges();
    expect(name.getAttribute('aria-sort')).toBe('ascending');
    expect(age.hasAttribute('aria-sort')).toBe(false);

    name.click();
    fixture.detectChanges();
    expect(name.getAttribute('aria-sort')).toBe('descending');

    name.click();
    fixture.detectChanges();
    expect(name.hasAttribute('aria-sort')).toBe(false);
  });

  it('disabled header does nothing on click/keyboard', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabledHeader = true;
    fixture.detectChanges();

    const disabled = getHeader(fixture, 'disabled');

    disabled.click();
    fixture.detectChanges();

    disabled.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    disabled.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.events.length).toBe(0);
  });
});
