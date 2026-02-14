import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-loading-example',
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
        <nsh-button variant="filled" [loading]="true" [style.--nsh-button-bg]="accentColor()">Saving</nsh-button>
        <nsh-button
          variant="tonal"
          [loading]="true"
          [style.--nsh-button-bg]="tonalBg()"
          [style.--nsh-button-fg]="tonalFg()"
        >
          Processing
        </nsh-button>
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
export class ButtonLoadingExampleComponent {
  readonly accentColor = signal('#0b5db7');
  readonly tonalBg = computed(() => `color-mix(in srgb, ${this.accentColor()} 24%, white)`);
  readonly tonalFg = computed(() => `color-mix(in srgb, ${this.accentColor()} 64%, #1f2533)`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }
}

export const buttonLoadingHtml = `<div class="example-stack">
  <div class="control-row">
    <div class="field">
      Accent color
      <input class="demo-showcase-color-picker" type="color" [value]="accentColor()" (input)="setAccent($event)" />
    </div>
  </div>

  <div class="example-row">
    <nsh-button variant="filled" [loading]="true" [style.--nsh-button-bg]="accentColor()">Saving</nsh-button>
    <nsh-button variant="tonal" [loading]="true" [style.--nsh-button-bg]="tonalBg()" [style.--nsh-button-fg]="tonalFg()">Processing</nsh-button>
  </div>
</div>`;

export const buttonLoadingTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-loading-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './button-loading.example.html'
})
export class ButtonLoadingExampleComponent {
  readonly accentColor = signal('#0b5db7');
  readonly tonalBg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 24%, white)\`);
  readonly tonalFg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 64%, #1f2533)\`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }
}`;
