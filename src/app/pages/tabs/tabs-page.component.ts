import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshIconComponent, NshTabComponent, NshTabsComponent } from 'nsh-kit-ui';

@Component({
  selector: 'app-tabs-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshTabsComponent, NshTabComponent, NshIconComponent],
  template: `
    <div class="tabs-page">
      <h1 class="tabs-page__title">Tabs</h1>
      <p class="tabs-page__subtitle">Tabs v1: variants, a11y, and lazy panels.</p>

      <section class="tabs-page__card">
        <h2 class="tabs-page__h2">1) Basic underline</h2>
        <nsh-tabs [activeIndex]="basicActive()" (activeIndexChange)="basicActive.set($event)">
          <nsh-tab label="Overview">
            <p class="tabs-page__content">Overview content</p>
          </nsh-tab>
          <nsh-tab label="Details">
            <p class="tabs-page__content">Details content</p>
          </nsh-tab>
          <nsh-tab label="Updates">
            <p class="tabs-page__content">Updates content</p>
          </nsh-tab>
        </nsh-tabs>
      </section>

      <section class="tabs-page__card">
        <h2 class="tabs-page__h2">2) Pill variant</h2>
        <nsh-tabs
          [variant]="'pill'"
          [activeIndex]="pillActive()"
          (activeIndexChange)="pillActive.set($event)"
        >
          <nsh-tab label="Monthly">
            <p class="tabs-page__content">Monthly billing details.</p>
          </nsh-tab>
          <nsh-tab label="Annual">
            <p class="tabs-page__content">Annual billing details.</p>
          </nsh-tab>
        </nsh-tabs>
      </section>

      <section class="tabs-page__card">
        <h2 class="tabs-page__h2">3) Contained variant</h2>
        <nsh-tabs
          [variant]="'contained'"
          [activeIndex]="containedActive()"
          (activeIndexChange)="containedActive.set($event)"
        >
          <nsh-tab label="Inbox">
            <p class="tabs-page__content">Inbox content.</p>
          </nsh-tab>
          <nsh-tab label="Starred">
            <p class="tabs-page__content">Starred content.</p>
          </nsh-tab>
          <nsh-tab label="Archive">
            <p class="tabs-page__content">Archive content.</p>
          </nsh-tab>
        </nsh-tabs>
      </section>

      <section class="tabs-page__card">
        <h2 class="tabs-page__h2">4) Icons + custom label slot</h2>
        <nsh-tabs [activeIndex]="iconActive()" (activeIndexChange)="iconActive.set($event)">
          <nsh-tab label="Summary" icon="star">
            <p class="tabs-page__content">Summary content.</p>
          </nsh-tab>
          <nsh-tab>
            <ng-container nshTabLabel>
              <nsh-icon name="sparkles" size="var(--nsh-font-size-sm)"></nsh-icon>
              Featured
            </ng-container>
            <p class="tabs-page__content">Featured content.</p>
          </nsh-tab>
          <nsh-tab label="Archive" icon="archive">
            <p class="tabs-page__content">Archive content.</p>
          </nsh-tab>
        </nsh-tabs>
      </section>

      <section class="tabs-page__card">
        <h2 class="tabs-page__h2">5) Disabled tab</h2>
        <nsh-tabs [activeIndex]="disabledActive()" (activeIndexChange)="disabledActive.set($event)">
          <nsh-tab label="Primary">
            <p class="tabs-page__content">Primary tab content.</p>
          </nsh-tab>
          <nsh-tab label="Locked" [disabled]="true">
            <p class="tabs-page__content">Locked tab content.</p>
          </nsh-tab>
          <nsh-tab label="Secondary">
            <p class="tabs-page__content">Secondary tab content.</p>
          </nsh-tab>
        </nsh-tabs>
      </section>

      <section class="tabs-page__card">
        <h2 class="tabs-page__h2">6) Stretch tabs</h2>
        <nsh-tabs
          [stretch]="true"
          [activeIndex]="stretchActive()"
          (activeIndexChange)="stretchActive.set($event)"
        >
          <nsh-tab label="First">
            <p class="tabs-page__content">First tab content.</p>
          </nsh-tab>
          <nsh-tab label="Second">
            <p class="tabs-page__content">Second tab content.</p>
          </nsh-tab>
          <nsh-tab label="Third">
            <p class="tabs-page__content">Third tab content.</p>
          </nsh-tab>
        </nsh-tabs>
      </section>
    </div>
  `,
  styles: [
    `
      .tabs-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .tabs-page__title {
        margin: 0;
      }

      .tabs-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .tabs-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-lg);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0, var(--nsh-color-surface));
        box-shadow: var(--nsh-elevation-1);
      }

      .tabs-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-md);
      }

      .tabs-page__content {
        margin: 0;
        color: var(--nsh-color-text);
      }
    `,
  ],
})
export class TabsPageComponent {
  protected readonly basicActive = signal(0);
  protected readonly pillActive = signal(0);
  protected readonly containedActive = signal(0);
  protected readonly iconActive = signal(0);
  protected readonly disabledActive = signal(0);
  protected readonly stretchActive = signal(0);
}
