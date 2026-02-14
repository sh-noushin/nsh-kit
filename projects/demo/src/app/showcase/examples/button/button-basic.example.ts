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

        <label class="field">
          Size
          <select class="control-select" [value]="size()" (change)="setSize($event)">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
      </div>

      <div class="example-row">
        <nsh-button variant="filled" [size]="size()" [style.--nsh-button-bg]="accentColor()">Primary</nsh-button>
        <nsh-button
          variant="outlined"
          [size]="size()"
          [style.--nsh-button-fg]="accentColor()"
          [style.--nsh-button-border-color]="outlineBorder()"
        >
          Secondary
        </nsh-button>
        <nsh-button variant="text" [size]="size()" [style.--nsh-button-fg]="accentColor()">Ghost</nsh-button>
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

      .control-select {
        min-height: 32px;
        border: 1px solid #c7d0df;
        border-radius: 8px;
        padding: 0 10px;
        background: #fff;
        color: #1f2533;
        font: inherit;
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
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly outlineBorder = computed(() => `color-mix(in srgb, ${this.accentColor()} 42%, #7f8899)`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }

  setSize(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value;
    if (value === 'sm' || value === 'md' || value === 'lg') {
      this.size.set(value);
    }
  }
}

export const buttonBasicHtml = `<div class="example-stack">
  <div class="control-row">
    <div class="field">
      Accent color
      <input class="demo-showcase-color-picker" type="color" [value]="accentColor()" (input)="setAccent($event)" />
    </div>

    <label class="field">
      Size
      <select class="control-select" [value]="size()" (change)="setSize($event)">
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
      </select>
    </label>
  </div>

  <div class="example-row">
    <nsh-button variant="filled" [size]="size()" [style.--nsh-button-bg]="accentColor()">Primary</nsh-button>
    <nsh-button variant="outlined" [size]="size()" [style.--nsh-button-fg]="accentColor()" [style.--nsh-button-border-color]="outlineBorder()">Secondary</nsh-button>
    <nsh-button variant="text" [size]="size()" [style.--nsh-button-fg]="accentColor()">Ghost</nsh-button>
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
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly outlineBorder = computed(() => \`color-mix(in srgb, \${this.accentColor()} 42%, #7f8899)\`);

  setAccent(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value;
    if (value) {
      this.accentColor.set(value);
    }
  }

  setSize(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value;
    if (value === 'sm' || value === 'md' || value === 'lg') {
      this.size.set(value);
    }
  }
}`;
