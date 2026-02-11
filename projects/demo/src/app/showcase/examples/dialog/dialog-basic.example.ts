import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  NshButtonComponent,
  NshDialogActionsComponent,
  NshDialogContentComponent,
  NshDialogRef,
  NshDialogService,
  NshDialogTitleComponent,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-dialog-basic-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshDialogActionsComponent, NshDialogContentComponent, NshDialogTitleComponent],
  template: `
    <nsh-dialog-title>Dialog title</nsh-dialog-title>
    <nsh-dialog-content>
      <p>Dialogs focus attention on critical actions.</p>
    </nsh-dialog-content>
    <nsh-dialog-actions>
      <nsh-button variant="text" (click)="close()">Close</nsh-button>
    </nsh-dialog-actions>
  `,
  styles: [
    `
      p {
        margin: 0;
      }
    `,
  ],
})
class DialogBasicContentComponent {
  private readonly dialogRef = inject(NshDialogRef);

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'demo-dialog-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <nsh-button variant="filled" (click)="open()">Open dialog</nsh-button>
  `,
})
export class DialogBasicExampleComponent {
  private readonly dialog = inject(NshDialogService);

  open(): void {
    this.dialog.open(DialogBasicContentComponent, { ariaLabel: 'Example dialog' });
  }
}

export const dialogBasicHtml = `<nsh-button variant="filled" (click)="open()">Open dialog</nsh-button>`;

export const dialogBasicTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NshButtonComponent, NshDialogService } from 'nsh-kit-ui';

@Component({
  selector: 'demo-dialog-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './dialog-basic.example.html'
})
export class DialogBasicExampleComponent {
  private readonly dialog = inject(NshDialogService);

  open(): void {
    this.dialog.open(DialogContentComponent);
  }
}`;
