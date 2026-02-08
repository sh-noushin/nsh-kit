export type NshSnackbarVariant = 'neutral' | 'success' | 'warn' | 'danger';

export type NshSnackbarPosition =
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'
  | 'top-start'
  | 'top-center'
  | 'top-end';

export interface NshSnackbarConfig {
  durationMs?: number | null;
  variant?: NshSnackbarVariant;
  actionText?: string | null;
  ariaLive?: 'polite' | 'assertive';
  position?: NshSnackbarPosition;
  maxStack?: number;
}

export type NshSnackbarCloseReason = 'dismiss' | 'action' | 'timeout';
