import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export type NshSidenavMode = 'side' | 'over';
export type NshSidenavPosition = 'start' | 'end';

@Component({
  selector: 'nsh-sidenav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-sidenav]': 'true',
    '[class.nsh-sidenav--open]': 'open()',
    '[class.nsh-sidenav--closed]': '!open()',

    '[class.nsh-sidenav--side]': "mode() === 'side'",
    '[class.nsh-sidenav--over]': "mode() === 'over'",

    '[class.nsh-sidenav--start]': "position() === 'start'",
    '[class.nsh-sidenav--end]': "position() === 'end'",

    '[class.nsh-sidenav--backdrop]': 'showBackdrop()',

    '[style.--nsh-sidenav-width]': 'width()',
  },
  template: `
    <div class="nsh-sidenav__layout">
      @if (showBackdrop()) {
        <div
          class="nsh-sidenav__backdrop"
          aria-hidden="true"
          tabindex="-1"
          (click)="onBackdropClick()"
        ></div>
      }

      <nav class="nsh-sidenav__panel" [attr.aria-label]="navAriaLabel()">
        <ng-content select="[nshSidenavPanel]"></ng-content>
      </nav>

      <div class="nsh-sidenav__content">
        <ng-content select="[nshSidenavContent]"></ng-content>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-sidenav-width: var(--nsh-sidenav-width, 280px);
      --nsh-sidenav-bg: var(--nsh-sidenav-bg, unset);
      --nsh-sidenav-fg: var(--nsh-sidenav-fg, unset);
      --nsh-sidenav-backdrop-bg: var(--nsh-sidenav-backdrop-bg, unset);
      --nsh-sidenav-shadow: var(--nsh-sidenav-shadow, unset);
      --nsh-sidenav-transition-duration: var(--nsh-sidenav-transition-duration, unset);

      --_sd-width: var(--nsh-sidenav-width);
      --_sd-bg: var(--nsh-sidenav-bg, var(--nsh-color-surface-1));
      --_sd-fg: var(--nsh-sidenav-fg, var(--nsh-color-text));

      --_sd-backdrop-bg: var(
        --nsh-sidenav-backdrop-bg,
        color-mix(in srgb, var(--nsh-color-text) 35%, transparent)
      );

      --_sd-shadow: var(--nsh-sidenav-shadow, var(--nsh-elevation-2));
      --_sd-duration: var(--nsh-sidenav-transition-duration, var(--nsh-motion-duration-medium));
      --_sd-easing: var(--nsh-motion-easing-standard);

      --_sd-z-panel: var(--nsh-z-overlay);
      --_sd-z-backdrop: var(--nsh-z-overlay);
    }

    .nsh-sidenav__layout {
      position: relative;
      display: grid;
      min-width: 0;
      min-height: 0;
    }

    /* Side mode: panel occupies space */
    :host(.nsh-sidenav--side) .nsh-sidenav__layout {
      grid-template-rows: auto;
    }

    :host(.nsh-sidenav--side.nsh-sidenav--start) .nsh-sidenav__layout {
      grid-template-columns: var(--_sd-panel-col, var(--_sd-width)) minmax(0, 1fr);
    }

    :host(.nsh-sidenav--side.nsh-sidenav--end) .nsh-sidenav__layout {
      grid-template-columns: minmax(0, 1fr) var(--_sd-panel-col, var(--_sd-width));
    }

    :host(.nsh-sidenav--side.nsh-sidenav--closed) {
      --_sd-panel-col: 0px;
    }

    :host(.nsh-sidenav--side.nsh-sidenav--closed) .nsh-sidenav__panel {
      opacity: 0;
      pointer-events: none;
    }

    /* Over mode: panel overlays */
    :host(.nsh-sidenav--over) .nsh-sidenav__layout {
      display: block;
    }

    .nsh-sidenav__panel {
      box-sizing: border-box;
      width: var(--_sd-width);
      background: var(--_sd-bg);
      color: var(--_sd-fg);
      font-family: var(--nsh-font-family);

      min-height: 100%;
      overflow: auto;

      transition:
        transform var(--_sd-duration) var(--_sd-easing),
        opacity var(--_sd-duration) var(--_sd-easing),
        width var(--_sd-duration) var(--_sd-easing);

      outline: none;
    }

    :host(.nsh-sidenav--side) .nsh-sidenav__panel {
      position: relative;
      transform: translateX(0);
      box-shadow: none;
      border-inline-end: 1px solid color-mix(in srgb, var(--nsh-color-border) 65%, transparent);
    }

    :host(.nsh-sidenav--side.nsh-sidenav--end) .nsh-sidenav__panel {
      border-inline-end: 0;
      border-inline-start: 1px solid color-mix(in srgb, var(--nsh-color-border) 65%, transparent);
    }

    :host(.nsh-sidenav--over) .nsh-sidenav__panel {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: var(--_sd-z-panel);
      box-shadow: var(--_sd-shadow);
    }

    :host(.nsh-sidenav--over.nsh-sidenav--start) .nsh-sidenav__panel {
      inset-inline-start: 0;
      transform: translateX(var(--_sd-over-x, 0));
    }

    :host(.nsh-sidenav--over.nsh-sidenav--end) .nsh-sidenav__panel {
      inset-inline-end: 0;
      transform: translateX(var(--_sd-over-x, 0));
    }

    :host(.nsh-sidenav--over.nsh-sidenav--closed.nsh-sidenav--start) {
      --_sd-over-x: -100%;
    }

    :host(.nsh-sidenav--over.nsh-sidenav--closed.nsh-sidenav--end) {
      --_sd-over-x: 100%;
    }

    .nsh-sidenav__content {
      min-width: 0;
      min-height: 0;
    }

    :host(.nsh-sidenav--over) .nsh-sidenav__content {
      position: relative;
    }

    .nsh-sidenav__backdrop {
      position: absolute;
      inset: 0;
      z-index: var(--_sd-z-backdrop);
      background: var(--_sd-backdrop-bg);
      opacity: 1;
      transition: opacity var(--_sd-duration) var(--_sd-easing);
    }

    :host(.nsh-sidenav--over.nsh-sidenav--closed) .nsh-sidenav__backdrop {
      opacity: 0;
      pointer-events: none;
    }
  `,
})
export class NshSidenavComponent {
  readonly open = input(true, { transform: booleanAttribute });
  readonly mode = input<NshSidenavMode>('side');
  readonly position = input<NshSidenavPosition>('start');
  readonly width = input('280px');
  readonly backdrop = input(true, { transform: booleanAttribute });
  readonly closeOnBackdropClick = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly openChange = output<boolean>();

  readonly showBackdrop = computed(
    () => this.mode() === 'over' && this.open() && this.backdrop()
  );

  readonly navAriaLabel = computed(() => this.ariaLabel() ?? 'Navigation');

  onBackdropClick() {
    if (this.mode() !== 'over' || !this.open()) {
      return;
    }
    if (!this.backdrop() || !this.closeOnBackdropClick()) {
      return;
    }

    this.openChange.emit(false);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }
    if (this.mode() !== 'over' || !this.open()) {
      return;
    }

    this.openChange.emit(false);
  }
}
