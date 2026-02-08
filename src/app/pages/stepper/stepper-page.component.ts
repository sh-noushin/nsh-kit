import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshStepComponent, NshStepLabelDefDirective, NshStepperComponent } from 'nsh-kit-ui';

@Component({
  selector: 'app-stepper-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshStepperComponent, NshStepComponent, NshStepLabelDefDirective],
  template: `
    <div class="stepper-page">
      <h1 class="stepper-page__title">Stepper</h1>
      <p class="stepper-page__subtitle">Stepper v1: headers, linear flow, and status.</p>

      <section class="stepper-page__card">
        <h2 class="stepper-page__h2">1) Basic horizontal</h2>
        <nsh-stepper
          [activeIndex]="basicActive()"
          (activeIndexChange)="basicActive.set($event)"
        >
          <nsh-step label="Account">
            <p class="stepper-page__content">Account content</p>
          </nsh-step>
          <nsh-step label="Profile">
            <p class="stepper-page__content">Profile content</p>
          </nsh-step>
          <nsh-step label="Done">
            <p class="stepper-page__content">Done content</p>
          </nsh-step>
        </nsh-stepper>
        <div class="stepper-page__hint">Active step: {{ basicActive() + 1 }}</div>
      </section>

      <section class="stepper-page__card">
        <h2 class="stepper-page__h2">2) Vertical stepper</h2>
        <nsh-stepper
          orientation="vertical"
          [activeIndex]="verticalActive()"
          (activeIndexChange)="verticalActive.set($event)"
        >
          <nsh-step label="Start">
            <p class="stepper-page__content">Vertical content A</p>
          </nsh-step>
          <nsh-step label="Middle">
            <p class="stepper-page__content">Vertical content B</p>
          </nsh-step>
          <nsh-step label="Finish">
            <p class="stepper-page__content">Vertical content C</p>
          </nsh-step>
        </nsh-stepper>
      </section>

      <section class="stepper-page__card">
        <h2 class="stepper-page__h2">3) Linear with completion toggles</h2>
        <nsh-stepper
          [linear]="true"
          [activeIndex]="linearActive()"
          (activeIndexChange)="linearActive.set($event)"
        >
          <nsh-step label="Verify" [completed]="linearCompleteOne()">
            <p class="stepper-page__content">Complete step one to unlock the next step.</p>
          </nsh-step>
          <nsh-step label="Details" [completed]="linearCompleteTwo()">
            <p class="stepper-page__content">Step two completion required for the final step.</p>
          </nsh-step>
          <nsh-step label="Confirm">
            <p class="stepper-page__content">Final confirmation step.</p>
          </nsh-step>
        </nsh-stepper>
        <div class="stepper-page__controls">
          <button type="button" class="stepper-page__toggle" (click)="toggleLinearOne()">
            Toggle step 1 completed
          </button>
          <button type="button" class="stepper-page__toggle" (click)="toggleLinearTwo()">
            Toggle step 2 completed
          </button>
        </div>
      </section>

      <section class="stepper-page__card">
        <h2 class="stepper-page__h2">4) Optional + description</h2>
        <nsh-stepper
          [activeIndex]="optionalActive()"
          (activeIndexChange)="optionalActive.set($event)"
        >
          <nsh-step label="Basics" description="Share the essentials" [optional]="true">
            <p class="stepper-page__content">Optional information here.</p>
          </nsh-step>
          <nsh-step label="Preferences" description="Choose the settings you like">
            <ng-template nshStepLabel>
              <span class="stepper-page__label-override">Preferences (custom)</span>
            </ng-template>
            <p class="stepper-page__content">Preference details.</p>
          </nsh-step>
          <nsh-step label="Review" description="Double-check the summary">
            <p class="stepper-page__content">Review and submit.</p>
          </nsh-step>
        </nsh-stepper>
      </section>

      <section class="stepper-page__card">
        <h2 class="stepper-page__h2">5) Disabled step</h2>
        <nsh-stepper
          [activeIndex]="disabledActive()"
          (activeIndexChange)="disabledActive.set($event)"
        >
          <nsh-step label="Open">
            <p class="stepper-page__content">Open step content.</p>
          </nsh-step>
          <nsh-step label="Locked" [disabled]="true">
            <p class="stepper-page__content">This step is disabled.</p>
          </nsh-step>
          <nsh-step label="Resume">
            <p class="stepper-page__content">Resume content.</p>
          </nsh-step>
        </nsh-stepper>
      </section>

      <section class="stepper-page__card">
        <h2 class="stepper-page__h2">6) Error state</h2>
        <nsh-stepper
          [activeIndex]="errorActive()"
          (activeIndexChange)="errorActive.set($event)"
        >
          <nsh-step label="Input">
            <p class="stepper-page__content">Collect data.</p>
          </nsh-step>
          <nsh-step label="Validate" [error]="true">
            <p class="stepper-page__content">Validation failed for this step.</p>
          </nsh-step>
          <nsh-step label="Submit">
            <p class="stepper-page__content">Submit after validation.</p>
          </nsh-step>
        </nsh-stepper>
      </section>
    </div>
  `,
  styles: [
    `
      .stepper-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .stepper-page__title {
        margin: 0;
      }

      .stepper-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .stepper-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-lg);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0, var(--nsh-color-surface));
        box-shadow: var(--nsh-elevation-1);
      }

      .stepper-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-md);
      }

      .stepper-page__content {
        margin: 0;
        color: var(--nsh-color-text);
      }

      .stepper-page__hint {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }

      .stepper-page__controls {
        display: flex;
        flex-wrap: wrap;
        gap: var(--nsh-space-sm);
      }

      .stepper-page__toggle {
        appearance: none;
        border: 0;
        border-radius: var(--nsh-radius-pill);
        padding: var(--nsh-space-sm) var(--nsh-space-md);
        background: var(--nsh-color-surface-2);
        color: var(--nsh-color-text);
        font-family: var(--nsh-font-family);
        font-size: var(--nsh-font-size-sm);
        cursor: pointer;
      }

      .stepper-page__toggle:focus-visible {
        outline: none;
        box-shadow: 0 0 0 var(--nsh-space-xs) var(--nsh-color-outline);
      }

      .stepper-page__label-override {
        font-weight: var(--nsh-font-weight-semibold);
      }
    `,
  ],
})
export class StepperPageComponent {
  protected readonly basicActive = signal(0);
  protected readonly verticalActive = signal(0);
  protected readonly linearActive = signal(0);
  protected readonly optionalActive = signal(0);
  protected readonly disabledActive = signal(0);
  protected readonly errorActive = signal(0);

  protected readonly linearCompleteOne = signal(false);
  protected readonly linearCompleteTwo = signal(false);

  toggleLinearOne() {
    this.linearCompleteOne.set(!this.linearCompleteOne());
  }

  toggleLinearTwo() {
    this.linearCompleteTwo.set(!this.linearCompleteTwo());
  }
}
