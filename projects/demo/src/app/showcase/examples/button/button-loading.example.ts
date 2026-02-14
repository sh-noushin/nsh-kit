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

      <div
        class="example-row"
        [style.--btn-accent]="accentColor()"
        [style.--btn-tonal-bg]="tonalBg()"
        [style.--btn-tonal-fg]="tonalFg()"
      >
        <nsh-button variant="filled" class="loading-btn loading-btn--filled" [loading]="true">
          Saving
        </nsh-button>
        <nsh-button variant="tonal" class="loading-btn loading-btn--tonal" [loading]="true">
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
        align-items: center;
        gap: 0;
      }

      .loading-btn {
        --nsh-button-radius: 0px;
        --nsh-density-control-height: 56px;
        --nsh-density-padding-inline: 22px;
        --nsh-density-padding-block: 12px;
        margin-right: 12px;
      }

      .loading-btn--filled {
        --nsh-button-bg: var(--btn-accent, #0b5db7);
        --nsh-button-fg: #f4f8ff;
      }

      .loading-btn--tonal {
        --nsh-button-bg: var(--btn-tonal-bg, #dce8f6);
        --nsh-button-fg: var(--btn-tonal-fg, #4f7cb1);
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

  <div class="example-row" [style.--btn-accent]="accentColor()" [style.--btn-tonal-bg]="tonalBg()" [style.--btn-tonal-fg]="tonalFg()">
    <nsh-button variant="filled" class="loading-btn loading-btn--filled" [loading]="true">Saving</nsh-button>
    <nsh-button variant="tonal" class="loading-btn loading-btn--tonal" [loading]="true">Processing</nsh-button>
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
