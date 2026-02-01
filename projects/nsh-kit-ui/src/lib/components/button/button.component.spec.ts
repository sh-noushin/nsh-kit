import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [NshButtonComponent],
  template: `
    <nsh-button
      [disabled]="disabled"
      [loading]="loading"
      [ariaLabel]="ariaLabel"
      [leadingIcon]="leadingIcon"
      [trailingIcon]="trailingIcon"
    >
      Save
    </nsh-button>
  `,
})
class HostComponent {
  disabled = false;
  loading = false;
  ariaLabel: string | undefined;
  leadingIcon: string | undefined;
  trailingIcon: string | undefined;
}

describe('NshButtonComponent', () => {
  async function createFixture(init?: (instance: HostComponent) => void) {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    init?.(fixture.componentInstance);
    fixture.detectChanges();
    return fixture;
  }

  it('renders projected label text', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.textContent).toContain('Save');
  });

  it('disables the native button when disabled=true', async () => {
    const fixture = await createFixture((instance) => {
      instance.disabled = true;
    });
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('disables the native button when loading=true', async () => {
    const fixture = await createFixture((instance) => {
      instance.loading = true;
    });
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('applies aria-label when provided', async () => {
    const fixture = await createFixture((instance) => {
      instance.ariaLabel = 'Save settings';
    });
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Save settings');
  });

  it('renders leading and trailing icons when provided', async () => {
    const fixture = await createFixture((instance) => {
      instance.leadingIcon = 'left';
      instance.trailingIcon = 'right';
    });

    const icons = fixture.nativeElement.querySelectorAll('nsh-icon');
    expect(icons.length).toBe(2);
  });
});
