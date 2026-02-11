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
        <header class="doc-page__header">
          <div>
            <h1 class="doc-page__title">{{ doc.title }}</h1>
            <p class="doc-page__subtitle">{{ doc.description }}</p>
          </div>
        </header>

        @if (doc.usage?.length) {
          <section class="doc-page__usage">
            <div class="doc-page__usage-title">Usage guidelines</div>
            <ul class="doc-page__usage-list">
              @for (item of doc.usage; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        }

        <section class="doc-page__examples">
          @for (example of examples(); track example.title) {
            <demo-example-card [title]="example.title" [html]="example.html" [ts]="example.ts">
              <ng-container [ngComponentOutlet]="example.component"></ng-container>
            </demo-example-card>
          }
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
        gap: var(--nsh-space-xl);
      }

      .doc-page__header {
        display: grid;
        gap: var(--nsh-space-xs);
        padding: var(--nsh-space-lg);
        border-radius: var(--nsh-radius-xl);
        background: #ffffff;
        box-shadow: var(--nsh-elevation-1);
        border: 1px solid color-mix(in srgb, var(--nsh-color-outline) 70%, transparent);
      }

      .doc-page__title {
        margin: 0;
        font-size: clamp(28px, 4vw, 38px);
      }

      .doc-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .doc-page__usage {
        padding: var(--nsh-space-lg);
        border-radius: var(--nsh-radius-xl);
        background: #ffffff;
        box-shadow: var(--nsh-elevation-1);
        border: 1px solid color-mix(in srgb, var(--nsh-color-outline) 70%, transparent);
      }

      .doc-page__usage-title {
        font-size: var(--nsh-font-size-sm);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--nsh-color-text-muted);
        font-weight: var(--nsh-font-weight-semibold);
        margin-bottom: var(--nsh-space-sm);
      }

      .doc-page__usage-list {
        margin: 0;
        padding-left: var(--nsh-space-lg);
        display: grid;
        gap: var(--nsh-space-xs);
        color: var(--nsh-color-text);
      }

      .doc-page__examples {
        display: grid;
        gap: var(--nsh-space-lg);
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
