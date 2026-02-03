import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  booleanAttribute,
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';

import { NshIconComponent } from '../../foundations/icon';
import { NSH_LIST_CONTEXT, type NshListContext } from './list.component';

@Component({
  selector: 'nsh-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NshIconComponent],
  host: {
    '[class.nsh-list-item-host]': 'true',
    '[class.nsh-list-item-host--disabled]': 'disabled()',
    '[class.nsh-list-item-host--selected]': 'selected()',
  },
  template: `
    @if (disabled()) {
      <div
        class="nsh-list-item"
        aria-disabled="true"
        [attr.role]="itemRole()"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-selected]="ariaSelected()"
        [attr.aria-current]="ariaCurrent()"
      >
        <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
      </div>
    } @else {
      @if (href(); as url) {
        <a
          class="nsh-list-item"
          [href]="url"
          [attr.role]="itemRole()"
          [attr.aria-label]="ariaLabel() ?? null"
          [attr.aria-selected]="ariaSelected()"
          [attr.aria-current]="ariaCurrent()"
        >
          <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
        </a>
      } @else {
        <button
          type="button"
          class="nsh-list-item"
          [attr.role]="itemRole()"
          [attr.aria-label]="ariaLabel() ?? null"
          [attr.aria-selected]="ariaSelected()"
          [attr.aria-current]="ariaCurrent()"
        >
          <ng-container [ngTemplateOutlet]="contentTpl"></ng-container>
        </button>
      }
    }

    <ng-template #contentTpl>
      <span class="nsh-list-item__inner">
        <span class="nsh-list-item__leading">
          <ng-content select="[nshListItemLeading]" />
          @if (leadingIcon(); as iconName) {
            <nsh-icon class="nsh-list-item__icon" [name]="iconName" size="1em" />
          }
        </span>

        <span class="nsh-list-item__content">
          <span class="nsh-list-item__primary">
            <ng-content />
          </span>
          @if (supportingText(); as text) {
            <span class="nsh-list-item__supporting">{{ text }}</span>
          }
        </span>

        <span class="nsh-list-item__trailing">
          <ng-content select="[nshListItemTrailing]" />
          @if (trailingIcon(); as iconName) {
            <nsh-icon class="nsh-list-item__icon" [name]="iconName" size="1em" />
          }
        </span>
      </span>
    </ng-template>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-list-item-height: var(--nsh-list-item-height, unset);
      --nsh-list-item-radius: var(--nsh-list-item-radius, unset);
      --nsh-list-item-bg: var(--nsh-list-item-bg, unset);
      --nsh-list-item-bg-hover: var(--nsh-list-item-bg-hover, unset);
      --nsh-list-item-bg-selected: var(--nsh-list-item-bg-selected, unset);
      --nsh-list-item-fg: var(--nsh-list-item-fg, unset);
      --nsh-list-item-fg-muted: var(--nsh-list-item-fg-muted, unset);
      --nsh-list-focus-ring: var(--nsh-list-focus-ring, unset);

      --_item-height: var(--nsh-list-item-height, var(--nsh-density-control-height));
      --_item-radius: var(--nsh-list-item-radius, var(--nsh-radius-md));

      --_item-fg: var(--nsh-list-item-fg, var(--nsh-color-text));
      --_item-fg-muted: var(--nsh-list-item-fg-muted, var(--nsh-color-text-muted));

      --_item-bg: var(--nsh-list-item-bg, transparent);
      --_item-bg-hover: var(--nsh-list-item-bg-hover, color-mix(in srgb, var(--nsh-color-surface-2) 55%, transparent));
      --_item-bg-selected: var(
        --nsh-list-item-bg-selected,
        color-mix(in srgb, var(--nsh-color-primary) 14%, transparent)
      );

      --_focus-ring: var(
        --nsh-list-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 65%, transparent)
      );

      --_pad-x: var(--nsh-density-padding-inline);
      --_pad-y: var(--nsh-space-xxs);
      --_gap: var(--nsh-space-sm);
    }

    .nsh-list-item {
      width: 100%;
      min-height: var(--_item-height);
      display: flex;
      align-items: center;
      text-align: left;

      padding: var(--_pad-y) var(--_pad-x);
      gap: var(--_gap);

      border: 0;
      border-radius: var(--_item-radius);
      background: var(--_item-bg);
      color: var(--_item-fg);
      font: inherit;

      text-decoration: none;
      cursor: pointer;
      user-select: none;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    :host(.nsh-list-item-host--selected) .nsh-list-item {
      background: var(--_item-bg-selected);
    }

    :host(:not(.nsh-list-item-host--disabled)) .nsh-list-item:hover {
      background: var(--_item-bg-hover);
    }

    .nsh-list-item:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--nsh-space-xxs) var(--_focus-ring);
    }

    :host(.nsh-list-item-host--disabled) .nsh-list-item {
      cursor: default;
      opacity: 0.6;
    }

    .nsh-list-item__inner {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: var(--_gap);
      width: 100%;
      min-width: 0;
    }

    .nsh-list-item__leading,
    .nsh-list-item__trailing {
      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-xs);
      color: var(--_item-fg-muted);
      flex: 0 0 auto;
    }

    .nsh-list-item__content {
      display: grid;
      gap: var(--nsh-space-xxs);
      min-width: 0;
    }

    .nsh-list-item__primary {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nsh-list-item__supporting {
      color: var(--_item-fg-muted);
      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nsh-list-item__icon {
      display: inline-flex;
      color: currentColor;
    }
  `,
})
export class NshListItemComponent {
  private readonly parent = inject<NshListContext | null>(NSH_LIST_CONTEXT, { optional: true });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly href = input<string | null>(null);
  readonly routerLink = input<any[] | string | null>(null);
  readonly leadingIcon = input<string | null>(null);
  readonly trailingIcon = input<string | null>(null);
  readonly supportingText = input<string | null>(null);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly listRole = computed(() => this.parent?.role?.() ?? 'list');

  readonly itemRole = computed(() => (this.listRole() === 'menu' ? 'menuitem' : null));

  readonly ariaSelected = computed(() => {
    if (!this.selected()) {
      return null;
    }

    return this.listRole() === 'menu' ? 'true' : null;
  });

  readonly ariaCurrent = computed(() => {
    if (!this.selected()) {
      return null;
    }

    return this.listRole() === 'navigation' ? 'page' : null;
  });
}
