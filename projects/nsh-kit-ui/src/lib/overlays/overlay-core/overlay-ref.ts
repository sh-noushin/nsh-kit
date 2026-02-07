import { type ComponentRef, signal } from '@angular/core';

export class NshOverlayRef<TComponent> {
  readonly closed = signal(false);

  constructor(
    readonly container: HTMLElement,
    readonly componentRef: ComponentRef<TComponent>,
    private readonly disposeFn: () => void,
  ) {}

  close(): void {
    if (this.closed()) {
      return;
    }

    this.closed.set(true);
    this.disposeFn();
  }
}
