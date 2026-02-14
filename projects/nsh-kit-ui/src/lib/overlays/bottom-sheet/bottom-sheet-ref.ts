import { signal } from '@angular/core';

export class NshBottomSheetRef<T = any> {
  private readonly dismissedSignal = signal<T | null>(null);

  readonly afterDismissed = this.dismissedSignal.asReadonly();
  readonly afterClosed = this.afterDismissed;

  private dismissed = false;

  constructor(private readonly dismissFn: (result?: T) => void) {}

  dismiss(result?: T): void {
    if (this.dismissed) {
      return;
    }

    this.dismissed = true;
    this.dismissFn(result);
  }

  close(result?: T): void {
    this.dismiss(result);
  }

  _notifyDismissed(result?: T | null): void {
    this.dismissedSignal.set(result ?? null);
  }
}
