import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshChipComponent } from './chip.component';

@Component({
  standalone: true,
  imports: [NshChipComponent],
  template: `
    <nsh-chip
      [disabled]="disabled"
      [selected]="selected"
      [removable]="removable"
      [leadingIcon]="leadingIcon"
      [trailingIcon]="trailingIcon"
      [ariaLabel]="ariaLabel"
      (clicked)="clickedCount = clickedCount + 1"
      (removed)="removedCount = removedCount + 1"
    >
      {{ text }}
    </nsh-chip>
  `,
})
class HostComponent {
  disabled = false;
  selected = false;
  removable = false;

  leadingIcon: string | null = null;
  trailingIcon: string | null = null;
  ariaLabel: string | null = null;

  text = 'Chip label';

  clickedCount = 0;
  removedCount = 0;
}

@Component({
  standalone: true,
  imports: [NshChipComponent],
  template: ` <nsh-chip [leadingIcon]="'user'" /> `,
})
class IconOnlyMissingAriaLabelHostComponent {}

@Component({
  standalone: true,
  imports: [NshChipComponent],
  template: ` <nsh-chip [leadingIcon]="'user'" ariaLabel="User" /> `,
})
class IconOnlyWithAriaLabelHostComponent {}

describe('NshChipComponent', () => {
  it('renders projected text', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector('.nsh-chip__text') as HTMLElement;
    expect(textEl.textContent?.trim()).toBe('Chip label');
  });

  it('emits clicked on click (native button semantics)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.nsh-chip__main') as HTMLButtonElement;

    expect(button.tagName.toLowerCase()).toBe('button');
    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.clickedCount).toBe(1);
  });

  it('when removable=true, shows remove button and emits removed (without emitting clicked)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.removable = true;
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector('.nsh-chip__remove') as HTMLButtonElement;
    expect(removeButton).toBeTruthy();

    removeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount).toBe(1);
    expect(fixture.componentInstance.clickedCount).toBe(0);
  });

  it('disabled=true prevents click/remove emissions', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.removable = true;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const mainButton = fixture.nativeElement.querySelector('.nsh-chip__main') as HTMLButtonElement;
    const removeButton = fixture.nativeElement.querySelector('.nsh-chip__remove') as HTMLButtonElement;

    mainButton.click();
    removeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clickedCount).toBe(0);
    expect(fixture.componentInstance.removedCount).toBe(0);
  });

  it('requires ariaLabel when there is no text content', async () => {
    await TestBed.configureTestingModule({
      imports: [IconOnlyMissingAriaLabelHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(IconOnlyMissingAriaLabelHostComponent);

    expect(() => fixture.detectChanges()).toThrowError(
      /ariaLabel is required when the chip has no text content/i,
    );
  });

  it('sets aria-label from ariaLabel when there is no text content', async () => {
    await TestBed.configureTestingModule({
      imports: [IconOnlyWithAriaLabelHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(IconOnlyWithAriaLabelHostComponent);
    fixture.detectChanges();

    const mainButton = fixture.nativeElement.querySelector('.nsh-chip__main') as HTMLButtonElement;
    expect(mainButton.getAttribute('aria-label')).toBe('User');
  });
});
