import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NshDialogActionsAlign = 'start' | 'end' | 'center' | 'space-between';

@Component({
  selector: 'nsh-dialog-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-dialog-actions]': 'true',
    '[class.nsh-dialog-actions--start]': "align() === 'start'",
    '[class.nsh-dialog-actions--end]': "align() === 'end'",
    '[class.nsh-dialog-actions--center]': "align() === 'center'",
    '[class.nsh-dialog-actions--space-between]': "align() === 'space-between'",
  },
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: flex;
      gap: var(--_dlg-actions-gap, var(--nsh-space-sm));
      padding-top: var(--_dlg-actions-padding, var(--nsh-space-md));
      align-items: center;
    }

    :host(.nsh-dialog-actions--start) {
      justify-content: flex-start;
    }

    :host(.nsh-dialog-actions--end) {
      justify-content: flex-end;
    }

    :host(.nsh-dialog-actions--center) {
      justify-content: center;
    }

    :host(.nsh-dialog-actions--space-between) {
      justify-content: space-between;
    }
  `,
})
export class NshDialogActionsComponent {
  readonly align = input<NshDialogActionsAlign>('end');
}
