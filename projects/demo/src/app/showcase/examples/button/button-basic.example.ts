import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <div class="example-stack">
      <div class="control-row">
        <div class="field">
          Accent color
          <input
            class="demo-showcase-color-picker"
            type="color"
            [value]="accentColor()"
            (input)="setAccent($event)"
          />
        </div>
      </div>

      <div class="example-row">
        <nsh-button variant="filled" [style.--nsh-button-bg]="accentColor()">Primary</nsh-button>
        <nsh-button
          variant="outlined"
          [style.--nsh-button-fg]="accentColor()"
          [style.--nsh-button-border-color]="outlineBorder()"
        >
          Secondary
        </nsh-button>
        <nsh-button variant="text" [style.--nsh-button-fg]="accentColor()">Ghost</nsh-button>
      </div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-sm);
      }

      .control-row {
        display: flex;
        align-items: flex-end;
        gap: 24px;
      }

      .field {
        display: grid;
        gap: 6px;
        font-size: 0.78rem;
        color: #111;
        font-weight: 600;
      }

      .example-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--nsh-space-sm);
      }
    `,
  ],
})
export class ButtonBasicExampleComponent {
  readonly accentColor = signal('#0b5db7');
  readonly outlineBorder = computed(() => `color-mix(in srgb, ${this.accentColor()} 42%, #7f8899)`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }
}

export const buttonBasicHtml = `<div class="example-stack">
  <div class="control-row">
    <div class="field">
      Accent color
      <input class="demo-showcase-color-picker" type="color" [value]="accentColor()" (input)="setAccent($event)" />
    </div>
  </div>

  <div class="example-row">
    <nsh-button variant="filled" [style.--nsh-button-bg]="accentColor()">Primary</nsh-button>
    <nsh-button variant="outlined" [style.--nsh-button-fg]="accentColor()" [style.--nsh-button-border-color]="outlineBorder()">Secondary</nsh-button>
    <nsh-button variant="text" [style.--nsh-button-fg]="accentColor()">Ghost</nsh-button>
  </div>
</div>`;

export const buttonBasicTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './button-basic.example.html'
})
export class ButtonBasicExampleComponent {
  readonly accentColor = signal('#0b5db7');
  readonly outlineBorder = computed(() => \`color-mix(in srgb, \${this.accentColor()} 42%, #7f8899)\`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }
}`;
