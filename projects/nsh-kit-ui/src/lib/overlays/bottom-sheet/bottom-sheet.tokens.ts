import { InjectionToken } from '@angular/core';

import type { NshBottomSheetConfig } from './bottom-sheet.types';

export const NSH_BOTTOM_SHEET_DATA = new InjectionToken<unknown>('NSH_BOTTOM_SHEET_DATA');

export const NSH_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken<NshBottomSheetConfig>(
  'NSH_BOTTOM_SHEET_DEFAULT_OPTIONS',
);
