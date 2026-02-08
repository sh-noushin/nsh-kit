import { InjectionToken } from '@angular/core';

export type NshMenuCloseReason = 'escape' | 'item' | 'programmatic';

export interface NshMenuPanelItemHandle {
  readonly nativeElement: HTMLElement;

  isDisabled(): boolean;

  setTabIndex(value: number): void;

  focus(): void;

  click(): void;
}

export interface NshMenuPanelRegistry {
  register(item: NshMenuPanelItemHandle): void;

  unregister(item: NshMenuPanelItemHandle): void;

  notifyItemActivated(item: NshMenuPanelItemHandle): void;
}

export const NSH_MENU_PANEL = new InjectionToken<NshMenuPanelRegistry>('NSH_MENU_PANEL');
