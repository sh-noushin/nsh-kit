import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type NshToolbarVariant = 'default' | 'dense';
export type NshToolbarColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral'
  | 'surface';

export type NshToolbarElevation = 0 | 1 | 2 | 3 | 4 | 5;

@Component({
  selector: 'nsh-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-toolbar-host]': 'true',
    '[class.nsh-toolbar-host--sticky]': 'sticky()',

    '[class.nsh-toolbar-host--default]': "variant() === 'default'",
    '[class.nsh-toolbar-host--dense]': "variant() === 'dense'",

    '[class.nsh-toolbar-host--primary]': "color() === 'primary'",
    '[class.nsh-toolbar-host--secondary]': "color() === 'secondary'",
    '[class.nsh-toolbar-host--tertiary]': "color() === 'tertiary'",
    '[class.nsh-toolbar-host--success]': "color() === 'success'",
    '[class.nsh-toolbar-host--warn]': "color() === 'warn'",
    '[class.nsh-toolbar-host--danger]': "color() === 'danger'",
    '[class.nsh-toolbar-host--neutral]': "color() === 'neutral'",
    '[class.nsh-toolbar-host--surface]': "color() === 'surface'",

    '[class.nsh-toolbar-host--elevation-0]': 'elevation() === 0',
    '[class.nsh-toolbar-host--elevation-1]': 'elevation() === 1',
    '[class.nsh-toolbar-host--elevation-2]': 'elevation() === 2',
    '[class.nsh-toolbar-host--elevation-3]': 'elevation() === 3',
    '[class.nsh-toolbar-host--elevation-4]': 'elevation() === 4',
    '[class.nsh-toolbar-host--elevation-5]': 'elevation() === 5',
  },
  template: `
    <header class="nsh-toolbar" [attr.aria-label]="ariaLabel() ?? null">
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
    </header>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-toolbar-height: var(--nsh-toolbar-height, unset);
      --nsh-toolbar-padding-x: var(--nsh-toolbar-padding-x, unset);
      --nsh-toolbar-bg: var(--nsh-toolbar-bg, unset);
      --nsh-toolbar-fg: var(--nsh-toolbar-fg, unset);
      --nsh-toolbar-elevation: var(--nsh-toolbar-elevation, unset);

      --_tb-height: var(--nsh-density-control-height);
      --_tb-pad-x: var(--nsh-density-padding-inline);

      --_tb-bg: var(--nsh-color-surface);
      --_tb-fg: var(--nsh-color-text);

      --_tb-shadow: var(--nsh-elevation-0);

      /* Default z-index for sticky */
      --_tb-sticky-z: var(--nsh-z-overlay);
    }

    :host(.nsh-toolbar-host--default) {
      --_tb-height: var(--nsh-density-control-height);
      --_tb-pad-x: var(--nsh-density-padding-inline);
    }

    :host(.nsh-toolbar-host--dense) {
      --_tb-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_tb-pad-x: calc(var(--nsh-density-padding-inline) - var(--nsh-space-xs));
    }

    /* Color mapping */
    :host(.nsh-toolbar-host--surface) {
      --_tb-bg: var(--nsh-color-surface);
      --_tb-fg: var(--nsh-color-text);
    }

    :host(.nsh-toolbar-host--primary) {
      --_tb-bg: var(--nsh-color-primary);
      --_tb-fg: var(--nsh-color-surface);
    }

    :host(.nsh-toolbar-host--secondary) {
      --_tb-bg: var(--nsh-color-secondary);
      --_tb-fg: var(--nsh-color-surface);
    }

    :host(.nsh-toolbar-host--tertiary) {
      --_tb-bg: var(--nsh-color-tertiary);
      --_tb-fg: var(--nsh-color-surface);
    }

    :host(.nsh-toolbar-host--success) {
      --_tb-bg: var(--nsh-color-success);
      --_tb-fg: var(--nsh-color-surface);
    }

    :host(.nsh-toolbar-host--warn) {
      --_tb-bg: var(--nsh-color-warn);
      --_tb-fg: var(--nsh-color-surface);
    }

    :host(.nsh-toolbar-host--danger) {
      --_tb-bg: var(--nsh-color-danger);
      --_tb-fg: var(--nsh-color-surface);
    }

    :host(.nsh-toolbar-host--neutral) {
      --_tb-bg: var(--nsh-color-surface-1);
      --_tb-fg: var(--nsh-color-text);
    }

    /* Elevation mapping (token-only). 4/5 map to the highest available token. */
    :host(.nsh-toolbar-host--elevation-0) {
      --_tb-shadow: var(--nsh-elevation-0);
    }

    :host(.nsh-toolbar-host--elevation-1) {
      --_tb-shadow: var(--nsh-elevation-1);
    }

    :host(.nsh-toolbar-host--elevation-2) {
      --_tb-shadow: var(--nsh-elevation-2);
    }

    :host(.nsh-toolbar-host--elevation-3),
    :host(.nsh-toolbar-host--elevation-4),
    :host(.nsh-toolbar-host--elevation-5) {
      --_tb-shadow: var(--nsh-elevation-3);
    }

    :host(.nsh-toolbar-host--sticky) {
      position: sticky;
      top: 0;
      z-index: var(--_tb-sticky-z);
    }

    .nsh-toolbar {
      display: grid;
      align-items: center;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      height: var(--nsh-toolbar-height, var(--_tb-height));
      padding-inline: var(--nsh-toolbar-padding-x, var(--_tb-pad-x));

      background: var(--nsh-toolbar-bg, var(--_tb-bg));
      color: var(--nsh-toolbar-fg, var(--_tb-fg));
      box-shadow: var(--nsh-toolbar-elevation, var(--_tb-shadow));

      font-family: var(--nsh-font-family);
      gap: var(--nsh-space-sm);
      min-width: 0;
    }

    .nsh-toolbar__start {
      justify-self: start;
      display: inline-flex;
      align-items: center;
      min-width: 0;
      gap: var(--nsh-space-sm);
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
      gap: var(--nsh-space-sm);
    }
  `,
})
export class NshToolbarComponent {
  readonly variant = input<NshToolbarVariant>('default');
  readonly color = input<NshToolbarColor>('surface');
  readonly elevation = input<NshToolbarElevation>(0);
  readonly sticky = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
}
