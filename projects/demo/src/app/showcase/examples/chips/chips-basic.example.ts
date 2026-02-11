import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshChipComponent, NshChipsComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-chips-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshChipComponent, NshChipsComponent],
  template: `
    <nsh-chips>
      <nsh-chip>Design</nsh-chip>
      <nsh-chip [selected]="true">Engineering</nsh-chip>
      <nsh-chip variant="outlined">Product</nsh-chip>
    </nsh-chips>
  `,
})
export class ChipsBasicExampleComponent {}

export const chipsBasicHtml = `<nsh-chips>
  <nsh-chip>Design</nsh-chip>
  <nsh-chip [selected]="true">Engineering</nsh-chip>
  <nsh-chip variant="outlined">Product</nsh-chip>
</nsh-chips>`;

export const chipsBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshChipComponent, NshChipsComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-chips-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshChipComponent, NshChipsComponent],
  templateUrl: './chips-basic.example.html'
})
export class ChipsBasicExampleComponent {}`;
