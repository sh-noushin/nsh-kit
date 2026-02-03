import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  booleanAttribute,
  forwardRef,
  input,
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';

export type NshListRole = 'list' | 'menu' | 'navigation';

export interface NshListContext {
  role: () => NshListRole;
  dense: () => boolean;
  divider: () => boolean;
}

export const NSH_LIST_CONTEXT = new InjectionToken<NshListContext>('NSH_LIST_CONTEXT');

@Component({
  selector: 'nsh-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [
    {
      provide: NSH_LIST_CONTEXT,
      useExisting: forwardRef(() => NshListComponent),
    },
  ],
  host: {
    '[class.nsh-list-host]': 'true',
    '[class.nsh-list-host--dense]': 'dense()',
    '[class.nsh-list-host--divider]': 'divider()',
    '[class.nsh-list-host--menu]': "role() === 'menu'",
    '[class.nsh-list-host--navigation]': "role() === 'navigation'",
  },
  template: `
    <ng-template #projected>
      <ng-content></ng-content>
    </ng-template>

    @if (role() === 'menu') {
      <div class="nsh-list" role="menu" [attr.aria-label]="ariaLabel() ?? null">
        <ng-container [ngTemplateOutlet]="projected"></ng-container>
      </div>
    } @else {
      <ul class="nsh-list" [attr.aria-label]="ariaLabel() ?? null">
        <ng-container [ngTemplateOutlet]="projected"></ng-container>
      </ul>
    }
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-list-padding-y: var(--nsh-list-padding-y, unset);
      --nsh-list-gap: var(--nsh-list-gap, unset);
      --nsh-list-divider-color: var(--nsh-list-divider-color, unset);

      --_list-padding-y: var(--nsh-list-padding-y, var(--nsh-space-xs));
      --_list-gap: var(--nsh-list-gap, var(--nsh-space-xxs));
      --_list-divider-color: var(--nsh-list-divider-color, var(--nsh-color-outline));
    }

    :host(.nsh-list-host--dense) {
      --_list-padding-y: var(--nsh-space-xxs);
      --_list-gap: 0px;
    }

    .nsh-list {
      margin: 0;
      padding: var(--_list-padding-y) 0;
      min-width: 0;
      font-family: var(--nsh-font-family);
    }

    /* ul reset */
    ul.nsh-list {
      list-style: none;
    }

    :host(.nsh-list-host--divider) .nsh-list :where(nsh-list-item):not(:last-child) {
      border-bottom: 1px solid var(--_list-divider-color);
    }
  `,
})
export class NshListComponent implements NshListContext {
  readonly dense = input(false, { transform: booleanAttribute });
  readonly divider = input(false, { transform: booleanAttribute });
  readonly role = input<NshListRole>('list');
  readonly ariaLabel = input<string | undefined>(undefined);
}
