import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input } from '@angular/core';

import { NshDialogContainerComponent } from './dialog-container.component';

let nextTitleId = 0;

@Component({
  selector: 'nsh-dialog-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-dialog-title]': 'true',
    '[attr.id]': 'resolvedId()',
  },
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: block;
      font-size: var(--_dlg-title-size, var(--nsh-font-size-lg));
      font-weight: var(--nsh-font-weight-medium);
      color: inherit;
      margin: 0;
    }
  `,
})
export class NshDialogTitleComponent {
  private readonly container = inject(NshDialogContainerComponent, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input<string | null>(null);

  private readonly autoId = `nsh-dialog-title-${nextTitleId++}`;
  readonly resolvedId = computed(() => this.id() ?? this.autoId);

  constructor() {
    effect(() => {
      const id = this.resolvedId();
      this.container?.registerTitleId(id);
    });

    this.destroyRef.onDestroy(() => {
      this.container?.clearTitleId(this.resolvedId());
    });
  }
}
