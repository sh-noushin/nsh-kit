import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nsh-toolbar-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nsh-toolbar__row">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .nsh-toolbar__row {
      display: flex;
      align-items: center;
      gap: var(--nsh-toolbar-gap, var(--nsh-space-sm));
      min-width: 0;
    }
  `,
})
export class NshToolbarRowComponent {}
