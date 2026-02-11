import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NshAutocompleteComponent,
  NshFormFieldComponent,
  type NshAutocompleteItem,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-autocomplete-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshAutocompleteComponent, NshFormFieldComponent],
  template: `
    <nsh-form-field label="Assignee">
      <nsh-autocomplete
        placeholder="Type a name"
        [items]="items()"
        [formControl]="control"
      ></nsh-autocomplete>
    </nsh-form-field>
  `,
})
export class AutocompleteBasicExampleComponent {
  readonly control = new FormControl('', { nonNullable: true });

  readonly items = signal<ReadonlyArray<NshAutocompleteItem<string>>>([
    { label: 'Alex Rivera', value: 'alex' },
    { label: 'Jordan Lee', value: 'jordan' },
    { label: 'Taylor Quinn', value: 'taylor' },
  ]);
}

export const autocompleteBasicHtml = `<nsh-form-field label="Assignee">
  <nsh-autocomplete
    placeholder="Type a name"
    [items]="items"
    [formControl]="control"
  ></nsh-autocomplete>
</nsh-form-field>`;

export const autocompleteBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshAutocompleteComponent, NshFormFieldComponent, type NshAutocompleteItem } from 'nsh-kit-ui';

@Component({
  selector: 'demo-autocomplete-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshAutocompleteComponent, NshFormFieldComponent],
  templateUrl: './autocomplete-basic.example.html'
})
export class AutocompleteBasicExampleComponent {
  control = new FormControl('');
  items: NshAutocompleteItem<string>[] = [
    { label: 'Alex Rivera', value: 'alex' },
    { label: 'Jordan Lee', value: 'jordan' },
    { label: 'Taylor Quinn', value: 'taylor' }
  ];
}`;
