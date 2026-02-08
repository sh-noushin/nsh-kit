import { TestBed } from '@angular/core/testing';

import { NshSnackbarService } from './snackbar.service';

describe('NshSnackbarService', () => {
  let service: NshSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NshSnackbarService);
  });

  afterEach(() => {
    if (!service) {
      return;
    }

    // Close any remaining snackbars to avoid cross-test leakage.
    while (service.snackbars().length > 0) {
      service.closeLatest('dismiss');
    }

    // In case an overlay slipped through, clear any stray containers.
    document.querySelectorAll('.nsh-snackbar-overlay').forEach((el) => el.remove());
  });

  it('creates a snackbar in the DOM', () => {
    const ref = service.open('Hello world', { durationMs: null });

    const snackbar = document.body.querySelector('.nsh-snackbar') as HTMLElement | null;
    expect(snackbar).toBeTruthy();

    ref.close('dismiss');
  });

  it('auto closes after durationMs with reason timeout', async () => {
    const ref = service.open('Auto close', { durationMs: 200 });

    expect(ref.afterClosed()).toBeNull();

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 210);
    });

    expect(ref.afterClosed()).toEqual({ reason: 'timeout' });
  });

  it('closes with action when the action button is clicked', () => {
    const ref = service.open('With action', {
      durationMs: null,
      actionText: 'Undo',
    });

    const action = document.body.querySelector('.nsh-snackbar__action') as HTMLButtonElement | null;
    expect(action).toBeTruthy();

    action?.click();

    expect(ref.afterClosed()).toEqual({ reason: 'action' });
  });

  it('closes with dismiss when the dismiss button is clicked', () => {
    const ref = service.open('Dismiss me', { durationMs: null });

    const dismiss = document.body.querySelector('.nsh-snackbar__dismiss') as HTMLButtonElement | null;
    expect(dismiss).toBeTruthy();

    dismiss?.click();

    expect(ref.afterClosed()).toEqual({ reason: 'dismiss' });
  });

  it('respects maxStack by dropping the oldest snackbars', async () => {
    const first = service.open('One', { durationMs: null, maxStack: 3 });
    service.open('Two', { durationMs: null, maxStack: 3 });
    service.open('Three', { durationMs: null, maxStack: 3 });
    service.open('Four', { durationMs: null, maxStack: 3 });

    // Allow any queued change detection to flush.
    await Promise.resolve();

    const snackbars = document.body.querySelectorAll('.nsh-snackbar');
    expect(snackbars.length).toBe(3);
    expect(first.afterClosed()).toEqual({ reason: 'dismiss' });
  });

  it('applies the position attribute to the container', () => {
    const ref = service.open('Positioned', {
      durationMs: null,
      position: 'top-end',
    });

    const container = document.body.querySelector('nsh-snackbar-container') as HTMLElement | null;
    expect(container).toBeTruthy();
    expect(container?.getAttribute('data-position')).toBe('top-end');

    ref.close('dismiss');
  });

  it('cleans up the overlay container after closing all snackbars', () => {
    const first = service.open('One', { durationMs: null });
    first.close('dismiss');

    expect(document.body.querySelectorAll('.nsh-snackbar-overlay').length).toBe(0);

    const second = service.open('Two', { durationMs: null });
    expect(document.body.querySelectorAll('.nsh-snackbar-overlay').length).toBe(1);

    second.close('dismiss');

    expect(document.body.querySelectorAll('.nsh-snackbar-overlay').length).toBe(0);
  });
});
