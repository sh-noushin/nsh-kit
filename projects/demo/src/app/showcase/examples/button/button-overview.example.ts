import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-overview-example',
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

      <div
        class="button-overview"
        [style.--btn-accent]="accentColor()"
        [style.--btn-elevated-bg]="elevatedBg()"
        [style.--btn-tonal-bg]="tonalBg()"
        [style.--btn-tonal-fg]="tonalFg()"
        [style.--btn-outline-border]="outlineBorder()"
        [style.--btn-fab-bg]="fabBg()"
        [style.--btn-fab-fg]="fabFg()"
      >
      <div class="button-overview__row">
        <div class="button-overview__label">Text</div>
        <div class="button-overview__actions">
          <nsh-button variant="text" class="btn btn--text" [size]="size()">Basic</nsh-button>
          <nsh-button variant="text" class="btn btn--text btn--state-disabled" [size]="size()" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="text" class="btn btn--text btn--link" [size]="size()">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Elevated</div>
        <div class="button-overview__actions">
          <nsh-button variant="tonal" class="btn btn--elevated btn--raised" [size]="size()">Basic</nsh-button>
          <nsh-button variant="tonal" class="btn btn--elevated btn--state-disabled" [size]="size()" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="tonal" class="btn btn--elevated btn--raised btn--link" [size]="size()">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Outlined</div>
        <div class="button-overview__actions">
          <nsh-button variant="outlined" class="btn btn--outlined" [size]="size()">Basic</nsh-button>
          <nsh-button variant="outlined" class="btn btn--outlined btn--state-disabled" [size]="size()" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="outlined" class="btn btn--outlined btn--link" [size]="size()">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Filled</div>
        <div class="button-overview__actions">
          <nsh-button variant="filled" class="btn btn--filled" [size]="size()">Basic</nsh-button>
          <nsh-button variant="filled" class="btn btn--filled btn--state-disabled" [size]="size()" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="filled" class="btn btn--filled" [size]="size()">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Tonal</div>
        <div class="button-overview__actions">
          <nsh-button variant="tonal" class="btn btn--tonal" [size]="size()">Basic</nsh-button>
          <nsh-button variant="tonal" class="btn btn--tonal btn--state-disabled" [size]="size()" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="tonal" class="btn btn--tonal btn--link" [size]="size()">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Icon</div>
        <div class="button-overview__actions">
          <nsh-button
            variant="text"
            class="btn btn--icon btn--icon-only"
            [size]="size()"
            ariaLabel="More options"
            leadingIcon="more-vert"
          ></nsh-button>
          <nsh-button
            variant="text"
            class="btn btn--icon btn--icon-only"
            [size]="size()"
            ariaLabel="Open in new"
            leadingIcon="open-in-new"
          ></nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Floating Action Button (FAB)</div>
        <div class="button-overview__actions">
          <nsh-button
            variant="tonal"
            class="btn fab fab--default btn--icon-only"
            [size]="size()"
            ariaLabel="Delete"
            leadingIcon="delete"
          ></nsh-button>
          <nsh-button
            variant="tonal"
            class="btn fab fab--default btn--icon-only btn--state-disabled"
            [size]="size()"
            ariaLabel="Favorite disabled"
            leadingIcon="favorite"
            [disabled]="true"
          ></nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Mini FAB</div>
        <div class="button-overview__actions">
          <nsh-button
            variant="tonal"
            class="btn fab fab--mini btn--icon-only"
            [size]="size()"
            ariaLabel="Menu"
            leadingIcon="menu"
          ></nsh-button>
          <nsh-button
            variant="tonal"
            class="btn fab fab--mini btn--icon-only btn--state-disabled"
            [size]="size()"
            ariaLabel="Home disabled"
            leadingIcon="home"
            [disabled]="true"
          ></nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Extended FAB</div>
        <div class="button-overview__actions">
          <nsh-button variant="tonal" class="btn fab fab--extended btn--link" [size]="size()" leadingIcon="favorite">
            Basic
          </nsh-button>
          <nsh-button
            variant="tonal"
            class="btn fab fab--extended btn--state-disabled"
            [size]="size()"
            leadingIcon="favorite"
            [disabled]="true"
          >
            Disabled
          </nsh-button>
          <nsh-button variant="tonal" class="btn fab fab--extended btn--link" [size]="size()" leadingIcon="favorite">
            Link
          </nsh-button>
        </div>
      </div>
    </div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: 12px;
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

      .button-overview {
        border-radius: 12px;
        border: 1px solid #cfd5e1;
        background: #f2f4f8;
        overflow: hidden;
      }

      .button-overview__row {
        display: grid;
        grid-template-columns: minmax(150px, 205px) 1fr;
        gap: 12px;
        align-items: center;
        padding: 8px 10px;
        border-top: 1px solid #cfd5e1;
      }

      .button-overview__row:first-child {
        border-top: none;
      }

      .button-overview__label {
        font-size: 1.04rem;
        color: #2a303d;
      }

      .button-overview__actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .btn {
        --nsh-button-radius: 999px;
        --nsh-density-control-height: 44px;
        --nsh-density-padding-inline: 26px;
        --nsh-density-padding-block: 10px;
      }

      .btn--text {
        --nsh-density-control-height: 40px;
        --nsh-density-padding-inline: 10px;
        --nsh-button-bg: transparent;
        --nsh-button-fg: var(--btn-accent, #0b5db7);
      }

      .btn--elevated {
        --nsh-button-bg: var(--btn-elevated-bg, #ebedf2);
        --nsh-button-fg: var(--btn-accent, #0b5db7);
      }

      .btn--outlined {
        --nsh-button-fg: var(--btn-accent, #0b5db7);
        --nsh-button-border-color: var(--btn-outline-border, #7f8899);
      }

      .btn--filled {
        --nsh-button-bg: var(--btn-accent, #0b5db7);
        --nsh-button-fg: #fff;
      }

      .btn--tonal {
        --nsh-button-bg: var(--btn-tonal-bg, #c1cde8);
        --nsh-button-fg: var(--btn-tonal-fg, #49556f);
      }

      .btn--link {
        --nsh-button-fg: var(--btn-accent, #0b5db7);
      }

      .btn--state-disabled {
        --nsh-button-bg: #d2d5dc;
        --nsh-button-fg: #8b9099;
        --nsh-button-border-color: #c7ccd6;
      }

      .btn--raised {
        filter: drop-shadow(0 1px 1px rgb(17 29 52 / 0.24)) drop-shadow(0 2px 8px rgb(17 29 52 / 0.1));
      }

      .btn--icon {
        --nsh-density-control-height: 38px;
        --nsh-density-padding-inline: 8px;
        --nsh-density-padding-block: 8px;
        --nsh-button-bg: transparent;
        --nsh-button-fg: color-mix(in srgb, var(--btn-accent, #0b5db7) 46%, #4c5565);
      }

      .btn--icon-only {
        --nsh-space-sm: 0px;
      }

      .fab {
        --nsh-button-radius: 18px;
        --nsh-button-bg: var(--btn-fab-bg, #c2d0ea);
        --nsh-button-fg: var(--btn-fab-fg, #0b5aa9);
      }

      .fab--default {
        --nsh-density-control-height: 62px;
        --nsh-density-padding-inline: 18px;
        --nsh-density-padding-block: 14px;
        filter: drop-shadow(0 1px 1px rgb(17 29 52 / 0.24)) drop-shadow(0 2px 8px rgb(17 29 52 / 0.12));
      }

      .fab--mini {
        --nsh-density-control-height: 44px;
        --nsh-density-padding-inline: 12px;
        --nsh-density-padding-block: 8px;
      }

      .fab--extended {
        --nsh-density-control-height: 56px;
        --nsh-density-padding-inline: 22px;
        --nsh-density-padding-block: 12px;
        --nsh-space-sm: 10px;
      }

      @media (max-width: 860px) {
        .button-overview__row {
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }
    `,
  ],
})
export class ButtonOverviewExampleComponent {
  readonly accentColor = signal('#0b5db7');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly elevatedBg = computed(() => `color-mix(in srgb, ${this.accentColor()} 8%, white)`);
  readonly tonalBg = computed(() => `color-mix(in srgb, ${this.accentColor()} 24%, white)`);
  readonly tonalFg = computed(() => `color-mix(in srgb, ${this.accentColor()} 64%, #1f2533)`);
  readonly outlineBorder = computed(() => `color-mix(in srgb, ${this.accentColor()} 42%, #7f8899)`);
  readonly fabBg = computed(() => `color-mix(in srgb, ${this.accentColor()} 22%, white)`);
  readonly fabFg = computed(() => `color-mix(in srgb, ${this.accentColor()} 90%, #0b5aa9)`);

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

export const buttonOverviewHtml = `<div class="example-stack">
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

  <div
    class="button-overview"
    [style.--btn-accent]="accentColor()"
    [style.--btn-elevated-bg]="elevatedBg()"
    [style.--btn-tonal-bg]="tonalBg()"
    [style.--btn-tonal-fg]="tonalFg()"
    [style.--btn-outline-border]="outlineBorder()"
    [style.--btn-fab-bg]="fabBg()"
    [style.--btn-fab-fg]="fabFg()"
  >
  <div class="button-overview__row">
    <div class="button-overview__label">Text</div>
    <div class="button-overview__actions">
      <nsh-button variant="text" class="btn btn--text" [size]="size()">Basic</nsh-button>
      <nsh-button variant="text" class="btn btn--text btn--state-disabled" [size]="size()" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="text" class="btn btn--text btn--link" [size]="size()">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Elevated</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn btn--elevated btn--raised" [size]="size()">Basic</nsh-button>
      <nsh-button variant="tonal" class="btn btn--elevated btn--state-disabled" [size]="size()" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="tonal" class="btn btn--elevated btn--raised btn--link" [size]="size()">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Outlined</div>
    <div class="button-overview__actions">
      <nsh-button variant="outlined" class="btn btn--outlined" [size]="size()">Basic</nsh-button>
      <nsh-button variant="outlined" class="btn btn--outlined btn--state-disabled" [size]="size()" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="outlined" class="btn btn--outlined btn--link" [size]="size()">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Filled</div>
    <div class="button-overview__actions">
      <nsh-button variant="filled" class="btn btn--filled" [size]="size()">Basic</nsh-button>
      <nsh-button variant="filled" class="btn btn--filled btn--state-disabled" [size]="size()" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="filled" class="btn btn--filled" [size]="size()">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Tonal</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn btn--tonal" [size]="size()">Basic</nsh-button>
      <nsh-button variant="tonal" class="btn btn--tonal btn--state-disabled" [size]="size()" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="tonal" class="btn btn--tonal btn--link" [size]="size()">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Icon</div>
    <div class="button-overview__actions">
      <nsh-button variant="text" class="btn btn--icon btn--icon-only" [size]="size()" ariaLabel="More options" leadingIcon="more-vert"></nsh-button>
      <nsh-button variant="text" class="btn btn--icon btn--icon-only" [size]="size()" ariaLabel="Open in new" leadingIcon="open-in-new"></nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Floating Action Button (FAB)</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn fab fab--default btn--icon-only" [size]="size()" ariaLabel="Delete" leadingIcon="delete"></nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--default btn--icon-only btn--state-disabled" [size]="size()" ariaLabel="Favorite disabled" leadingIcon="favorite" [disabled]="true"></nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Mini FAB</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn fab fab--mini btn--icon-only" [size]="size()" ariaLabel="Menu" leadingIcon="menu"></nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--mini btn--icon-only btn--state-disabled" [size]="size()" ariaLabel="Home disabled" leadingIcon="home" [disabled]="true"></nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Extended FAB</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn fab fab--extended btn--link" [size]="size()" leadingIcon="favorite">Basic</nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--extended btn--state-disabled" [size]="size()" leadingIcon="favorite" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--extended btn--link" [size]="size()" leadingIcon="favorite">Link</nsh-button>
    </div>
  </div>
  </div>
</div>`;

export const buttonOverviewTs = `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-overview-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './button-overview.example.html'
})
export class ButtonOverviewExampleComponent {
  readonly accentColor = signal('#0b5db7');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly elevatedBg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 8%, white)\`);
  readonly tonalBg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 24%, white)\`);
  readonly tonalFg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 64%, #1f2533)\`);
  readonly outlineBorder = computed(() => \`color-mix(in srgb, \${this.accentColor()} 42%, #7f8899)\`);
  readonly fabBg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 22%, white)\`);
  readonly fabFg = computed(() => \`color-mix(in srgb, \${this.accentColor()} 90%, #0b5aa9)\`);

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
