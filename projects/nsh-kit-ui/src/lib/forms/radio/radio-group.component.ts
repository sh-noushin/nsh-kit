import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  NSH_FORM_FIELD_CONTEXT,
  type NshFormFieldControlContext,
} from '../form-field/form-field.context';
import { NSH_RADIO_GROUP_CONTEXT } from './radio-group.context';
import { NshRadioComponent } from './radio.component';

export type NshRadioGroupOrientation = 'vertical' | 'horizontal';

let nextRadioGroupId = 0;

function isArrowKey(key: string): boolean {
  return key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown';
}

function deltaForArrow(key: string): 1 | -1 | null {
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return -1;
  }
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return 1;
  }
  return null;
}

@Component({
  selector: 'nsh-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NSH_RADIO_GROUP_CONTEXT,
      useExisting: forwardRef(() => NshRadioGroupComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NshRadioGroupComponent),
      multi: true,
    },
  ],
  host: {
    '[class.nsh-radio-group-host]': 'true',
    '[class.nsh-radio-group-host--disabled]': 'effectiveDisabled()',
    '[class.nsh-radio-group-host--horizontal]': "orientation() === 'horizontal'",
    '[class.nsh-radio-group-host--vertical]': "orientation() === 'vertical'",

    '[style.--nsh-radio-group-orientation]': "orientation() === 'horizontal' ? 'row' : 'column'",
  },
  template: `
    <div
      class="nsh-radio-group"
      role="radiogroup"
      [id]="groupId"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-labelledby]="effectiveAriaLabelledBy()"
      [attr.aria-describedby]="effectiveDescribedBy()"
      (keydown)="onKeydown($event)"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-radio-group-gap: var(--nsh-radio-group-gap, unset);
      --nsh-radio-group-orientation: var(--nsh-radio-group-orientation, unset);

      --_rg-gap: var(--nsh-radio-group-gap, var(--nsh-space-sm));
      --_rg-dir: var(--nsh-radio-group-orientation, column);
    }

    .nsh-radio-group {
      display: flex;
      flex-direction: var(--_rg-dir);
      gap: var(--_rg-gap);
      min-width: 0;
    }

    :host(.nsh-radio-group-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
})
export class NshRadioGroupComponent {
  private readonly field = inject<NshFormFieldControlContext | null>(NSH_FORM_FIELD_CONTEXT, {
    optional: true,
  });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string | null>(null);
  readonly orientation = input<NshRadioGroupOrientation>('vertical');
  readonly ariaLabel = input<string | null>(null);

  private readonly id = nextRadioGroupId++;
  private readonly fallbackName = `nsh-radio-group-${this.id}`;

  private readonly model = signal<any>(null);
  private readonly cvaDisabled = signal(false);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private readonly focusedValue = signal<any>(null);

  private readonly radiosQuery = contentChildren(NshRadioComponent);
  readonly radios = computed(() => this.radiosQuery());

  readonly effectiveDisabled = computed(() => {
    const parent = this.field?.disabled?.() ?? false;
    return this.disabled() || parent || this.cvaDisabled();
  });

  readonly effectiveRequired = computed(() => {
    const parent = this.field?.required?.() ?? false;
    return this.required() || parent;
  });

  readonly effectiveName = computed(() => this.name() ?? this.fallbackName);

  readonly effectiveDescribedBy = computed(() => this.field?.describedByIds?.() ?? null);

  readonly effectiveAriaLabelledBy = computed(() => {
    const fieldLabelId = this.field?.labelId?.() ?? null;
    return fieldLabelId;
  });

  get groupId(): string {
    return this.field?.controlId?.() ?? `nsh-radio-group-${this.id}-control`;
  }

  value(): any {
    return this.model();
  }

  groupName(): string {
    return this.effectiveName();
  }

  isDisabled(): boolean {
    return this.effectiveDisabled();
  }

  isRequired(): boolean {
    return this.effectiveRequired();
  }

  select(value: any): void {
    if (this.effectiveDisabled()) {
      return;
    }

    this.model.set(value);
    this.focusedValue.set(value);

    this.onChange(value);
  }

  markTouched(): void {
    this.onTouched();
  }

  requestFocusFor(value: any): void {
    if (this.effectiveDisabled()) {
      return;
    }

    this.focusedValue.set(value);
  }

  tabIndexFor(value: any): string {
    if (this.effectiveDisabled()) {
      return '-1';
    }

    const radios = this.enabledRadios();
    if (radios.length === 0) {
      return '-1';
    }

    const focused = this.resolvedFocusedValue(radios);
    return focused === value ? '0' : '-1';
  }

  constructor() {
    effect(() => {
      const radios = this.enabledRadios();
      if (radios.length === 0) {
        this.focusedValue.set(null);
        return;
      }

      const currentValue = this.model();
      const hasSelected = radios.some((r) => r.value() === currentValue);

      const desired = hasSelected ? currentValue : radios[0]!.value();
      this.focusedValue.set(desired);
    });
  }

  writeValue(value: string | number | null): void {
    this.model.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(!!isDisabled);
  }

  onKeydown(event: KeyboardEvent) {
    if (this.effectiveDisabled()) {
      return;
    }

    if (isArrowKey(event.key)) {
      const delta = deltaForArrow(event.key);
      if (delta === null) {
        return;
      }

      event.preventDefault();
      this.moveFocusAndSelection(delta);
      return;
    }

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      const radios = this.enabledRadios();
      const focusedValue = this.resolvedFocusedValue(radios);
      if (focusedValue !== null) {
        this.select(focusedValue);
      }
    }
  }

  private enabledRadios(): readonly NshRadioComponent[] {
    const radios = this.radios();
    return radios.filter((r) => !r.disabled());
  }

  private resolvedFocusedValue(radios: readonly NshRadioComponent[]): any {
    const focused = this.focusedValue();
    if (radios.some((r) => r.value() === focused)) {
      return focused;
    }

    const current = this.model();
    if (radios.some((r) => r.value() === current)) {
      return current;
    }

    return radios.length > 0 ? radios[0]!.value() : null;
  }

  private moveFocusAndSelection(delta: 1 | -1) {
    const radios = this.enabledRadios();
    if (radios.length === 0) {
      return;
    }

    const focused = this.resolvedFocusedValue(radios);
    const currentIndex = Math.max(
      0,
      radios.findIndex((r) => r.value() === focused),
    );

    const nextIndex = (currentIndex + delta + radios.length) % radios.length;
    const next = radios[nextIndex];
    if (!next) {
      return;
    }

    const nextValue = next.value();
    this.focusedValue.set(nextValue);
    this.select(nextValue);
    next.focusNative();
  }
}
