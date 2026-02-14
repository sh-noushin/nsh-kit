export type NshBottomSheetAutoFocusTarget =
  | boolean
  | 'first-tabbable'
  | 'first-header'
  | 'dialog'
  | (string & {});

export interface NshBottomSheetConfig {
  ariaLabel?: string | null;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  disableScroll?: boolean;
  width?: string | null;
  maxWidth?: string | null;
  maxHeight?: string | null;
  autoFocus?: NshBottomSheetAutoFocusTarget;
  data?: unknown;
}
