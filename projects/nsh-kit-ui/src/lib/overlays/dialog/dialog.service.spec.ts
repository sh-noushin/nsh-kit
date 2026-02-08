import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshDialogActionsComponent } from './dialog-actions.component';
import { NshDialogContentComponent } from './dialog-content.component';
import { NshDialogRef } from './dialog-ref';
import { NshDialogService } from './dialog.service';
import { NshDialogTitleComponent } from './dialog-title.component';

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshDialogTitleComponent, NshDialogContentComponent, NshDialogActionsComponent],
  template: `
    <nsh-dialog-title>Dialog title</nsh-dialog-title>
    <nsh-dialog-content>
      <button id="first" type="button">First</button>
      <button id="second" type="button">Second</button>
    </nsh-dialog-content>
    <nsh-dialog-actions>
      <button id="close" type="button" (click)="onClose()">Close</button>
    </nsh-dialog-actions>
  `,
})
class TestDialogComponent {
  private readonly dialogRef = inject<NshDialogRef<string>>(NshDialogRef);

  onClose(): void {
    this.dialogRef.close('done');
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <button id="opener" type="button">Open</button> `,
})
class TestHostComponent {}

function getContainer(): HTMLElement | null {
  return document.body.querySelector('nsh-dialog-container');
}

function getSurface(): HTMLElement | null {
  return document.body.querySelector('.nsh-dialog-surface');
}

describe('NshDialogService', () => {
  let service: NshDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestDialogComponent, TestHostComponent],
    });
    service = TestBed.inject(NshDialogService);
  });

  afterEach(() => {
    document.body.querySelectorAll('.nsh-dialog-overlay').forEach((el) => el.remove());
    document.body.style.overflow = '';
  });

  it('attaches a dialog container to document.body', () => {
    const ref = service.open(TestDialogComponent, { disableScroll: false });

    expect(getContainer()).toBeTruthy();

    ref.close('done');
  });

  it('moves focus into the dialog on open', async () => {
    const ref = service.open(TestDialogComponent, { disableScroll: false });

    await nextFrame();

    const first = document.body.querySelector('#first') as HTMLButtonElement | null;
    expect(first).toBeTruthy();
    expect(document.activeElement).toBe(first);

    ref.close('done');
  });

  it('traps focus within the dialog on Tab and Shift+Tab', async () => {
    const ref = service.open(TestDialogComponent, { disableScroll: false });

    await nextFrame();

    const surface = getSurface();
    const first = document.body.querySelector('#first') as HTMLButtonElement;
    const second = document.body.querySelector('#second') as HTMLButtonElement;
    const close = document.body.querySelector('#close') as HTMLButtonElement;

    first.focus();
    surface?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(document.activeElement).toBe(second);

    surface?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(close);

    surface?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    surface?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(close);

    ref.close('done');
  });

  it('closes on Escape when enabled', async () => {
    service.open(TestDialogComponent, { disableScroll: false });

    await nextFrame();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(getContainer()).toBeFalsy();
  });

  it('closes on backdrop click when enabled', async () => {
    service.open(TestDialogComponent, { disableScroll: false });

    await nextFrame();

    const backdrop = document.body.querySelector('.nsh-dialog-backdrop') as HTMLElement | null;
    backdrop?.click();

    expect(getContainer()).toBeFalsy();
  });

  it('emits the close result via afterClosed', () => {
    const ref = service.open(TestDialogComponent, { disableScroll: false });

    expect(ref.afterClosed()).toBeNull();

    ref.close('done');

    expect(ref.afterClosed()).toBe('done');
  });

  it('restores focus to the opener on close', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const opener = fixture.nativeElement.querySelector('#opener') as HTMLButtonElement;
    opener.focus();

    const ref = service.open(TestDialogComponent, { disableScroll: false });

    await nextFrame();

    ref.close('done');

    expect(document.activeElement).toBe(opener);

    fixture.destroy();
  });

  it('locks and unlocks body scroll when disableScroll is true', async () => {
    const ref = service.open(TestDialogComponent);

    await nextFrame();

    expect(document.body.style.overflow).toBe('hidden');

    ref.close('done');

    expect(document.body.style.overflow).toBe('');
  });
});
