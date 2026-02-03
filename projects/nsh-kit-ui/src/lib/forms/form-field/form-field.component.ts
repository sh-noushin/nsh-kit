import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { NSH_FORM_FIELD_CONTEXT, type NshFormFieldControlContext } from './form-field.context';

let nextFormFieldId = 0;

@Component({
  selector: 'nsh-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NSH_FORM_FIELD_CONTEXT,
      useExisting: forwardRef(() => NshFormFieldComponent),
    },
  ],
  host: {
    '[class.nsh-ff-host]': 'true',
    '[class.nsh-ff-host--disabled]': 'disabled()',
    '[class.nsh-ff-host--required]': 'required()',
  },
  template: `
    <div class="nsh-ff" [attr.aria-label]="ariaLabel() ?? null">
      @if (label(); as text) {
        <label class="nsh-ff__label" [id]="labelId()" [attr.for]="controlId()">
          {{ text }}
        </label>
      }

      <div class="nsh-ff__box">
        <span class="nsh-ff__prefix"><ng-content select="[nshPrefix]" /></span>

        <span class="nsh-ff__control">
          <ng-content />
        </span>

        <span class="nsh-ff__suffix"><ng-content select="[nshSuffix]" /></span>
      </div>

      <div class="nsh-ff__messages">
        <div
          #errorSlot
          class="nsh-ff__message nsh-ff__error"
          [id]="errorId()"
          [attr.hidden]="shouldShowError() ? null : ''"
          aria-live="polite"
        >
          <ng-content select="[nshError]" />
          @if (error(); as errText) {
            <span class="nsh-ff__message-text">{{ errText }}</span>
          }
        </div>

        <div
          #hintSlot
          class="nsh-ff__message nsh-ff__hint"
          [id]="hintId()"
          [attr.hidden]="shouldShowHint() ? null : ''"
        >
          <ng-content select="[nshHint]" />
          @if (hint(); as hintText) {
            <span class="nsh-ff__message-text">{{ hintText }}</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-ff-gap: var(--nsh-ff-gap, unset);
      --nsh-ff-padding: var(--nsh-ff-padding, unset);
      --nsh-ff-radius: var(--nsh-ff-radius, unset);
      --nsh-ff-border-color: var(--nsh-ff-border-color, unset);
      --nsh-ff-border-color-focus: var(--nsh-ff-border-color-focus, unset);
      --nsh-ff-label-color: var(--nsh-ff-label-color, unset);
      --nsh-ff-hint-color: var(--nsh-ff-hint-color, unset);
      --nsh-ff-error-color: var(--nsh-ff-error-color, unset);
      --nsh-ff-bg: var(--nsh-ff-bg, unset);

      --_ff-gap: var(--nsh-ff-gap, var(--nsh-space-xs));
      --_ff-padding: var(--nsh-ff-padding, var(--nsh-density-padding-inline));
      --_ff-radius: var(--nsh-ff-radius, var(--nsh-radius-md));

      --_ff-bg: var(--nsh-ff-bg, var(--nsh-color-surface));
      --_ff-border: var(--nsh-ff-border-color, var(--nsh-color-outline));
      --_ff-border-focus: var(--nsh-ff-border-color-focus, var(--nsh-color-primary));

      --_ff-label: var(--nsh-ff-label-color, var(--nsh-color-text));
      --_ff-hint: var(--nsh-ff-hint-color, var(--nsh-color-text-muted));
      --_ff-error: var(--nsh-ff-error-color, var(--nsh-color-danger));

      --_ff-border-width: var(--nsh-ff-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    .nsh-ff {
      display: grid;
      gap: var(--_ff-gap);
      font-family: var(--nsh-font-family);
    }

    .nsh-ff__label {
      color: var(--_ff-label);
      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-ff__box {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: var(--_ff-gap);
      padding-inline: var(--_ff-padding);
      min-height: var(--nsh-density-control-height);

      border-radius: var(--_ff-radius);
      border: var(--_ff-border-width) solid var(--_ff-border);
      background: var(--_ff-bg);

      transition: border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    :host(:focus-within) .nsh-ff__box {
      border-color: var(--_ff-border-focus);
    }

    :host(.nsh-ff-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .nsh-ff__prefix:empty,
    .nsh-ff__suffix:empty {
      display: none;
    }

    .nsh-ff__control {
      min-width: 0;
      display: inline-flex;
    }

    .nsh-ff__messages {
      display: grid;
      gap: var(--_ff-gap);
    }

    .nsh-ff__message {
      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-ff__hint {
      color: var(--_ff-hint);
    }

    .nsh-ff__error {
      color: var(--_ff-error);
    }
  `,
})
export class NshFormFieldComponent implements NshFormFieldControlContext {
  private readonly id = nextFormFieldId++;

  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  private readonly hintSlot = viewChild<ElementRef<HTMLElement>>('hintSlot');
  private readonly errorSlot = viewChild<ElementRef<HTMLElement>>('errorSlot');

  private readonly hasProjectedHint = signal(false);
  private readonly hasProjectedError = signal(false);

  readonly controlId = computed(() => `nsh-ff-${this.id}-control`);
  readonly labelId = computed(() => `nsh-ff-${this.id}-label`);
  readonly hintId = computed(() => `nsh-ff-${this.id}-hint`);
  readonly errorId = computed(() => `nsh-ff-${this.id}-error`);

  readonly shouldShowHint = computed(() => {
    const hintText = this.hint();
    return (hintText !== null && hintText.trim().length > 0) || this.hasProjectedHint();
  });

  readonly shouldShowError = computed(() => {
    const errorText = this.error();
    return (errorText !== null && errorText.trim().length > 0) || this.hasProjectedError();
  });

  readonly describedByIds = computed(() => {
    const ids: string[] = [];

    if (this.shouldShowError()) {
      ids.push(this.errorId());
    }
    if (this.shouldShowHint()) {
      ids.push(this.hintId());
    }

    return ids.length > 0 ? ids.join(' ') : null;
  });

  constructor() {
    afterNextRender(() => {
      const hintHost = this.hintSlot()?.nativeElement;
      const errorHost = this.errorSlot()?.nativeElement;

      this.hasProjectedHint.set(!!hintHost?.querySelector('[nshHint]'));
      this.hasProjectedError.set(!!errorHost?.querySelector('[nshError]'));
    });
  }
}
