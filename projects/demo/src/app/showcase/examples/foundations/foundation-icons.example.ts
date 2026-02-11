import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshIconComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-icons-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshIconComponent],
  template: `
    <div class="icon-grid">
      <div class="icon-item">
        <nsh-icon name="check" size="1.5rem"></nsh-icon>
        <span>check</span>
      </div>
      <div class="icon-item">
        <nsh-icon name="alert-triangle" size="1.5rem"></nsh-icon>
        <span>alert-triangle</span>
      </div>
      <div class="icon-item">
        <nsh-icon name="star" size="1.5rem"></nsh-icon>
        <span>star</span>
      </div>
    </div>
  `,
  styles: [
    `
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--nsh-space-md);
      }

      .icon-item {
        display: grid;
        justify-items: center;
        gap: var(--nsh-space-xs);
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class FoundationIconsExampleComponent {}

export const foundationIconsHtml = `<div class="icon-grid">
  <div class="icon-item">
    <nsh-icon name="check" size="1.5rem"></nsh-icon>
    <span>check</span>
  </div>
  <div class="icon-item">
    <nsh-icon name="alert-triangle" size="1.5rem"></nsh-icon>
    <span>alert-triangle</span>
  </div>
  <div class="icon-item">
    <nsh-icon name="star" size="1.5rem"></nsh-icon>
    <span>star</span>
  </div>
</div>`;

export const foundationIconsTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshIconComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-foundation-icons-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshIconComponent],
  templateUrl: './foundation-icons.example.html'
})
export class FoundationIconsExampleComponent {}`;
