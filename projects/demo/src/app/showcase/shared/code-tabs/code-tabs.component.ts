import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { NshButtonComponent, NshTabComponent, NshTabsComponent } from 'nsh-kit-ui';
import { highlightSnippet } from '../code-highlight.util';

@Component({
  selector: 'demo-code-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshTabComponent, NshTabsComponent],
  template: `
    <nsh-tabs
      variant="underline"
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
          <pre class="code-tabs__code"><code class="hljs" [innerHTML]="highlightedHtml()"></code></pre>
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
          <pre class="code-tabs__code"><code class="hljs" [innerHTML]="highlightedTs()"></code></pre>
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
        --nsh-tabs-bg: transparent;
        --nsh-tabs-radius: 0px;
        --nsh-tabs-panel-padding: 0px;
        --nsh-tabs-gap: 8px;
        border-radius: 12px;
        background: transparent;
        box-shadow: none;
      }

      .code-tabs__preview {
        padding: 16px;
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid #d7ddea;
      }

      .code-tabs__preview :focus {
        outline: none;
        box-shadow: none;
      }

      .code-tabs__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px 0;
      }

      .code-tabs__label {
        font-size: 0.74rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #5d6980;
        font-weight: 600;
      }

      .code-tabs__code {
        margin: 0;
        padding: 16px;
        overflow: auto;
        background: #0b0f14;
        color: #e6edf3;
        border-radius: 12px;
        border: 1px solid #2a3441;
        font-family: var(--nsh-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
        font-size: 0.88rem;
        line-height: var(--nsh-line-height-normal);
      }

      .code-tabs__code code.hljs {
        display: block;
        padding: 0;
        background: transparent;
        color: inherit;
        font: inherit;
      }

      .code-tabs__empty {
        padding: 16px;
        color: #5d6980;
        font-size: 0.88rem;
      }
    `,
  ],
})
export class CodeTabsComponent {
  readonly html = input('');
  readonly ts = input('');

  readonly activeIndex = signal(0);
  readonly lastCopied = signal<'html' | 'ts' | null>(null);
  readonly highlightedHtml = computed(() => highlightSnippet(this.html(), 'html'));
  readonly highlightedTs = computed(() => highlightSnippet(this.ts(), 'typescript'));

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
