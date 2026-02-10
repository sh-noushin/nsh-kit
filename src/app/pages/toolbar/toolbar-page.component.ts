import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  NshToolbarComponent,
  NshToolbarStartDirective,
  NshToolbarCenterDirective,
  NshToolbarEndDirective,
  NshToolbarTitleDirective,
} from 'nsh-kit-ui';

@Component({
  selector: 'app-toolbar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshToolbarComponent,
    NshToolbarStartDirective,
    NshToolbarCenterDirective,
    NshToolbarEndDirective,
    NshToolbarTitleDirective,
  ],
  template: `
    <div class="toolbar-page">
      <h1 class="toolbar-page__title">Toolbar</h1>
      <p class="toolbar-page__subtitle">Toolbar v1: layout, density, and variants.</p>

      <section class="toolbar-page__card">
        <h2 class="toolbar-page__h2">1) Solid toolbar with title + actions</h2>
        <nsh-toolbar [variant]="'solid'" [elevation]="'sm'">
          <button type="button" class="toolbar-page__ghost">Menu</button>
          <span nshToolbarTitle>NSH Kit</span>
          <span class="toolbar-page__spacer"></span>
          <button type="button" class="toolbar-page__ghost">Login</button>
        </nsh-toolbar>
      </section>

      <section class="toolbar-page__card">
        <h2 class="toolbar-page__h2">2) Surface variant</h2>
        <nsh-toolbar [variant]="'surface'" [elevation]="'none'">
          <button type="button" class="toolbar-page__ghost">Back</button>
          <span nshToolbarTitle>Surface toolbar</span>
          <span class="toolbar-page__spacer"></span>
          <button type="button" class="toolbar-page__ghost">Save</button>
        </nsh-toolbar>
      </section>

      <section class="toolbar-page__card toolbar-page__card--tinted">
        <h2 class="toolbar-page__h2">3) Transparent on tinted background</h2>
        <nsh-toolbar [variant]="'transparent'" [elevation]="'none'">
          <button type="button" class="toolbar-page__ghost">Browse</button>
          <span nshToolbarTitle>Transparent</span>
          <span class="toolbar-page__spacer"></span>
          <button type="button" class="toolbar-page__ghost">Share</button>
        </nsh-toolbar>
      </section>

      <section class="toolbar-page__card">
        <h2 class="toolbar-page__h2">4) Compact density</h2>
        <nsh-toolbar [variant]="'surface'" [density]="'compact'" [elevation]="'sm'">
          <button type="button" class="toolbar-page__ghost">Compact</button>
          <span nshToolbarTitle>Dense layout</span>
          <span class="toolbar-page__spacer"></span>
          <button type="button" class="toolbar-page__ghost">Help</button>
        </nsh-toolbar>
      </section>

      <section class="toolbar-page__card">
        <h2 class="toolbar-page__h2">5) Sticky toolbar (scroll demo)</h2>
        <div class="toolbar-page__scroll">
          <nsh-toolbar [variant]="'surface'" [sticky]="true" [elevation]="'md'">
            <button type="button" class="toolbar-page__ghost">Filters</button>
            <span nshToolbarTitle>Sticky header</span>
            <span class="toolbar-page__spacer"></span>
            <button type="button" class="toolbar-page__ghost">Actions</button>
          </nsh-toolbar>
          <div class="toolbar-page__scroll-content">
            <p class="toolbar-page__content">Scroll area content line 1.</p>
            <p class="toolbar-page__content">Scroll area content line 2.</p>
            <p class="toolbar-page__content">Scroll area content line 3.</p>
            <p class="toolbar-page__content">Scroll area content line 4.</p>
            <p class="toolbar-page__content">Scroll area content line 5.</p>
            <p class="toolbar-page__content">Scroll area content line 6.</p>
          </div>
        </div>
      </section>

      <section class="toolbar-page__card">
        <h2 class="toolbar-page__h2">6) Start/center/end slots</h2>
        <nsh-toolbar [variant]="'surface'" [elevation]="'sm'">
          <button nshToolbarStart type="button" class="toolbar-page__ghost">Menu</button>
          <span nshToolbarCenter nshToolbarTitle>Centered title</span>
          <div nshToolbarEnd class="toolbar-page__actions">
            <button type="button" class="toolbar-page__ghost">Search</button>
            <button type="button" class="toolbar-page__ghost">Profile</button>
          </div>
        </nsh-toolbar>
      </section>
    </div>
  `,
  styles: [
    `
      .toolbar-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .toolbar-page__title {
        margin: 0;
      }

      .toolbar-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .toolbar-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-lg);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0, var(--nsh-color-surface));
        box-shadow: var(--nsh-elevation-1);
      }

      .toolbar-page__card--tinted {
        background: var(--nsh-color-surface-2);
      }

      .toolbar-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-md);
      }

      .toolbar-page__ghost {
        appearance: none;
        border: 0;
        background: var(--nsh-color-surface-1);
        color: inherit;
        padding: var(--nsh-space-xs) var(--nsh-space-sm);
        border-radius: var(--nsh-radius-pill);
        font-family: var(--nsh-font-family);
        font-size: var(--nsh-font-size-sm);
        cursor: pointer;
      }

      .toolbar-page__ghost:focus-visible {
        outline: none;
        box-shadow: 0 0 0 var(--nsh-space-xs) var(--nsh-color-outline);
      }

      .toolbar-page__spacer {
        flex: 1 1 auto;
      }

      .toolbar-page__actions {
        display: inline-flex;
        gap: var(--nsh-space-sm);
        align-items: center;
      }

      .toolbar-page__scroll {
        display: grid;
        gap: var(--nsh-space-md);
        max-height: calc(var(--nsh-space-xl) * 6);
        overflow: auto;
        padding: var(--nsh-space-md);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-1);
      }

      .toolbar-page__scroll-content {
        display: grid;
        gap: var(--nsh-space-sm);
      }

      .toolbar-page__content {
        margin: 0;
        color: var(--nsh-color-text);
      }
    `,
  ],
})
export class ToolbarPageComponent {}
