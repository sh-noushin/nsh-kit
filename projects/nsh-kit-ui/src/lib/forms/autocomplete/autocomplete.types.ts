export interface NshAutocompleteItem<T = any> {
  value: T;
  label: string;
  disabled?: boolean;
}
