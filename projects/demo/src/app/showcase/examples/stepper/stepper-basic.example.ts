import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshButtonComponent, NshStepComponent, NshStepperComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-stepper-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshStepComponent, NshStepperComponent],
  template: `
    <div class="example-stack">
      <nsh-stepper [activeIndex]="activeIndex()" (activeIndexChange)="activeIndex.set($event)">
        <nsh-step label="Account">
          <div class="example-step">Confirm account details.</div>
        </nsh-step>
        <nsh-step label="Profile">
          <div class="example-step">Add profile information.</div>
        </nsh-step>
        <nsh-step label="Review">
          <div class="example-step">Verify and submit.</div>
        </nsh-step>
      </nsh-stepper>

      <div class="example-row">
        <nsh-button variant="text" size="sm" (click)="prev()">Back</nsh-button>
        <nsh-button variant="filled" size="sm" (click)="next()">Next</nsh-button>
      </div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-md);
      }

      .example-row {
        display: flex;
        gap: var(--nsh-space-sm);
      }

      .example-step {
        color: var(--nsh-color-text-muted);
      }
    `,
  ],
})
export class StepperBasicExampleComponent {
  readonly activeIndex = signal(0);

  next(): void {
    this.activeIndex.set(Math.min(this.activeIndex() + 1, 2));
  }

  prev(): void {
    this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
  }
}

export const stepperBasicHtml = `<nsh-stepper [activeIndex]="activeIndex" (activeIndexChange)="activeIndex = $event">
  <nsh-step label="Account">Confirm account details.</nsh-step>
  <nsh-step label="Profile">Add profile information.</nsh-step>
  <nsh-step label="Review">Verify and submit.</nsh-step>
</nsh-stepper>`;

export const stepperBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshStepComponent, NshStepperComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-stepper-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshStepComponent, NshStepperComponent],
  templateUrl: './stepper-basic.example.html'
})
export class StepperBasicExampleComponent {
  activeIndex = 0;
}`;
