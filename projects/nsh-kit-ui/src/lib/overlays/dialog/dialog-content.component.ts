import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nsh-dialog-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-dialog-content]': 'true',
  },
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: grid;
      gap: var(--_dlg-content-gap, var(--nsh-space-md));
      color: inherit;
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
      overflow: auto;
      max-height: var(--nsh-dialog-content-max-height, calc(var(--nsh-space-xl) * 12));
    }
  `,
})
export class NshDialogContentComponent {}
