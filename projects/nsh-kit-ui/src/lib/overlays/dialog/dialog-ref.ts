import { signal } from '@angular/core';

export class NshDialogRef<T = any> {
  private readonly closedSignal = signal<T | null>(null);
  readonly afterClosed = this.closedSignal.asReadonly();

  private closed = false;

  constructor(private readonly closeFn: (result?: T) => void) {}

  close(result?: T): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.closeFn(result);
  }

  _notifyClosed(result?: T | null): void {
    this.closedSignal.set(result ?? null);
  }
}
