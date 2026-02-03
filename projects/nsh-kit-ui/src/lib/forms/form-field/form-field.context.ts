import { InjectionToken } from '@angular/core';

export interface NshFormFieldControlContext {
  controlId: () => string;
  labelId: () => string;
  hintId: () => string;
  errorId: () => string;
  describedByIds: () => string | null;
  required: () => boolean;
  disabled: () => boolean;
}

export const NSH_FORM_FIELD_CONTEXT = new InjectionToken<NshFormFieldControlContext>(
  'NSH_FORM_FIELD_CONTEXT',
);
