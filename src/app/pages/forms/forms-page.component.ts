import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NshAutocompleteComponent,
  NshChipComponent,
  NshChipsComponent,
  NshFormFieldComponent,
  NshInputComponent,
  NshRadioComponent,
  NshRadioGroupComponent,
  NshSliderComponent,
  NshSwitchComponent,
} from 'nsh-kit-ui';

import type { NshAutocompleteItem } from 'nsh-kit-ui';

type DemoKey =
  | 'default'
  | 'placeholder'
  | 'required'
  | 'disabled'
  | 'error'
  | 'prefixSuffix'
  | 'hint'
  | 'acBasic'
  | 'acMinChars'
  | 'acDisabled'
  | 'acRequiredInFormField'
  | 'acNoResults'
  | 'acLoading'
  | 'chipBasic'
  | 'chipVariantsColors'
  | 'chipSelected'
  | 'chipDisabled'
  | 'chipRemovable'
  | 'chipIconOnly'
  | 'chipInFormField'
  | 'sliderDefault'
  | 'sliderMinMaxStep'
  | 'sliderDisabled'
  | 'sliderRequiredInFormField'
  | 'sliderShowValue'
  | 'sliderStep5'
  | 'radioDefault'
  | 'radioHorizontal'
  | 'radioDisabledGroup'
  | 'radioDisabledOption'
  | 'radioRequiredInFormField'
  | 'radioAriaLabel'
  | 'switchDefault'
  | 'switchChecked'
  | 'switchDisabled'
  | 'switchRequired'
  | 'switchAriaLabel'
  | 'switchInFormField';

interface DemoState {
  key: DemoKey;
  title: string;
}

@Component({
  selector: 'app-forms-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NshFormFieldComponent,
    NshInputComponent,
    NshAutocompleteComponent,
    NshChipsComponent,
    NshChipComponent,
    NshSliderComponent,
    NshRadioGroupComponent,
    NshRadioComponent,
    NshSwitchComponent,
  ],
  template: `
    <div class="forms-page">
      <h1 class="forms-page__title">Forms</h1>
      <p class="forms-page__subtitle">
        Form-field + input demo (signals-first, zoneless friendly).
      </p>

      @for (state of states(); track state.key) {
        <section class="forms-page__card">
          <h2 class="forms-page__h2">{{ state.title }}</h2>

          @switch (state.key) {
            @case ('default') {
              <nsh-form-field label="Name">
                <nsh-input [formControl]="nameControl" />
              </nsh-form-field>
            }
            @case ('placeholder') {
              <nsh-form-field label="Search">
                <nsh-input placeholder="Type to search" [formControl]="searchControl" />
              </nsh-form-field>
            }
            @case ('required') {
              <nsh-form-field label="Email" [required]="true" hint="Required">
                <nsh-input type="email" autocomplete="email" [formControl]="emailControl" />
              </nsh-form-field>
            }
            @case ('disabled') {
              <nsh-form-field label="Disabled" [disabled]="true" hint="Disabled via form-field">
                <nsh-input [formControl]="disabledControl" />
              </nsh-form-field>
            }
            @case ('error') {
              <nsh-form-field label="Username" error="That username is not available">
                <nsh-input autocomplete="username" [formControl]="userControl" />
              </nsh-form-field>
            }
            @case ('prefixSuffix') {
              <nsh-form-field label="Amount" hint="Prefix/suffix slots">
                <span nshPrefix class="forms-page__affix">$</span>
                <nsh-input type="number" [formControl]="amountControl" />
                <span nshSuffix class="forms-page__affix">USD</span>
              </nsh-form-field>
            }
            @case ('hint') {
              <nsh-form-field label="Phone" hint="We only use this for account recovery">
                <nsh-input type="tel" autocomplete="tel" [formControl]="phoneControl" />
              </nsh-form-field>
            }

            @case ('acBasic') {
              <nsh-form-field label="Fruit" hint="Basic autocomplete">
                <nsh-autocomplete
                  placeholder="Type to search"
                  [items]="acItems"
                  [formControl]="acBasicControl"
                />
              </nsh-form-field>

              <div class="forms-page__affix">
                Value: {{ acBasicControl.value ?? 'null' }}
              </div>

              <div class="forms-page__overlay-underlay">
                This content sits under the panel to demonstrate overlay stacking.
              </div>
            }
            @case ('acMinChars') {
              <nsh-form-field label="City" hint="minChars=2">
                <nsh-autocomplete
                  placeholder="Type at least 2 characters"
                  [minChars]="2"
                  [items]="acCityItems"
                  [formControl]="acMinCharsControl"
                />
              </nsh-form-field>
            }
            @case ('acDisabled') {
              <nsh-form-field label="Disabled" hint="Disabled via reactive form control">
                <nsh-autocomplete
                  placeholder="Disabled"
                  [items]="acItems"
                  [formControl]="acDisabledControl"
                />
              </nsh-form-field>
            }
            @case ('acRequiredInFormField') {
              <nsh-form-field
                label="Required"
                hint="Required autocomplete inside form-field (aria-describedby wiring)"
                error="Please select an option"
                [required]="true"
              >
                <nsh-autocomplete
                  placeholder="Pick one"
                  [items]="acItems"
                  [formControl]="acRequiredControl"
                />
              </nsh-form-field>
            }
            @case ('acNoResults') {
              <nsh-form-field label="No results" hint="Type something like 'zzz'">
                <nsh-autocomplete
                  placeholder="Try 'zzz'"
                  [items]="acItems"
                  noResultsText="No matches"
                  [formControl]="acNoResultsControl"
                />
              </nsh-form-field>
            }
            @case ('acLoading') {
              <nsh-form-field label="Loading" hint="Shows a loading row when open">
                <nsh-autocomplete
                  placeholder="Focus to open"
                  [items]="acItems"
                  [loading]="true"
                  [formControl]="acLoadingControl"
                />
              </nsh-form-field>
            }

            @case ('chipBasic') {
              <nsh-chips ariaLabel="Basic chips">
                <nsh-chip (clicked)="chipClickCount.set(chipClickCount() + 1)">Angular</nsh-chip>
                <nsh-chip>Design</nsh-chip>
                <nsh-chip>UI Kit</nsh-chip>
              </nsh-chips>

              <div class="forms-page__affix">Clicked: {{ chipClickCount() }}</div>
            }
            @case ('chipVariantsColors') {
              <nsh-chips gap="sm" ariaLabel="Variants and colors">
                <nsh-chip variant="filled" color="primary">Primary</nsh-chip>
                <nsh-chip variant="outlined" color="secondary">Secondary</nsh-chip>
                <nsh-chip variant="outlined" color="success">Success</nsh-chip>
                <nsh-chip variant="outlined" color="warn">Warn</nsh-chip>
                <nsh-chip variant="outlined" color="danger">Danger</nsh-chip>
              </nsh-chips>
            }
            @case ('chipSelected') {
              <nsh-chips ariaLabel="Selected chips">
                <nsh-chip [selected]="true" color="primary">Selected</nsh-chip>
                <nsh-chip [selected]="false" color="primary">Not selected</nsh-chip>
              </nsh-chips>
            }
            @case ('chipDisabled') {
              <nsh-chips ariaLabel="Disabled chips">
                <nsh-chip [disabled]="true" color="primary">Disabled</nsh-chip>
                <nsh-chip [disabled]="true" variant="outlined" color="secondary">Disabled outlined</nsh-chip>
              </nsh-chips>
            }
            @case ('chipRemovable') {
              <nsh-chips ariaLabel="Removable chips">
                @if (!chipRemoved()) {
                  <nsh-chip
                    [removable]="true"
                    trailingIcon="x"
                    (removed)="chipRemoved.set(true)"
                  >
                    Removable
                  </nsh-chip>
                } @else {
                  <span class="forms-page__affix">Removed</span>
                }
              </nsh-chips>
            }
            @case ('chipIconOnly') {
              <nsh-chips ariaLabel="Chips with icons">
                <nsh-chip leadingIcon="user">Profile</nsh-chip>
                <nsh-chip leadingIcon="settings">Settings</nsh-chip>
              </nsh-chips>

              <div class="forms-page__affix">Icons require registration via provideNshIcons().</div>
            }
            @case ('chipInFormField') {
              <nsh-form-field label="Tags" hint="Chips inside form-field">
                <nsh-chips ariaLabel="Tags">
                  <nsh-chip>Angular</nsh-chip>
                  <nsh-chip>Signals</nsh-chip>
                  <nsh-chip>OnPush</nsh-chip>
                </nsh-chips>
              </nsh-form-field>
            }

            @case ('sliderDefault') {
              <nsh-slider [formControl]="sliderDefaultControl" />
            }
            @case ('sliderMinMaxStep') {
              <nsh-slider [min]="0" [max]="10" [step]="1" [formControl]="sliderMinMaxStepControl" />
            }
            @case ('sliderDisabled') {
              <nsh-slider [formControl]="sliderDisabledControl" />
            }
            @case ('sliderRequiredInFormField') {
              <nsh-form-field
                label="Volume"
                hint="Required slider inside form-field (aria-describedby wiring)"
                error="Please pick a volume"
                [required]="true"
              >
                <nsh-slider [formControl]="sliderRequiredInFormFieldControl" />
              </nsh-form-field>
            }
            @case ('sliderShowValue') {
              <nsh-slider [showValue]="true" [formControl]="sliderShowValueControl" />
            }
            @case ('sliderStep5') {
              <nsh-slider [step]="5" [formControl]="sliderStep5Control" />
            }

            @case ('radioDefault') {
              <nsh-radio-group [formControl]="radioDefaultControl">
                <nsh-radio [value]="'daily'" label="Daily" />
                <nsh-radio [value]="'weekly'" label="Weekly" />
                <nsh-radio [value]="'never'" label="Never" />
              </nsh-radio-group>
            }
            @case ('radioHorizontal') {
              <nsh-radio-group orientation="horizontal" [formControl]="radioHorizontalControl">
                <nsh-radio [value]="'small'" label="Small" />
                <nsh-radio [value]="'medium'" label="Medium" />
                <nsh-radio [value]="'large'" label="Large" />
              </nsh-radio-group>
            }
            @case ('radioDisabledGroup') {
              <nsh-radio-group [disabled]="true" [formControl]="radioDisabledGroupControl">
                <nsh-radio [value]="'on'" label="On" />
                <nsh-radio [value]="'off'" label="Off" />
              </nsh-radio-group>
            }
            @case ('radioDisabledOption') {
              <nsh-radio-group [formControl]="radioDisabledOptionControl">
                <nsh-radio [value]="1" label="One" />
                <nsh-radio [value]="2" label="Two (disabled)" [disabled]="true" />
                <nsh-radio [value]="3" label="Three" />
              </nsh-radio-group>
            }
            @case ('radioRequiredInFormField') {
              <nsh-form-field
                label="Plan"
                hint="Required group inside form-field (aria-describedby wiring)"
                error="Please pick a plan"
                [required]="true"
              >
                <nsh-radio-group [formControl]="radioRequiredInFormFieldControl">
                  <nsh-radio [value]="'free'" label="Free" />
                  <nsh-radio [value]="'pro'" label="Pro" />
                </nsh-radio-group>
              </nsh-form-field>
            }
            @case ('radioAriaLabel') {
              <nsh-radio-group ariaLabel="Choose a color" [formControl]="radioAriaLabelControl">
                <nsh-radio [value]="'red'" label="Red" />
                <nsh-radio [value]="'green'" label="Green" />
                <nsh-radio [value]="'blue'" label="Blue" />
              </nsh-radio-group>
            }

            @case ('switchDefault') {
              <nsh-switch label="Email notifications" [formControl]="switchDefaultControl" />
            }
            @case ('switchChecked') {
              <nsh-switch label="Dark mode" [formControl]="switchCheckedControl" />
            }
            @case ('switchDisabled') {
              <nsh-switch label="Disabled switch" [formControl]="switchDisabledControl" />
            }
            @case ('switchRequired') {
              <nsh-switch label="Required switch" [required]="true" [formControl]="switchRequiredControl" />
            }
            @case ('switchAriaLabel') {
              <nsh-switch [ariaLabel]="'Switch without visible label'" [formControl]="switchAriaLabelControl" />
            }
            @case ('switchInFormField') {
              <nsh-form-field label="Feature flag" hint="Wires aria-describedby from form-field">
                <nsh-switch label="Enabled" [formControl]="switchInFormFieldControl" />
              </nsh-form-field>
            }
          }
        </section>
      }

      <section class="forms-page__card">
        <h2 class="forms-page__h2">Live Values</h2>
        <div class="forms-page__values">
          <div class="forms-page__kv"><span class="forms-page__k">Name</span><span class="forms-page__v">{{ nameControl.value ?? '' }}</span></div>
          <div class="forms-page__kv"><span class="forms-page__k">Search</span><span class="forms-page__v">{{ searchControl.value ?? '' }}</span></div>
          <div class="forms-page__kv"><span class="forms-page__k">Email</span><span class="forms-page__v">{{ emailControl.value ?? '' }}</span></div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .forms-page {
      display: grid;
      gap: var(--nsh-space-lg);
      padding: var(--nsh-space-lg);
      font-family: var(--nsh-font-family);
      color: var(--nsh-color-text);
      max-width: var(--nsh-page-max-width, 72ch);
      margin-inline: auto;
    }

    .forms-page__title {
      font-size: var(--nsh-font-size-xl);
      line-height: var(--nsh-line-height-tight);
      font-weight: var(--nsh-font-weight-semibold);
      margin: 0;
    }

    .forms-page__subtitle {
      margin: 0;
      color: var(--nsh-color-text-muted);
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);
    }

    .forms-page__card {
      display: grid;
      gap: var(--nsh-space-md);
      padding: var(--nsh-space-lg);
      border-radius: var(--nsh-radius-lg);
      background: var(--nsh-color-surface-1);
      border: 1px solid var(--nsh-color-outline);
    }

    .forms-page__h2 {
      margin: 0;
      font-size: var(--nsh-font-size-lg);
      line-height: var(--nsh-line-height-tight);
      font-weight: var(--nsh-font-weight-medium);
    }

    .forms-page__affix {
      color: var(--nsh-color-text-muted);
      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);
      white-space: nowrap;
    }

    .forms-page__values {
      display: grid;
      gap: var(--nsh-space-sm);
    }

    .forms-page__overlay-underlay {
      padding: var(--nsh-space-md);
      border-radius: var(--nsh-radius-md);
      border: 1px dashed var(--nsh-color-outline);
      background: var(--nsh-color-surface-1);
      position: relative;
      z-index: 0;
    }

    .forms-page__kv {
      display: grid;
      grid-template-columns: minmax(0, 12ch) 1fr;
      gap: var(--nsh-space-sm);
      min-width: 0;
    }

    .forms-page__k {
      color: var(--nsh-color-text-muted);
      font-size: var(--nsh-font-size-sm);
    }

    .forms-page__v {
      font-size: var(--nsh-font-size-sm);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
})
export class FormsPageComponent {
  readonly nameControl = new FormControl<string | null>('');
  readonly searchControl = new FormControl<string | null>('');
  readonly emailControl = new FormControl<string | null>('');
  readonly phoneControl = new FormControl<string | null>('');
  readonly amountControl = new FormControl<string | null>('');
  readonly disabledControl = new FormControl<string | null>({ value: 'Disabled', disabled: true });
  readonly userControl = new FormControl<string | null>('');

  readonly sliderDefaultControl = new FormControl<number>(50, { nonNullable: true });
  readonly sliderMinMaxStepControl = new FormControl<number>(5, { nonNullable: true });
  readonly sliderDisabledControl = new FormControl<number>({ value: 30, disabled: true }, { nonNullable: true });
  readonly sliderRequiredInFormFieldControl = new FormControl<number>(25, { nonNullable: true });
  readonly sliderShowValueControl = new FormControl<number>(70, { nonNullable: true });
  readonly sliderStep5Control = new FormControl<number>(50, { nonNullable: true });

  readonly radioDefaultControl = new FormControl<string | null>('weekly');
  readonly radioHorizontalControl = new FormControl<string | null>('medium');
  readonly radioDisabledGroupControl = new FormControl<string | null>('on');
  readonly radioDisabledOptionControl = new FormControl<number | null>(1);
  readonly radioRequiredInFormFieldControl = new FormControl<string | null>(null);
  readonly radioAriaLabelControl = new FormControl<string | null>('green');

  readonly switchDefaultControl = new FormControl<boolean>(false, { nonNullable: true });
  readonly switchCheckedControl = new FormControl<boolean>(true, { nonNullable: true });
  readonly switchDisabledControl = new FormControl<boolean>({ value: true, disabled: true }, { nonNullable: true });
  readonly switchRequiredControl = new FormControl<boolean>(false, { nonNullable: true });
  readonly switchAriaLabelControl = new FormControl<boolean>(false, { nonNullable: true });
  readonly switchInFormFieldControl = new FormControl<boolean>(false, { nonNullable: true });

  readonly acItems: ReadonlyArray<NshAutocompleteItem<string>> = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ];

  readonly acCityItems: ReadonlyArray<NshAutocompleteItem<string>> = [
    { value: 'london', label: 'London' },
    { value: 'los-angeles', label: 'Los Angeles' },
    { value: 'lisbon', label: 'Lisbon' },
    { value: 'paris', label: 'Paris' },
  ];

  readonly acBasicControl = new FormControl<string | null>(null);
  readonly acMinCharsControl = new FormControl<string | null>(null);
  readonly acDisabledControl = new FormControl<string | null>({ value: null, disabled: true });
  readonly acRequiredControl = new FormControl<string | null>(null);
  readonly acNoResultsControl = new FormControl<string | null>(null);
  readonly acLoadingControl = new FormControl<string | null>(null);

  readonly chipClickCount = signal(0);
  readonly chipRemoved = signal(false);

  private readonly _states = signal<DemoState[]>([
    { key: 'default', title: '1) Default input with label' },
    { key: 'placeholder', title: '2) Placeholder' },
    { key: 'required', title: '3) Required' },
    { key: 'disabled', title: '4) Disabled' },
    { key: 'error', title: '5) Error message' },
    { key: 'prefixSuffix', title: '6) Prefix / suffix slots' },
    { key: 'hint', title: '7) Hint text' },

    { key: 'acBasic', title: 'Autocomplete 1) Basic + placeholder' },
    { key: 'acMinChars', title: 'Autocomplete 2) minChars=2' },
    { key: 'acDisabled', title: 'Autocomplete 3) Disabled' },
    { key: 'acRequiredInFormField', title: 'Autocomplete 4) Required in form-field (describedBy wiring)' },
    { key: 'acNoResults', title: 'Autocomplete 5) No results' },
    { key: 'acLoading', title: 'Autocomplete 6) Loading=true' },

    { key: 'chipBasic', title: 'Chips 1) Basic chips + (clicked) output' },
    { key: 'chipVariantsColors', title: 'Chips 2) Variants + colors' },
    { key: 'chipSelected', title: 'Chips 3) Selected state' },
    { key: 'chipDisabled', title: 'Chips 4) Disabled state' },
    { key: 'chipRemovable', title: 'Chips 5) Removable + (removed) output' },
    { key: 'chipIconOnly', title: 'Chips 6) Leading icons' },
    { key: 'chipInFormField', title: 'Chips 7) Inside form-field' },

    { key: 'sliderDefault', title: 'Slider 1) Default slider' },
    { key: 'sliderMinMaxStep', title: 'Slider 2) min/max/step (0..10 step 1)' },
    { key: 'sliderDisabled', title: 'Slider 3) Disabled state' },
    { key: 'sliderRequiredInFormField', title: 'Slider 4) Required in form-field (describedBy wiring)' },
    { key: 'sliderShowValue', title: 'Slider 5) showValue=true' },
    { key: 'sliderStep5', title: 'Slider 6) step=5' },

    { key: 'radioDefault', title: 'Radio 1) Default vertical group' },
    { key: 'radioHorizontal', title: 'Radio 2) Horizontal group' },
    { key: 'radioDisabledGroup', title: 'Radio 3) Disabled group' },
    { key: 'radioDisabledOption', title: 'Radio 4) One disabled option' },
    { key: 'radioRequiredInFormField', title: 'Radio 5) Required in form-field (describedBy wiring)' },
    { key: 'radioAriaLabel', title: 'Radio 6) Group ariaLabel (no visible group label)' },

    { key: 'switchDefault', title: 'Switch 1) Default switch with label' },
    { key: 'switchChecked', title: 'Switch 2) Checked state' },
    { key: 'switchDisabled', title: 'Switch 3) Disabled state' },
    { key: 'switchRequired', title: 'Switch 4) Required state' },
    { key: 'switchAriaLabel', title: 'Switch 5) No label + ariaLabel' },
    { key: 'switchInFormField', title: 'Switch 6) Inside form-field (describedBy wiring)' },
  ]);

  readonly states = computed(() => this._states());
}
