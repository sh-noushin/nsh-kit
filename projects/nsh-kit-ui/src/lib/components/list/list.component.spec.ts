import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshListComponent } from './list.component';

@Component({
  standalone: true,
  imports: [NshListComponent],
  template: `
    <nsh-list [role]="role" [ariaLabel]="ariaLabel">
      <div>Item</div>
    </nsh-list>
  `,
})
class HostComponent {
  role: 'list' | 'menu' | 'navigation' = 'list';
  ariaLabel: string | undefined;
}

describe('NshListComponent', () => {
  it("renders <div role='menu'> when role='menu'", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.role = 'menu';
    fixture.componentInstance.ariaLabel = 'Actions';
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.nsh-list') as HTMLElement;
    expect(root.tagName.toLowerCase()).toBe('div');
    expect(root.getAttribute('role')).toBe('menu');
    expect(root.getAttribute('aria-label')).toBe('Actions');
  });

  it("renders <ul> when role='list'", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.role = 'list';
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.nsh-list') as HTMLElement;
    expect(root.tagName.toLowerCase()).toBe('ul');
  });

  it("renders <ul> when role='navigation'", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.role = 'navigation';
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.nsh-list') as HTMLElement;
    expect(root.tagName.toLowerCase()).toBe('ul');
  });
});
