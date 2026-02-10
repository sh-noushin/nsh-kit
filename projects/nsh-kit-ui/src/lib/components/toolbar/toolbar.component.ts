import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  input,
} from '@angular/core';

import {
  NshToolbarCenterDirective,
  NshToolbarEndDirective,
  NshToolbarStartDirective,
} from './toolbar-slots.directive';

export type NshToolbarVariant = 'solid' | 'surface' | 'transparent';
export type NshToolbarDensity = 'comfortable' | 'compact';
export type NshToolbarElevation = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'nsh-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-toolbar-host]': 'true',
    '[class.nsh-toolbar-host--solid]': "variant() === 'solid'",
    '[class.nsh-toolbar-host--surface]': "variant() === 'surface'",
    '[class.nsh-toolbar-host--transparent]': "variant() === 'transparent'",
    '[class.nsh-toolbar-host--comfortable]': "density() === 'comfortable'",
    '[class.nsh-toolbar-host--compact]': "density() === 'compact'",
    '[class.nsh-toolbar-host--sticky]': 'sticky()',
    '[class.nsh-toolbar-host--elevation-none]': "elevation() === 'none'",
    '[class.nsh-toolbar-host--elevation-sm]': "elevation() === 'sm'",
    '[class.nsh-toolbar-host--elevation-md]': "elevation() === 'md'",
    '[class.nsh-toolbar-host--elevation-lg]': "elevation() === 'lg'",
    '[attr.role]': '"toolbar"',
    '[attr.aria-label]': 'ariaLabel() ?? null',
  },
  template: `
    <div class="nsh-toolbar">
      @if (hasSlotLayout()) {
        <div class="nsh-toolbar__start">
          <ng-content select="[nshToolbarStart]"></ng-content>
        </div>

        <div class="nsh-toolbar__center">
          <div class="nsh-toolbar__center-inner">
            <ng-content select="[nshToolbarCenter]"></ng-content>
          </div>
        </div>

        <div class="nsh-toolbar__end">
          <ng-content select="[nshToolbarEnd]"></ng-content>
        </div>
      } @else {
        <div class="nsh-toolbar__row">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-toolbar-height: var(--nsh-toolbar-height, unset);
      --nsh-toolbar-padding-x: var(--nsh-toolbar-padding-x, unset);
      --nsh-toolbar-gap: var(--nsh-toolbar-gap, unset);
      --nsh-toolbar-bg: var(--nsh-toolbar-bg, unset);
      --nsh-toolbar-fg: var(--nsh-toolbar-fg, unset);
      --nsh-toolbar-border-color: var(--nsh-toolbar-border-color, unset);
      --nsh-toolbar-radius: var(--nsh-toolbar-radius, unset);
      --nsh-toolbar-shadow: var(--nsh-toolbar-shadow, unset);
      --nsh-toolbar-sticky-top: var(--nsh-toolbar-sticky-top, unset);
      --nsh-toolbar-border-width: var(--nsh-toolbar-border-width, unset);

      --_tb-height: var(--nsh-density-control-height);
      --_tb-pad-x: var(--nsh-density-padding-inline);
      --_tb-gap: var(--nsh-toolbar-gap, var(--nsh-space-sm));
      --_tb-bg: var(--nsh-color-surface);
      --_tb-fg: var(--nsh-color-text);
      --_tb-border-color: var(--nsh-color-border);
      --_tb-radius: var(--nsh-radius-md);
      --_tb-shadow: var(--nsh-elevation-0);
      --_tb-sticky-top: var(--nsh-toolbar-sticky-top, 0);
      --_tb-border-width: var(--nsh-toolbar-border-width, 0);
    }

    :host(.nsh-toolbar-host--comfortable) {
      --_tb-height: var(--nsh-density-control-height);
      --_tb-pad-x: var(--nsh-density-padding-inline);
    }

    :host(.nsh-toolbar-host--compact) {
      --_tb-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_tb-pad-x: calc(var(--nsh-density-padding-inline) - var(--nsh-space-xs));
    }

    :host(.nsh-toolbar-host--solid) {
      --_tb-bg: var(--nsh-color-primary);
      --_tb-fg: var(--nsh-color-surface);
      --_tb-border-color: var(--nsh-color-primary);
    }

    :host(.nsh-toolbar-host--surface) {
      --_tb-bg: var(--nsh-color-surface);
      --_tb-fg: var(--nsh-color-text);
      --_tb-border-color: var(--nsh-color-border);
    }

    :host(.nsh-toolbar-host--transparent) {
      --_tb-bg: var(--nsh-toolbar-bg, transparent);
      --_tb-fg: var(--nsh-color-text);
      --_tb-border-color: var(--nsh-toolbar-border-color, transparent);
    }

    :host(.nsh-toolbar-host--elevation-none) {
      --_tb-shadow: var(--nsh-elevation-0);
    }

    :host(.nsh-toolbar-host--elevation-sm) {
      --_tb-shadow: var(--nsh-elevation-1);
    }

    :host(.nsh-toolbar-host--elevation-md) {
      --_tb-shadow: var(--nsh-elevation-2);
    }

    :host(.nsh-toolbar-host--elevation-lg) {
      --_tb-shadow: var(--nsh-elevation-3);
    }

    :host(.nsh-toolbar-host--sticky) {
      position: sticky;
      top: var(--_tb-sticky-top);
      z-index: var(--nsh-z-overlay);
    }

    .nsh-toolbar {
      display: grid;
      align-items: center;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      min-width: 0;

      height: var(--nsh-toolbar-height, var(--_tb-height));
      padding-inline: var(--nsh-toolbar-padding-x, var(--_tb-pad-x));
      gap: var(--_tb-gap);

      background: var(--nsh-toolbar-bg, var(--_tb-bg));
      color: var(--nsh-toolbar-fg, var(--_tb-fg));
      border: var(--_tb-border-width) solid var(--nsh-toolbar-border-color, var(--_tb-border-color));
      border-radius: var(--nsh-toolbar-radius, var(--_tb-radius));
      box-shadow: var(--nsh-toolbar-shadow, var(--_tb-shadow));

      font-family: var(--nsh-font-family);
    }

    .nsh-toolbar__row {
      display: flex;
      align-items: center;
      gap: var(--_tb-gap);
      min-width: 0;
      grid-column: 1 / -1;
    }

    .nsh-toolbar__start {
      justify-self: start;
      display: inline-flex;
      align-items: center;
      min-width: 0;
      gap: var(--_tb-gap);
    }

    .nsh-toolbar__center {
      justify-self: center;
      min-width: 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .nsh-toolbar__center-inner {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }

    .nsh-toolbar__end {
      justify-self: end;
      display: inline-flex;
      align-items: center;
      min-width: 0;
      gap: var(--_tb-gap);
    }

    .nsh-toolbar__title {
      font-size: var(--nsh-font-size-lg);
      font-weight: var(--nsh-font-weight-semibold);
      line-height: var(--nsh-line-height-tight);
    }
  `,
})
export class NshToolbarComponent {
  readonly variant = input<NshToolbarVariant>('solid');
  readonly density = input<NshToolbarDensity>('comfortable');
  readonly sticky = input(false, { transform: booleanAttribute });
  readonly elevation = input<NshToolbarElevation>('none');
  readonly ariaLabel = input<string | null>('Toolbar');

  private readonly startSlots = contentChildren(NshToolbarStartDirective);
  private readonly centerSlots = contentChildren(NshToolbarCenterDirective);
  private readonly endSlots = contentChildren(NshToolbarEndDirective);

  readonly hasSlotLayout = computed(
    () =>
      this.startSlots().length > 0 ||
      this.centerSlots().length > 0 ||
      this.endSlots().length > 0
  );
}
