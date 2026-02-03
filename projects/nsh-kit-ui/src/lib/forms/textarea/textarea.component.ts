import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  booleanAttribute,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import { NshCvaControl } from '../cva/nsh-cva-control';
import {
  NSH_FORM_FIELD_CONTEXT,
  type NshFormFieldControlContext,
} from '../form-field/form-field.context';

export type NshTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

let nextTextareaId = 0;

function clampInt(value: number, min: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.floor(value));
}

function normalizeOptionalPositiveInt(value: number | null): number | null {
  if (value === null) {
    return null;
  }
  if (!Number.isFinite(value)) {
    return null;
  }
  const v = Math.floor(value);
  return v > 0 ? v : null;
}

@Component({
  selector: 'nsh-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshTextareaComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-textarea-host]': 'true',
    '[class.nsh-textarea-host--disabled]': 'effectiveDisabled()',
    '[style.--nsh-textarea-resize]': 'resize()',
  },
  template: `
    <textarea
      nshFocusVisible
      class="nsh-textarea"
      [id]="effectiveId()"
      [name]="name() ?? null"
      [attr.autocomplete]="autocomplete() ?? null"
      [attr.placeholder]="placeholder() ?? null"
      [attr.rows]="safeRows()"
      [attr.cols]="safeCols()"
      [readonly]="readonly()"
      [disabled]="effectiveDisabled()"
      [required]="effectiveRequired()"
      [attr.minlength]="safeMinLength()"
      [attr.maxlength]="safeMaxLength()"
      [attr.aria-describedby]="effectiveDescribedBy()"
      [attr.aria-label]="effectiveAriaLabel()"
      [value]="stringValue()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    ></textarea>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 100%;

      /* Component override surface */
      --nsh-textarea-min-height: var(--nsh-textarea-min-height, unset);
      --nsh-textarea-padding-x: var(--nsh-textarea-padding-x, unset);
      --nsh-textarea-padding-y: var(--nsh-textarea-padding-y, unset);
      --nsh-textarea-radius: var(--nsh-textarea-radius, unset);
      --nsh-textarea-bg: var(--nsh-textarea-bg, unset);
      --nsh-textarea-fg: var(--nsh-textarea-fg, unset);
      --nsh-textarea-placeholder-color: var(--nsh-textarea-placeholder-color, unset);
      --nsh-textarea-border-color: var(--nsh-textarea-border-color, unset);
      --nsh-textarea-border-color-focus: var(--nsh-textarea-border-color-focus, unset);
      --nsh-textarea-focus-ring: var(--nsh-textarea-focus-ring, unset);
      --nsh-textarea-resize: var(--nsh-textarea-resize, unset);

      --_ta-min-height: var(--nsh-textarea-min-height, var(--nsh-density-control-height));
      --_ta-pad-x: var(--nsh-textarea-padding-x, var(--nsh-density-padding-inline));
      --_ta-pad-y: var(--nsh-textarea-padding-y, var(--nsh-space-sm));
      --_ta-radius: var(--nsh-textarea-radius, var(--nsh-radius-md));

      --_ta-bg: var(--nsh-textarea-bg, var(--nsh-color-surface));
      --_ta-fg: var(--nsh-textarea-fg, var(--nsh-color-text));
      --_ta-placeholder: var(
        --nsh-textarea-placeholder-color,
        var(--nsh-color-text-muted)
      );

      --_ta-border: var(--nsh-textarea-border-color, var(--nsh-color-outline));
      --_ta-border-focus: var(
        --nsh-textarea-border-color-focus,
        var(--nsh-color-primary)
      );

      --_ta-focus-ring: var(
        --nsh-textarea-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_ta-border-width: var(--nsh-textarea-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_ta-focus-width: var(--nsh-textarea-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));

      --_ta-resize: var(--nsh-textarea-resize, vertical);
    }

    .nsh-textarea {
      width: 100%;
      min-width: 0;
      min-height: var(--_ta-min-height);
      padding-inline: var(--_ta-pad-x);
      padding-block: var(--_ta-pad-y);

      border-radius: var(--_ta-radius);
      border: var(--_ta-border-width) solid var(--_ta-border);
      background: var(--_ta-bg);
      color: var(--_ta-fg);

      font-family: var(--nsh-font-family);
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);

      resize: var(--_ta-resize);

      transition:
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-textarea::placeholder {
      color: var(--_ta-placeholder);
      opacity: 1;
    }

    .nsh-textarea:focus {
      outline: none;
    }

    .nsh-textarea.nsh-focus-visible,
    .nsh-textarea:focus-visible {
      border-color: var(--_ta-border-focus);
      box-shadow: 0 0 0 var(--_ta-focus-width) var(--_ta-focus-ring);
    }

    :host(.nsh-textarea-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshTextareaComponent {
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  private readonly cva = new NshCvaControl<string>();

  readonly placeholder = input<string | null>(null);
  readonly rows = input(3);
  readonly cols = input<number | null>(null);
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  readonly minLength = input<number | null>(null);
  readonly maxLength = input<number | null>(null);
  readonly resize = input<NshTextareaResize>('vertical');
  readonly ariaLabel = input<string | null>(null);

  private readonly autoId = `nsh-textarea-${nextTextareaId++}`;

  private readonly hasUserAriaLabel = computed(() => {
    const label = this.ariaLabel();
    return label !== null && label.trim().length > 0;
  });

  readonly effectiveId = computed(() => this.field?.controlId?.() ?? this.autoId);

  readonly effectiveDescribedBy = computed(() => this.field?.describedByIds?.() ?? null);

  readonly effectiveDisabled = computed(() => {
    const parent = this.field?.disabled?.() ?? false;
    return this.disabled() || parent || this.cva.disabled();
  });

  readonly effectiveRequired = computed(() => {
    const parent = this.field?.required?.() ?? false;
    return this.required() || parent;
  });

  readonly effectiveAriaLabel = computed(() => {
    if (this.hasUserAriaLabel()) {
      return this.ariaLabel();
    }

    // Prefer association with <label for="..."> from nsh-form-field.
    return null;
  });

  readonly safeRows = computed(() => clampInt(this.rows(), 1));

  readonly safeCols = computed(() => {
    const value = normalizeOptionalPositiveInt(this.cols());
    return value === null ? null : String(value);
  });

  readonly safeMinLength = computed(() => {
    const value = normalizeOptionalPositiveInt(this.minLength());
    return value === null ? null : String(value);
  });

  readonly safeMaxLength = computed(() => {
    const value = normalizeOptionalPositiveInt(this.maxLength());
    return value === null ? null : String(value);
  });

  readonly stringValue = computed(() => {
    const v = this.cva.value();
    return v ?? '';
  });

  writeValue(value: string | null): void {
    this.cva.writeValue(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.cva.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.cva.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.cva.setDisabledState(isDisabled);
  }

  onInput(event: Event) {
    if (this.effectiveDisabled()) {
      return;
    }

    const el = event.target as HTMLTextAreaElement | null;
    this.cva.setValueFromUI(el?.value ?? '');
  }

  onBlur() {
    this.cva.markTouched();
  }
}
