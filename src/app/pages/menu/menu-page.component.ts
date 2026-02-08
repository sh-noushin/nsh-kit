import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshMenuComponent, NshMenuItemDirective, NshMenuTriggerForDirective } from 'nsh-kit-ui';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshMenuComponent, NshMenuTriggerForDirective, NshMenuItemDirective],
  template: `
    <div class="menu-page">
      <h1 class="menu-page__title">Menu</h1>
      <p class="menu-page__subtitle">Overlay menu (overlay-core) demo.</p>

      <section class="menu-page__card">
        <h2 class="menu-page__h2">Basic</h2>

        <button class="menu-page__trigger" type="button" [nshMenuTriggerFor]="basicMenu">
          Open menu
        </button>

        <nsh-menu #basicMenu="nshMenu" ariaLabel="Basic menu">
          <button nshMenuItem type="button" (click)="lastAction.set('Profile')">Profile</button>
          <button nshMenuItem type="button" (click)="lastAction.set('Settings')">Settings</button>
          <button nshMenuItem type="button" (click)="lastAction.set('Logout')">Logout</button>
        </nsh-menu>

        <div class="menu-page__hint">Last action: {{ lastAction() }}</div>
      </section>

      <section class="menu-page__card">
        <h2 class="menu-page__h2">Disabled item</h2>

        <button class="menu-page__trigger" type="button" [nshMenuTriggerFor]="disabledMenu">
          Open menu
        </button>

        <nsh-menu #disabledMenu="nshMenu" ariaLabel="Menu with disabled item">
          <button nshMenuItem type="button">Enabled</button>
          <button nshMenuItem type="button" disabled>Disabled</button>
          <button nshMenuItem type="button">Also enabled</button>
        </nsh-menu>

        <div class="menu-page__hint">Keyboard: ArrowDown/Up/Home/End, Enter, Escape.</div>
      </section>

      <section class="menu-page__card">
        <h2 class="menu-page__h2">Keep open (closeOnItemClick=false)</h2>

        <button class="menu-page__trigger" type="button" [nshMenuTriggerFor]="stayOpenMenu">
          Open menu
        </button>

        <nsh-menu #stayOpenMenu="nshMenu" ariaLabel="Stay open menu" [closeOnItemClick]="false">
          <button nshMenuItem type="button">One</button>
          <button nshMenuItem type="button">Two</button>
          <button nshMenuItem type="button">Three</button>
        </nsh-menu>

        <div class="menu-page__overlay-underlay">
          Underlay content to demonstrate overlay stacking.
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .menu-page {
        display: grid;
		gap: var(--nsh-space-lg);
      }

      .menu-page__title {
        margin: 0;
      }

      .menu-page__subtitle {
        margin: 0;
  		color: var(--nsh-color-text-muted);
      }

      .menu-page__card {
        display: grid;
    gap: var(--nsh-space-md);
    padding: var(--nsh-space-md);
    border: 1px solid var(--nsh-color-outline);
    border-radius: var(--nsh-radius-md);
    background: var(--nsh-color-surface-0);
      }

      .menu-page__h2 {
        margin: 0;
        font-size: 1rem;
      }

      .menu-page__trigger {
        justify-self: start;
      }

      .menu-page__hint {
    color: var(--nsh-color-text-muted);
    font-size: var(--nsh-font-size-sm);
      }

      .menu-page__overlay-underlay {
        position: relative;
        z-index: 0;
    padding: var(--nsh-space-md);
    border-radius: var(--nsh-radius-md);
    border: 1px dashed var(--nsh-color-outline);
    background: var(--nsh-color-surface-1);
      }
    `,
  ],
})
export class MenuPageComponent {
  protected readonly lastAction = signal<string>('(none)');
}
