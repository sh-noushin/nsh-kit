import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { NshButtonComponent, NshTabComponent, NshTabsComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-code-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshTabComponent, NshTabsComponent],
  template: `
    <nsh-tabs
      variant="contained"
      class="code-tabs"
      [activeIndex]="activeIndex()"
      (activeIndexChange)="activeIndex.set($event)"
    >
      <nsh-tab label="Preview">
        <div class="code-tabs__preview">
          <ng-content></ng-content>
        </div>
      </nsh-tab>

      <nsh-tab label="HTML">
        <div class="code-tabs__toolbar">
          <span class="code-tabs__label">HTML snippet</span>
          <nsh-button variant="text" size="sm" (click)="copy(html(), 'html')">
            @switch (lastCopied()) {
              @case ('html') {
                Copied
              }
              @default {
                Copy
              }
            }
          </nsh-button>
        </div>
        @if (html()) {
          <pre class="code-tabs__code"><code>{{ html() }}</code></pre>
        } @else {
          <div class="code-tabs__empty">No HTML snippet provided.</div>
        }
      </nsh-tab>

      <nsh-tab label="TS">
        <div class="code-tabs__toolbar">
          <span class="code-tabs__label">TS snippet</span>
          <nsh-button variant="text" size="sm" (click)="copy(ts(), 'ts')">
            @switch (lastCopied()) {
              @case ('ts') {
                Copied
              }
              @default {
                Copy
              }
            }
          </nsh-button>
        </div>
        @if (ts()) {
          <pre class="code-tabs__code"><code>{{ ts() }}</code></pre>
        } @else {
          <div class="code-tabs__empty">No TS snippet provided.</div>
        }
      </nsh-tab>
    </nsh-tabs>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .code-tabs {
        border-radius: var(--nsh-radius-xl);
        background: var(--nsh-color-surface-1);
        box-shadow: var(--nsh-elevation-1);
      }

      .code-tabs__preview {
        padding: var(--nsh-space-lg);
        border-radius: var(--nsh-radius-lg);
        background: linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%);
        border: 1px solid color-mix(in srgb, var(--nsh-color-outline) 60%, transparent);
      }

      .code-tabs__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--nsh-space-sm) var(--nsh-space-lg) 0;
      }

      .code-tabs__label {
        font-size: var(--nsh-font-size-xs);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--nsh-color-text-muted);
        font-weight: var(--nsh-font-weight-semibold);
      }

      .code-tabs__code {
        margin: 0;
        padding: var(--nsh-space-lg);
        overflow: auto;
        background: #0f172a;
        color: #e2e8f0;
        border-radius: var(--nsh-radius-lg);
        border: 1px solid rgba(15, 23, 42, 0.2);
        font-family: var(--nsh-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
        font-size: var(--nsh-font-size-sm);
        line-height: var(--nsh-line-height-normal);
      }

      .code-tabs__empty {
        padding: var(--nsh-space-lg);
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class CodeTabsComponent {
  readonly html = input('');
  readonly ts = input('');

  readonly activeIndex = signal(0);
  readonly lastCopied = signal<'html' | 'ts' | null>(null);

  copy(value: string, kind: 'html' | 'ts'): void {
    if (!value) {
      return;
    }

    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(value).then(() => {
        this.lastCopied.set(kind);
        setTimeout(() => this.lastCopied.set(null), 1500);
      });
      return;
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'absolute';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.lastCopied.set(kind);
      setTimeout(() => this.lastCopied.set(null), 1500);
    } catch {
      this.lastCopied.set(null);
    }
  }
}
