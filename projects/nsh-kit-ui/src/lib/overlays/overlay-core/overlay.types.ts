export type NshOverlayPlacement =
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'left'
  | 'right';

export interface NshOverlayConfig {
  anchor: HTMLElement;

  closeOnOutsidePointerDown?: boolean;

  closeOnEscape?: boolean;

  matchWidth?: boolean;

  panelClass?: string | ReadonlyArray<string>;

  placement?: NshOverlayPlacement;

  offsetPx?: number;

  clampToViewport?: boolean;

  viewportMarginPx?: number;

  zIndex?: string;
}
