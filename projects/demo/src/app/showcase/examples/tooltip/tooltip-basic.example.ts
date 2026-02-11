import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent, NshTooltipDirective } from 'nsh-kit-ui';

@Component({
  selector: 'demo-tooltip-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshTooltipDirective],
  template: `
    <nsh-button variant="outlined" [nshTooltip]="'Tooltip text'">Hover me</nsh-button>
  `,
})
export class TooltipBasicExampleComponent {}

export const tooltipBasicHtml = `<nsh-button variant="outlined" [nshTooltip]="'Tooltip text'">Hover me</nsh-button>`;

export const tooltipBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent, NshTooltipDirective } from 'nsh-kit-ui';

@Component({
  selector: 'demo-tooltip-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshTooltipDirective],
  templateUrl: './tooltip-basic.example.html'
})
export class TooltipBasicExampleComponent {}`;
