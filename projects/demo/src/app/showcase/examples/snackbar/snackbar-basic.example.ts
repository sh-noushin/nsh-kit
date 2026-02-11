import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NshButtonComponent, NshSnackbarService } from 'nsh-kit-ui';

@Component({
  selector: 'demo-snackbar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <nsh-button variant="outlined" (click)="notify()">Show snackbar</nsh-button>
  `,
})
export class SnackbarBasicExampleComponent {
  private readonly snackbar = inject(NshSnackbarService);

  notify(): void {
    this.snackbar.open('Saved changes', { variant: 'success' });
  }
}

export const snackbarBasicHtml = `<nsh-button variant="outlined" (click)="notify()">Show snackbar</nsh-button>`;

export const snackbarBasicTs = `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NshButtonComponent, NshSnackbarService } from 'nsh-kit-ui';

@Component({
  selector: 'demo-snackbar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './snackbar-basic.example.html'
})
export class SnackbarBasicExampleComponent {
  private readonly snackbar = inject(NshSnackbarService);

  notify(): void {
    this.snackbar.open('Saved changes', { variant: 'success' });
  }
}`;
