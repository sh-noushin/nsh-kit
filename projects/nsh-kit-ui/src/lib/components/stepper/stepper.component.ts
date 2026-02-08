import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChildren,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { NshIconComponent } from '../../foundations/icon';
import { NshStepComponent } from './step.component';

export type NshStepperOrientation = 'horizontal' | 'vertical';

function clampIndex(index: number, length: number): number {
  if (!Number.isFinite(index)) {
    return 0;
  }
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(Math.floor(index), 0), length - 1);
}

function findFirstEnabled(steps: readonly NshStepComponent[], disabled: boolean): number {
  if (disabled) {
    return -1;
  }
  return steps.findIndex((step) => !step.disabled());
}

function findLastEnabled(steps: readonly NshStepComponent[], disabled: boolean): number {
  if (disabled) {
    return -1;
  }
  for (let idx = steps.length - 1; idx >= 0; idx--) {
    if (!steps[idx]?.disabled()) {
      return idx;
    }
  }
  return -1;
}

function findNextEnabled(
  steps: readonly NshStepComponent[],
  from: number,
  delta: 1 | -1,
  disabled: boolean
): number {
  if (steps.length === 0 || disabled) {
    return -1;
  }

  for (let step = 1; step <= steps.length; step++) {
    const idx = (from + delta * step + steps.length) % steps.length;
    if (!steps[idx]?.disabled()) {
      return idx;
    }
  }

  return -1;
}

function arePreviousStepsCompleted(steps: readonly NshStepComponent[], index: number): boolean {
  for (let idx = 0; idx < index; idx++) {
    if (!steps[idx]?.completed()) {
      return false;
    }
  }
  return true;
}

@Component({
  selector: 'nsh-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NshIconComponent],
  host: {
    '[class.nsh-stepper-host]': 'true',
    '[class.nsh-stepper-host--horizontal]': "orientation() === 'horizontal'",
    '[class.nsh-stepper-host--vertical]': "orientation() === 'vertical'",
    '[class.nsh-stepper-host--disabled]': 'disabled()',
  },
  template: `
    <div class="nsh-stepper">
      <div
        class="nsh-stepper__headers"
        role="tablist"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-orientation]="orientation()"
        (keydown)="onKeydown($event)"
      >
        @for (step of steps(); track step; let i = $index) {
          <div class="nsh-stepper__header-item">
            <button
              #headerButton
              type="button"
              class="nsh-stepper__header"
              role="tab"
              [id]="headerId(step)"
              [disabled]="isStepDisabled(step)"
              [attr.aria-controls]="panelId(step)"
              [attr.aria-selected]="activeIndexResolved() === i ? 'true' : 'false'"
              [attr.aria-disabled]="isStepDisabled(step) ? 'true' : null"
              [attr.tabindex]="tabIndexFor(i)"
              [class.nsh-stepper__header--active]="activeIndexResolved() === i"
              [class.nsh-stepper__header--disabled]="isStepDisabled(step)"
              (focus)="onHeaderFocus(i)"
              (click)="onHeaderClick(i)"
            >
              <span class="nsh-stepper__indicator" aria-hidden="true">
                @if (step.error()) {
                  <nsh-icon
                    class="nsh-stepper__status-icon"
                    name="alert-triangle"
                    [size]="statusIconSize()"
                    ariaLabel="Error"
                  />
                } @else if (step.completed()) {
                  <nsh-icon
                    class="nsh-stepper__status-icon"
                    name="check"
                    [size]="statusIconSize()"
                    ariaLabel="Completed"
                  />
                } @else if (showStepNumbers()) {
                  <span class="nsh-stepper__number">{{ i + 1 }}</span>
                } @else if (step.icon(); as iconName) {
                  <nsh-icon
                    class="nsh-stepper__icon"
                    [name]="iconName"
                    [size]="statusIconSize()"
                  />
                }
              </span>

              <span class="nsh-stepper__text">
                <span class="nsh-stepper__label">
                  @if (step.labelTemplate?.templateRef) {
                    <ng-container [ngTemplateOutlet]="step.labelTemplate?.templateRef" />
                  } @else {
                    {{ step.label() }}
                  }
                </span>
                @if (step.description(); as desc) {
                  <span class="nsh-stepper__description">{{ desc }}</span>
                }
                @if (step.optional()) {
                  <span class="nsh-stepper__optional">Optional</span>
                }
              </span>

              <span class="nsh-stepper__status" aria-hidden="true">
                @if (!step.error() && !step.completed() && step.icon(); as iconName) {
                  <nsh-icon
                    class="nsh-stepper__icon"
                    [name]="iconName"
                    [size]="statusIconSize()"
                  />
                }
              </span>
            </button>

            @if (i < steps().length - 1) {
              <span class="nsh-stepper__connector" aria-hidden="true"></span>
            }
          </div>
        }
      </div>

      <div class="nsh-stepper__content">
        @if (activeStep(); as step) {
          <div
            class="nsh-stepper__panel"
            role="tabpanel"
            [id]="panelId(step)"
            [attr.aria-labelledby]="headerId(step)"
          >
            <ng-container [ngTemplateOutlet]="step.contentTpl"></ng-container>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-stepper-gap: var(--nsh-stepper-gap, unset);
      --nsh-stepper-header-height: var(--nsh-stepper-header-height, unset);
      --nsh-stepper-header-radius: var(--nsh-stepper-header-radius, unset);
      --nsh-stepper-header-bg: var(--nsh-stepper-header-bg, unset);
      --nsh-stepper-header-bg-active: var(--nsh-stepper-header-bg-active, unset);
      --nsh-stepper-header-fg: var(--nsh-stepper-header-fg, unset);
      --nsh-stepper-header-fg-muted: var(--nsh-stepper-header-fg-muted, unset);
      --nsh-stepper-indicator-size: var(--nsh-stepper-indicator-size, unset);
      --nsh-stepper-indicator-bg: var(--nsh-stepper-indicator-bg, unset);
      --nsh-stepper-indicator-bg-active: var(--nsh-stepper-indicator-bg-active, unset);
      --nsh-stepper-indicator-fg: var(--nsh-stepper-indicator-fg, unset);
      --nsh-stepper-connector-color: var(--nsh-stepper-connector-color, unset);
      --nsh-stepper-focus-ring: var(--nsh-stepper-focus-ring, unset);

      --_stepper-gap: var(--nsh-stepper-gap, var(--nsh-space-lg));
      --_stepper-header-height: var(--nsh-stepper-header-height, var(--nsh-density-control-height));
      --_stepper-header-radius: var(--nsh-stepper-header-radius, var(--nsh-radius-md));
      --_stepper-header-bg: var(--nsh-stepper-header-bg, var(--nsh-color-surface-1));
      --_stepper-header-bg-active: var(
        --nsh-stepper-header-bg-active,
        var(--nsh-color-surface-2)
      );
      --_stepper-header-fg: var(--nsh-stepper-header-fg, var(--nsh-color-text));
      --_stepper-header-fg-muted: var(
        --nsh-stepper-header-fg-muted,
        var(--nsh-color-text-muted)
      );
      --_stepper-indicator-size: var(--nsh-stepper-indicator-size, var(--nsh-space-xl));
      --_stepper-indicator-bg: var(
        --nsh-stepper-indicator-bg,
        color-mix(in srgb, var(--nsh-color-surface-1) 55%, transparent)
      );
      --_stepper-indicator-bg-active: var(
        --nsh-stepper-indicator-bg-active,
        var(--nsh-color-primary)
      );
      --_stepper-indicator-fg: var(--nsh-stepper-indicator-fg, var(--nsh-color-text));
      --_stepper-connector-color: var(--nsh-stepper-connector-color, var(--nsh-color-border));
      --_stepper-focus-ring: var(
        --nsh-stepper-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 65%, transparent)
      );

      --_stepper-text-size: var(--nsh-font-size-sm);
      --_stepper-label-weight: var(--nsh-font-weight-medium);
      --_stepper-description-size: var(--nsh-font-size-xs);
      --_stepper-optional-size: var(--nsh-font-size-xs);
      --_stepper-duration: var(--nsh-motion-duration-fast);
      --_stepper-easing: var(--nsh-motion-easing-standard);
    }

    .nsh-stepper {
      display: grid;
      gap: var(--_stepper-gap);
      font-family: var(--nsh-font-family);
    }

    .nsh-stepper__headers {
      display: flex;
      flex-wrap: wrap;
      gap: var(--_stepper-gap);
    }

    :host(.nsh-stepper-host--vertical) .nsh-stepper__headers {
      flex-direction: column;
      align-items: stretch;
    }

    .nsh-stepper__header-item {
      display: inline-flex;
      align-items: center;
      gap: var(--_stepper-gap);
      min-width: 0;
    }

    :host(.nsh-stepper-host--vertical) .nsh-stepper__header-item {
      align-items: stretch;
    }

    .nsh-stepper__header {
      appearance: none;
      border: 0;
      background: var(--_stepper-header-bg);
      color: var(--_stepper-header-fg);
      border-radius: var(--_stepper-header-radius);
      min-height: var(--_stepper-header-height);
      padding: var(--nsh-density-padding-block) var(--nsh-density-padding-inline);

      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-sm);
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition:
        background var(--_stepper-duration) var(--_stepper-easing),
        box-shadow var(--_stepper-duration) var(--_stepper-easing);
    }

    .nsh-stepper__header:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--nsh-space-xs) var(--_stepper-focus-ring);
    }

    .nsh-stepper__header--active {
      background: var(--_stepper-header-bg-active);
    }

    .nsh-stepper__header--disabled {
      cursor: default;
      opacity: 0.6;
    }

    .nsh-stepper__indicator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--_stepper-indicator-size);
      height: var(--_stepper-indicator-size);
      border-radius: var(--nsh-radius-pill);
      background: var(--_stepper-indicator-bg);
      color: var(--_stepper-indicator-fg);
      flex: 0 0 auto;
    }

    .nsh-stepper__header--active .nsh-stepper__indicator {
      background: var(--_stepper-indicator-bg-active);
      color: var(--nsh-color-surface);
    }

    .nsh-stepper__number {
      font-size: var(--_stepper-text-size);
      font-weight: var(--_stepper-label-weight);
    }

    .nsh-stepper__text {
      display: grid;
      gap: var(--nsh-space-xs);
      min-width: 0;
    }

    .nsh-stepper__label {
      font-size: var(--_stepper-text-size);
      font-weight: var(--_stepper-label-weight);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-stepper__description {
      font-size: var(--_stepper-description-size);
      color: var(--_stepper-header-fg-muted);
      line-height: var(--nsh-line-height-normal);
    }

    .nsh-stepper__optional {
      font-size: var(--_stepper-optional-size);
      color: var(--_stepper-header-fg-muted);
      line-height: var(--nsh-line-height-normal);
    }

    .nsh-stepper__status {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
    }

    .nsh-stepper__status-icon,
    .nsh-stepper__icon {
      color: currentColor;
    }

    .nsh-stepper__connector {
      flex: 1 1 auto;
      height: var(--nsh-space-xs);
      background: var(--_stepper-connector-color);
      border-radius: var(--nsh-radius-pill);
    }

    :host(.nsh-stepper-host--vertical) .nsh-stepper__connector {
      width: var(--nsh-space-xs);
      height: calc(var(--_stepper-header-height));
      align-self: center;
    }

    .nsh-stepper__content {
      min-width: 0;
    }

    .nsh-stepper__panel {
      min-width: 0;
    }
  `,
})
export class NshStepperComponent {
  @ViewChildren('headerButton', { read: ElementRef })
  private readonly headerButtons?: { toArray(): Array<ElementRef<HTMLButtonElement>> };

  readonly activeIndex = input(0);
  readonly linear = input(false, { transform: booleanAttribute });
  readonly orientation = input<NshStepperOrientation>('horizontal');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly showStepNumbers = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>('Stepper');

  readonly activeIndexChange = output<number>();
  readonly stepSelectionChange = output<{ previousIndex: number; currentIndex: number }>();

  private readonly stepsQuery = contentChildren(NshStepComponent);

  readonly steps = computed(() => this.stepsQuery());

  readonly activeIndexResolved = computed(() => {
    const steps = this.steps();
    if (steps.length === 0) {
      return -1;
    }

    const desired = clampIndex(this.activeIndex(), steps.length);
    if (!this.isStepDisabled(steps[desired])) {
      return desired;
    }

    return findFirstEnabled(steps, this.disabled());
  });

  readonly activeStep = computed(() => {
    const steps = this.steps();
    const idx = this.activeIndexResolved();
    return idx >= 0 ? (steps[idx] ?? null) : null;
  });

  private readonly focusedIndex = signal(0);

  constructor() {
    effect(() => {
      const steps = this.steps();
      const active = this.activeIndexResolved();

      if (steps.length === 0) {
        this.focusedIndex.set(0);
        return;
      }

      const current = this.focusedIndex();
      const clamped = clampIndex(current, steps.length);
      const next = !this.isStepDisabled(steps[clamped]) ? clamped : active;

      if (next >= 0) {
        this.focusedIndex.set(next);
      }
    });
  }

  next(): void {
    const steps = this.steps();
    const current = this.activeIndexResolved();
    if (steps.length === 0 || current < 0) {
      return;
    }

    const nextIndex = findNextEnabled(steps, current, 1, this.disabled());
    this.attemptActivate(nextIndex);
  }

  previous(): void {
    const steps = this.steps();
    const current = this.activeIndexResolved();
    if (steps.length === 0 || current < 0) {
      return;
    }

    const prevIndex = findNextEnabled(steps, current, -1, this.disabled());
    this.attemptActivate(prevIndex);
  }

  statusIconSize(): string {
    return 'var(--nsh-font-size-sm)';
  }

  headerId(step: NshStepComponent): string {
    return `${step.resolvedId()}-header`;
  }

  panelId(step: NshStepComponent): string {
    return `${step.resolvedId()}-panel`;
  }

  tabIndexFor(index: number): string {
    const steps = this.steps();
    if (this.isStepDisabled(steps[index])) {
      return '-1';
    }

    return this.focusedIndex() === index ? '0' : '-1';
  }

  isStepDisabled(step: NshStepComponent | undefined): boolean {
    if (!step) {
      return true;
    }
    return this.disabled() || step.disabled();
  }

  onHeaderFocus(index: number) {
    const steps = this.steps();
    if (this.isStepDisabled(steps[index])) {
      return;
    }
    this.focusedIndex.set(index);
  }

  onHeaderClick(index: number) {
    this.attemptActivate(index);
  }

  onKeydown(event: KeyboardEvent) {
    const steps = this.steps();
    if (steps.length === 0) {
      return;
    }

    const current = this.focusedIndex();

    const moveFocus = (next: number) => {
      if (next < 0) {
        return;
      }
      this.focusedIndex.set(next);
      this.focusButton(next);
      event.preventDefault();
    };

    const isHorizontal = this.orientation() === 'horizontal';

    switch (event.key) {
      case 'ArrowRight': {
        if (!isHorizontal) {
          break;
        }
        const next = findNextEnabled(steps, current, 1, this.disabled());
        moveFocus(next);
        break;
      }
      case 'ArrowLeft': {
        if (!isHorizontal) {
          break;
        }
        const prev = findNextEnabled(steps, current, -1, this.disabled());
        moveFocus(prev);
        break;
      }
      case 'ArrowDown': {
        if (isHorizontal) {
          break;
        }
        const next = findNextEnabled(steps, current, 1, this.disabled());
        moveFocus(next);
        break;
      }
      case 'ArrowUp': {
        if (isHorizontal) {
          break;
        }
        const prev = findNextEnabled(steps, current, -1, this.disabled());
        moveFocus(prev);
        break;
      }
      case 'Home': {
        moveFocus(findFirstEnabled(steps, this.disabled()));
        break;
      }
      case 'End': {
        moveFocus(findLastEnabled(steps, this.disabled()));
        break;
      }
      case 'Enter':
      case ' ': {
        const step = steps[current];
        if (step && !this.isStepDisabled(step)) {
          this.attemptActivate(current);
          event.preventDefault();
        }
        break;
      }
      default:
        break;
    }
  }

  private attemptActivate(index: number) {
    const steps = this.steps();
    if (index < 0 || index >= steps.length) {
      return;
    }

    const step = steps[index];
    if (this.isStepDisabled(step)) {
      return;
    }

    const current = this.activeIndexResolved();
    if (!this.canActivateStep(index, current)) {
      return;
    }

    if (index === current) {
      this.focusedIndex.set(index);
      return;
    }

    this.focusedIndex.set(index);
    this.activeIndexChange.emit(index);
    this.stepSelectionChange.emit({ previousIndex: current, currentIndex: index });
  }

  private canActivateStep(targetIndex: number, currentIndex: number): boolean {
    if (!this.linear()) {
      return true;
    }

    if (targetIndex === currentIndex) {
      return true;
    }

    const steps = this.steps();
    const targetStep = steps[targetIndex];

    if (targetIndex < currentIndex) {
      return targetStep ? targetStep.editable() : false;
    }

    return arePreviousStepsCompleted(steps, targetIndex);
  }

  private focusButton(index: number) {
    const refs = this.headerButtons?.toArray?.() ?? [];
    const button = refs[index]?.nativeElement;
    if (!button) {
      return;
    }
    button.focus();
  }
}
