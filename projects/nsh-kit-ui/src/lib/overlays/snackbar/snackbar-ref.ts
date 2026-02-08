import { signal } from '@angular/core';

import type { NshSnackbarCloseReason } from './snackbar.types';

export class NshSnackbarRef {
  private readonly afterClosedSig = signal<{ reason: NshSnackbarCloseReason } | null>(null);

  readonly afterClosed = this.afterClosedSig.asReadonly();

  constructor(private readonly closeFn: (reason: NshSnackbarCloseReason) => void) {}

  close(reason: NshSnackbarCloseReason = 'dismiss'): void {
    if (this.afterClosedSig()) {
      return;
    }

    this.closeFn(reason);
  }

  _notifyClosed(reason: NshSnackbarCloseReason): void {
    if (this.afterClosedSig()) {
      return;
    }

    this.afterClosedSig.set({ reason });
  }
}
