import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshThemeDirective } from './theme.directive';
import { NshThemeService } from './theme.service';

@Component({
  standalone: true,
  imports: [NshThemeDirective],
  template: `
    <div id="host" [nshTheme]="null"></div>
  `,
})
class HostComponent {}

describe('NshThemeDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let service: NshThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    service = TestBed.inject(NshThemeService);
    fixture.detectChanges();
  });

  it('applies CSS variables to host element', () => {
    const el = fixture.nativeElement.querySelector('#host') as HTMLElement;
    const value = el.style.getPropertyValue('--nsh-color-primary');
    expect(value).toBeTruthy();
  });

  it('updates variables when theme service changes', () => {
    const el = fixture.nativeElement.querySelector('#host') as HTMLElement;
    const before = el.style.getPropertyValue('--nsh-color-surface');

    service.setMode('dark');
    fixture.detectChanges();

    const after = el.style.getPropertyValue('--nsh-color-surface');
    expect(after).toBeTruthy();
    expect(after).not.toEqual(before);
  });
});
