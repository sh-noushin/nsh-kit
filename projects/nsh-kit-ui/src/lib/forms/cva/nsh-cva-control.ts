import { signal } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';

export class NshCvaControl<T> implements ControlValueAccessor {
  readonly value = signal<T | null>(null);
  readonly disabled = signal(false);

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(!!isDisabled);
  }

  setValueFromUI(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }

  markTouched(): void {
    this.onTouched();
  }
}
