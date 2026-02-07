export interface NshOverlayConfig {
  anchor: HTMLElement;

  closeOnOutsidePointerDown?: boolean;

  closeOnEscape?: boolean;

  matchWidth?: boolean;

  panelClass?: string | ReadonlyArray<string>;
}
