import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { NshEmptyStateComponent } from 'nsh-kit-ui';

import { ExampleCardComponent } from '../shared/example-card/example-card.component';
import { getDocEntry } from '../shared/doc-registry';

@Component({
  selector: 'demo-doc-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, ExampleCardComponent, NshEmptyStateComponent],
  template: `
    <div class="doc-page">
      @if (entry(); as doc) {
        <nav class="doc-page__tabs" aria-label="Doc sections">
          <button type="button" class="doc-page__tab doc-page__tab--active">Overview</button>
          <button type="button" class="doc-page__tab" disabled aria-disabled="true">API</button>
          <button type="button" class="doc-page__tab" disabled aria-disabled="true">Styling</button>
          <a class="doc-page__tab" href="#doc-examples">Examples</a>
        </nav>

        <header class="doc-page__header">
          <h1 class="doc-page__title">{{ doc.title }}</h1>
          <p class="doc-page__subtitle">{{ doc.description }}</p>
        </header>

        @if (doc.usage?.length) {
          <section class="doc-page__usage">
            <h2 class="doc-page__section-title">Usage guidelines</h2>
            <ul class="doc-page__usage-list">
              @for (item of doc.usage; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <section class="doc-page__examples" id="doc-examples">
          <h2 class="doc-page__section-title">Examples</h2>
          <div class="doc-page__examples-grid">
            @for (example of examples(); track example.title) {
              <demo-example-card [title]="example.title" [html]="example.html" [ts]="example.ts">
                <ng-container [ngComponentOutlet]="example.component"></ng-container>
              </demo-example-card>
            }
          </div>
        </section>
      } @else {
        <nsh-empty-state
          align="center"
          size="md"
          icon="file-text"
          title="Docs not found"
          description="Choose a component from the navigation."
        ></nsh-empty-state>
      }
    </div>
  `,
  styles: [
    `
      .doc-page {
        display: grid;
        gap: 30px;
      }

      .doc-page__tabs {
        display: flex;
        align-items: flex-end;
        gap: clamp(24px, 6vw, 72px);
        border-bottom: 1px solid #d5dae7;
        overflow-x: auto;
      }

      .doc-page__tab {
        border: 0;
        border-bottom: 3px solid transparent;
        background: transparent;
        margin: 0;
        padding: 0 0 14px;
        color: #2a3244;
        font: inherit;
        font-size: 0.93rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
      }

      .doc-page__tab[disabled] {
        color: #8791a3;
        cursor: default;
      }

      .doc-page__tab--active {
        color: #0f4ea9;
        border-bottom-color: #1a73e8;
      }

      .doc-page__header {
        display: grid;
        gap: 10px;
        max-width: 72ch;
      }

      .doc-page__title {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 500;
        line-height: 1.15;
        color: #1e2533;
      }

      .doc-page__subtitle {
        margin: 0;
        color: #404c63;
        font-size: clamp(1rem, 1.4vw, 1.25rem);
        line-height: 1.65;
      }

      .doc-page__usage {
        display: grid;
        gap: 14px;
        max-width: 72ch;
      }

      .doc-page__section-title {
        margin: 0;
        font-size: clamp(1.3rem, 2.5vw, 2rem);
        font-weight: 500;
        color: #1f2533;
      }

      .doc-page__usage-list {
        margin: 0;
        padding-left: 24px;
        display: grid;
        gap: 10px;
        line-height: 1.6;
        color: #2b3345;
      }

      .doc-page__examples {
        display: grid;
        gap: 16px;
      }

      .doc-page__examples-grid {
        display: grid;
        gap: 16px;
      }

      @media (max-width: 720px) {
        .doc-page {
          gap: 22px;
        }

        .doc-page__tabs {
          gap: 28px;
        }

        .doc-page__tab {
          padding-bottom: 10px;
          font-size: 0.84rem;
        }
      }
    `,
  ],
})
export class DocPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly docId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  readonly entry = computed(() => getDocEntry(this.docId()));
  readonly examples = computed(() => this.entry()?.exampleProvider() ?? []);
}
