import { InjectionToken } from '@angular/core';

export interface NshRadioGroupContext {
  value: () => any;
  groupName: () => string;
  isDisabled: () => boolean;
  isRequired: () => boolean;

  select: (value: any) => void;
  markTouched: () => void;

  tabIndexFor: (value: any) => string;
  requestFocusFor: (value: any) => void;
}

export const NSH_RADIO_GROUP_CONTEXT = new InjectionToken<NshRadioGroupContext>(
  'NSH_RADIO_GROUP_CONTEXT',
);
