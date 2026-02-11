import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { NshSliderComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-slider-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshSliderComponent],
  template: `
    <nsh-slider
      [formControl]="control"
      [min]="0"
      [max]="100"
      [step]="5"
      [showValue]="true"
      ariaLabel="Volume"
    ></nsh-slider>
  `,
})
export class SliderBasicExampleComponent {
  readonly control = new FormControl(40, { nonNullable: true });
}

export const sliderBasicHtml = `<nsh-slider
  [formControl]="control"
  [min]="0"
  [max]="100"
  [step]="5"
  [showValue]="true"
  ariaLabel="Volume"
></nsh-slider>`;

export const sliderBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NshSliderComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-slider-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NshSliderComponent],
  templateUrl: './slider-basic.example.html'
})
export class SliderBasicExampleComponent {
  control = new FormControl(40, { nonNullable: true });
}`;
