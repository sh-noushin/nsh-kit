import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshSidenavComponent } from './sidenav.component';

@Component({
  standalone: true,
  imports: [NshSidenavComponent],
  template: `
    <nsh-sidenav
      [open]="open"
      [mode]="mode"
      [position]="position"
      [width]="width"
      [backdrop]="backdrop"
      [closeOnBackdropClick]="closeOnBackdropClick"
      [ariaLabel]="ariaLabel"
      (openChange)="onOpenChange($event)"
    >
      <div nshSidenavPanel id="panel">Panel</div>
      <div nshSidenavContent id="content">Content</div>
    </nsh-sidenav>
  `,
})
class HostComponent {
  open = true;
  mode: 'side' | 'over' = 'side';
  position: 'start' | 'end' = 'start';
  width = '320px';
  backdrop = true;
  closeOnBackdropClick = true;
  ariaLabel: string | undefined;

  openChangeCalls: boolean[] = [];

  onOpenChange(value: boolean) {
    this.openChangeCalls.push(value);
  }
}

describe('NshSidenavComponent', () => {
  it('renders panel + content slots', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#content')).toBeTruthy();

    expect(fixture.nativeElement.querySelector('.nsh-sidenav__panel #panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.nsh-sidenav__content #content')).toBeTruthy();
  });

  it("applies mode='side' vs mode='over' classes", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const sideFixture = TestBed.createComponent(HostComponent);
    sideFixture.componentInstance.mode = 'side';
    sideFixture.detectChanges();

    const side = sideFixture.nativeElement.querySelector('nsh-sidenav') as HTMLElement;
    expect(side.classList.contains('nsh-sidenav--side')).toBe(true);

    const overFixture = TestBed.createComponent(HostComponent);
    overFixture.componentInstance.mode = 'over';
    overFixture.detectChanges();

    const over = overFixture.nativeElement.querySelector('nsh-sidenav') as HTMLElement;
    expect(over.classList.contains('nsh-sidenav--over')).toBe(true);
  });

  it("shows backdrop only when mode='over' and open=true and backdrop=true", async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const openFixture = TestBed.createComponent(HostComponent);
    openFixture.componentInstance.mode = 'over';
    openFixture.componentInstance.open = true;
    openFixture.componentInstance.backdrop = true;
    openFixture.detectChanges();

    expect(openFixture.nativeElement.querySelector('.nsh-sidenav__backdrop')).toBeTruthy();

    const closedFixture = TestBed.createComponent(HostComponent);
    closedFixture.componentInstance.mode = 'over';
    closedFixture.componentInstance.open = false;
    closedFixture.componentInstance.backdrop = true;
    closedFixture.detectChanges();

    expect(closedFixture.nativeElement.querySelector('.nsh-sidenav__backdrop')).toBeNull();
  });

  it('backdrop click closes when closeOnBackdropClick=true (emits openChange(false))', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode = 'over';
    fixture.componentInstance.open = true;
    fixture.componentInstance.backdrop = true;
    fixture.componentInstance.closeOnBackdropClick = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.nsh-sidenav__backdrop') as HTMLElement;
    expect(backdrop).toBeTruthy();

    backdrop.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.openChangeCalls).toEqual([false]);
  });

  it('Escape key closes in over mode when open=true (emits openChange(false))', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode = 'over';
    fixture.componentInstance.open = true;
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.openChangeCalls).toEqual([false]);
  });

  it('width input maps to CSS var', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.width = '400px';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('nsh-sidenav') as HTMLElement;
    expect(host.style.getPropertyValue('--nsh-sidenav-width')).toBe('400px');
  });
});
