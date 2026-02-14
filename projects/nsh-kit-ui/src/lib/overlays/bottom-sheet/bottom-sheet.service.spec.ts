import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NshBottomSheetRef } from './bottom-sheet-ref';
import { NSH_BOTTOM_SHEET_DATA, NSH_BOTTOM_SHEET_DEFAULT_OPTIONS } from './bottom-sheet.tokens';
import { NshBottomSheetService } from './bottom-sheet.service';

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button id="first" type="button">First</button>
    <button id="close" type="button" (click)="close()">Close</button>
  `,
})
class TestBottomSheetComponent {
  private readonly bottomSheetRef = inject<NshBottomSheetRef<string>>(NshBottomSheetRef);

  close(): void {
    this.bottomSheetRef.dismiss('done');
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ dataText() }}`,
})
class TestDataBottomSheetComponent {
  private readonly data = inject(NSH_BOTTOM_SHEET_DATA, { optional: true });

  dataText(): string {
    return JSON.stringify(this.data ?? null);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <button id="opener" type="button">Open</button> `,
})
class TestHostComponent {}

function getContainer(): HTMLElement | null {
  return document.body.querySelector('nsh-bottom-sheet-container');
}

describe('NshBottomSheetService', () => {
  let service: NshBottomSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestBottomSheetComponent, TestHostComponent, TestDataBottomSheetComponent],
    });
    service = TestBed.inject(NshBottomSheetService);
  });

  afterEach(() => {
    document.body.querySelectorAll('.nsh-bottom-sheet-overlay').forEach((el) => el.remove());
    document.body.style.overflow = '';
  });

  it('attaches a bottom sheet container to document.body', () => {
    const ref = service.open(TestBottomSheetComponent, { disableScroll: false });

    expect(getContainer()).toBeTruthy();

    ref.dismiss();
  });

  it('moves focus into the bottom sheet on open', async () => {
    const ref = service.open(TestBottomSheetComponent, { disableScroll: false });

    await nextFrame();

    const first = document.body.querySelector('#first') as HTMLButtonElement | null;
    expect(first).toBeTruthy();
    expect(document.activeElement).toBe(first);

    ref.dismiss();
  });

  it('closes on Escape when enabled', async () => {
    service.open(TestBottomSheetComponent, { disableScroll: false });

    await nextFrame();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(getContainer()).toBeFalsy();
  });

  it('closes on backdrop click when enabled', async () => {
    service.open(TestBottomSheetComponent, { disableScroll: false });

    await nextFrame();

    const backdrop = document.body.querySelector('.nsh-bottom-sheet-backdrop') as HTMLElement | null;
    backdrop?.click();

    expect(getContainer()).toBeFalsy();
  });

  it('emits dismiss result via afterDismissed', () => {
    const ref = service.open(TestBottomSheetComponent, { disableScroll: false });

    expect(ref.afterDismissed()).toBeNull();

    ref.dismiss('done');

    expect(ref.afterDismissed()).toBe('done');
  });

  it('restores focus to opener on dismiss', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const opener = fixture.nativeElement.querySelector('#opener') as HTMLButtonElement;
    opener.focus();

    const ref = service.open(TestBottomSheetComponent, { disableScroll: false });

    await nextFrame();

    ref.dismiss('done');

    expect(document.activeElement).toBe(opener);

    fixture.destroy();
  });

  it('locks and unlocks body scroll when disableScroll is true', async () => {
    const ref = service.open(TestBottomSheetComponent);

    await nextFrame();

    expect(document.body.style.overflow).toBe('hidden');

    ref.dismiss();

    expect(document.body.style.overflow).toBe('');
  });

  it('provides config.data through NSH_BOTTOM_SHEET_DATA token', async () => {
    const ref = service.open(TestDataBottomSheetComponent, {
      disableScroll: false,
      data: { names: ['Frodo', 'Bilbo'] },
    });

    await nextFrame();

    const host = getContainer();
    expect(host?.textContent).toContain('Frodo');
    expect(host?.textContent).toContain('Bilbo');

    ref.dismiss();
  });

  it('uses NSH_BOTTOM_SHEET_DEFAULT_OPTIONS when explicit config is not provided', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TestBottomSheetComponent],
      providers: [
        {
          provide: NSH_BOTTOM_SHEET_DEFAULT_OPTIONS,
          useValue: { closeOnBackdropClick: false, disableScroll: false },
        },
      ],
    });

    const svc = TestBed.inject(NshBottomSheetService);
    const ref = svc.open(TestBottomSheetComponent);

    await nextFrame();

    const backdrop = document.body.querySelector('.nsh-bottom-sheet-backdrop') as HTMLElement | null;
    backdrop?.click();

    expect(getContainer()).toBeTruthy();

    ref.dismiss();
  });
});
