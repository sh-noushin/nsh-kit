import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { NshEmptyStateComponent } from 'nsh-kit-ui';

import { ExampleCardComponent } from '../shared/example-card/example-card.component';
import {
  DOC_ENTRY_METADATA,
  type DocApiKind,
  type DocApiTargetMetadata,
  type DocEntryMetadata,
  type DocSignalMetadata,
  type DocStylingTokenMetadata,
} from '../shared/doc-source-metadata';
import { highlightSnippet } from '../shared/code-highlight.util';
import { getDocEntry } from '../shared/doc-registry';
import type { DocEntry, DocOverviewCodeBlock, DocOverviewSection } from '../shared/doc-models';
import { getSignalDescription as getSignalDescriptionText } from '../shared/signal-descriptions';

type DocTabId = 'overview' | 'api' | 'styling' | 'examples';

interface DocTabLink {
  id: DocTabId;
  label: string;
}

interface ApiGroup {
  id: string;
  kind: DocApiKind;
  title: string;
  targets: ReadonlyArray<DocApiTargetMetadata>;
}

interface OverviewScenario {
  title: string;
  htmlHighlighted: string;
  tsHighlighted: string;
}

interface OverviewSectionCodeViewModel extends DocOverviewCodeBlock {
  highlighted: string;
}

interface OverviewSectionViewModel extends DocOverviewSection {
  codeBlocks: ReadonlyArray<OverviewSectionCodeViewModel>;
}

const DOC_TABS: ReadonlyArray<DocTabLink> = [
  { id: 'overview', label: 'Overview' },
  { id: 'api', label: 'API' },
  { id: 'styling', label: 'Styling' },
  { id: 'examples', label: 'Examples' },
];

const API_GROUP_DEFS: ReadonlyArray<{ kind: DocApiKind; title: string }> = [
  { kind: 'component', title: 'Components' },
  { kind: 'directive', title: 'Directives' },
  { kind: 'service', title: 'Services' },
];

const EMPTY_ENTRY_METADATA: DocEntryMetadata = {
  api: [],
  stylingTokens: [],
};

function normalizeTab(tab: string | null): DocTabId {
  if (tab === 'api' || tab === 'styling' || tab === 'examples') {
    return tab;
  }
  return 'overview';
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toPascalCase(value: string): string {
  return value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join('');
}

function toSnippetLanguage(language: DocOverviewCodeBlock['language']): 'html' | 'typescript' | 'css' {
  if (language === 'ts' || language === 'text') {
    return 'typescript';
  }
  return language;
}

@Component({
  selector: 'demo-doc-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, RouterLink, ExampleCardComponent, NshEmptyStateComponent],
  template: `
    <div class="doc-page">
      @if (entry(); as doc) {
        <nav class="doc-page__tabs" aria-label="Doc sections">
          @for (tab of tabs; track tab.id) {
            <a
              class="doc-page__tab"
              [class.doc-page__tab--active]="activeTab() === tab.id"
              [routerLink]="[]"
              [queryParams]="{ tab: tab.id }"
              queryParamsHandling="merge"
            >
              {{ tab.label }}
            </a>
          }
        </nav>

        @if (activeTab() === 'overview') {
          <header class="doc-page__header">
            <h1 class="doc-page__title">{{ doc.title }}</h1>
            <p class="doc-page__subtitle">{{ doc.description }}</p>
          </header>

          @if (doc.overview?.length) {
            <section class="doc-page__overview">
              @for (paragraph of doc.overview; track paragraph) {
                <p class="doc-page__overview-paragraph">{{ paragraph }}</p>
              }
            </section>
          }

          @if (overviewSections().length) {
            <section class="doc-page__overview-rich">
              @for (section of overviewSections(); track section.title) {
                <article class="doc-page__overview-rich-section">
                  <h2 class="doc-page__section-title">{{ section.title }}</h2>

                  @if (section.paragraphs?.length) {
                    <div class="doc-page__overview-rich-paragraphs">
                      @for (paragraph of section.paragraphs; track paragraph) {
                        <p class="doc-page__overview-paragraph">{{ paragraph }}</p>
                      }
                    </div>
                  }

                  @if (section.bullets?.length) {
                    <ul class="doc-page__usage-list">
                      @for (item of section.bullets; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  }

                  @if (section.codeBlocks.length) {
                    <div class="doc-page__overview-rich-codes">
                      @for (codeBlock of section.codeBlocks; track codeBlock.code) {
                        <pre class="doc-page__overview-code"><code class="hljs" [innerHTML]="codeBlock.highlighted"></code></pre>
                      }
                    </div>
                  }
                </article>
              }
            </section>
          }

          @if (completeOverviewSections().length) {
            <section class="doc-page__overview-rich">
              @for (section of completeOverviewSections(); track section.title) {
                <article class="doc-page__overview-rich-section">
                  <h2 class="doc-page__section-title">{{ section.title }}</h2>

                  @if (section.paragraphs?.length) {
                    <div class="doc-page__overview-rich-paragraphs">
                      @for (paragraph of section.paragraphs; track paragraph) {
                        <p class="doc-page__overview-paragraph">{{ paragraph }}</p>
                      }
                    </div>
                  }

                  @if (section.bullets?.length) {
                    <ul class="doc-page__usage-list">
                      @for (item of section.bullets; track item) {
                        <li>{{ item }}</li>
                      }
                    </ul>
                  }

                  @if (section.codeBlocks.length) {
                    <div class="doc-page__overview-rich-codes">
                      @for (codeBlock of section.codeBlocks; track codeBlock.code) {
                        <pre class="doc-page__overview-code"><code class="hljs" [innerHTML]="codeBlock.highlighted"></code></pre>
                      }
                    </div>
                  }
                </article>
              }
            </section>
          }

          @if (!completeOverviewSections().length && doc.usage?.length) {
            <section class="doc-page__usage">
              <h2 class="doc-page__section-title">Usage guidelines</h2>
              <ul class="doc-page__usage-list">
                @for (item of doc.usage; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>
          }

          @if (!completeOverviewSections().length && whenToUseItems().length) {
            <section class="doc-page__usage">
              <h2 class="doc-page__section-title">When to use</h2>
              <ul class="doc-page__usage-list">
                @for (item of whenToUseItems(); track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>
          }

          @if (!completeOverviewSections().length && howToUseItems().length) {
            <section class="doc-page__usage">
              <h2 class="doc-page__section-title">How to use</h2>
              <ul class="doc-page__usage-list">
                @for (item of howToUseItems(); track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>
          }

          @if (!completeOverviewSections().length && overviewScenarios().length) {
            <section class="doc-page__overview-scenarios">
              <h2 class="doc-page__section-title">Real code scenarios</h2>

              <div class="doc-page__overview-scenarios-grid">
                @for (scenario of overviewScenarios(); track scenario.title) {
                  <article class="doc-page__overview-scenario-card">
                    <h3 class="doc-page__overview-scenario-title">{{ scenario.title }}</h3>

                    <p class="doc-page__overview-scenario-label">HTML</p>
                    <pre class="doc-page__overview-code"><code class="hljs" [innerHTML]="scenario.htmlHighlighted"></code></pre>

                    <p class="doc-page__overview-scenario-label">TS</p>
                    <pre class="doc-page__overview-code"><code class="hljs" [innerHTML]="scenario.tsHighlighted"></code></pre>
                  </article>
                }
              </div>
            </section>
          }
        }

        @if (activeTab() === 'api') {
          @if (apiGroups().length) {
            <section class="doc-page__api-layout">
              <div class="doc-page__api-content">
                @for (group of apiGroups(); track group.id) {
                  <section class="doc-page__api-section" [attr.id]="group.id">
                    <h2 class="doc-page__api-section-title">{{ group.title }}</h2>

                    @for (target of group.targets; track target.name) {
                      <article class="doc-page__api-target" [attr.id]="targetAnchor(group, target)">
                        <h3 class="doc-page__api-target-title">{{ target.name }}</h3>

                        <div class="doc-page__api-meta-grid">
                          @if (target.selector) {
                            <div class="doc-page__api-meta-row">
                              <span>Selector:</span>
                              <code class="doc-page__inline-code">{{ target.selector }}</code>
                            </div>
                          }

                          @if (target.exportAs) {
                            <div class="doc-page__api-meta-row">
                              <span>Exported as:</span>
                              <code class="doc-page__inline-code">{{ target.exportAs }}</code>
                            </div>
                          }
                        </div>

                        <div class="doc-page__api-table-wrap">
                          <table class="doc-page__api-table">
                            <thead>
                              <tr>
                                <th scope="col">Signal</th>
                                <th scope="col">Kind</th>
                                <th scope="col">Type</th>
                                <th scope="col">Description</th>
                                <th scope="col">How to use</th>
                                <th scope="col">Required</th>
                              </tr>
                            </thead>
                            <tbody>
                              @for (signalDoc of target.signals; track signalDoc.name + '-' + signalDoc.kind) {
                                <tr>
                                  <td>
                                    <code>{{ signalDoc.name }}</code>
                                    @if (signalDoc.alias) {
                                      <span class="doc-page__signal-alias">alias: {{ signalDoc.alias }}</span>
                                    }
                                  </td>
                                  <td>
                                    <span class="doc-page__signal-kind">{{ signalDoc.kind }}</span>
                                  </td>
                                  <td><code>{{ signalDoc.type }}</code></td>
                                  <td class="doc-page__signal-description">
                                    {{ getSignalDescription(signalDoc) }}
                                  </td>
                                  <td><code>{{ signalBinding(signalDoc) }}</code></td>
                                  <td>{{ signalDoc.required ? 'Yes' : 'No' }}</td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      </article>
                    }
                  </section>
                }
              </div>

              <aside class="doc-page__api-toc" aria-label="API table of contents">
                <div class="doc-page__api-toc-title">{{ doc.title }}</div>
                @for (group of apiGroups(); track group.id) {
                  <a class="doc-page__api-toc-link doc-page__api-toc-link--section" [href]="'#' + group.id">
                    {{ group.title }}
                  </a>
                  @for (target of group.targets; track target.name) {
                    <a class="doc-page__api-toc-link" [routerLink]="entry()?.route">
                      {{ target.name }}
                    </a>
                  }
                }
              </aside>
            </section>
          } @else {
            <section class="doc-page__empty-state-block">
              <h2 class="doc-page__section-title">API</h2>
              <p class="doc-page__muted-text">No API metadata was extracted for this entry.</p>
            </section>
          }
        }

        @if (activeTab() === 'styling') {
            <section class="doc-page__styling">
              @if (stylingTokens().length) {
              <pre class="doc-page__styling-code"><code class="hljs" [innerHTML]="highlightedStylingSnippet()"></code></pre>

              @if (entry()?.stylingGuide?.length) {
                <div class="doc-page__styling-guide">
                  <p class="doc-page__styling-guide-title">How to customize this component</p>
                  @for (paragraph of entry()!.stylingGuide; track paragraph) {
                    <pre class="doc-page__styling-guide-text"><code>{{ paragraph }}</code></pre>
                  }
                </div>
              }

              <p class="doc-page__styling-intro">
                Styling tokens below are extracted from the component override surface in
                <code class="doc-page__inline-code">nsh-kit-ui</code> source.
                Apply them globally on <code class="doc-page__inline-code">:root</code>, or scope them by setting the variables on the component selector (or a wrapper element).
              </p>

              <h2 class="doc-page__section-title">Style Tokens</h2>

              <div class="doc-page__styling-filters">
                <label class="doc-page__filter-field">
                  <span class="doc-page__sr-only">Filter by token name</span>
                  <input
                    type="text"
                    placeholder="Filter by token name"
                    [value]="tokenNameFilter()"
                    (input)="tokenNameFilter.set($any($event.target).value ?? '')"
                  />
                </label>

                <button
                  type="button"
                  class="doc-page__filter-reset"
                  (click)="resetStylingFilters()"
                  [disabled]="!hasActiveStylingFilters()"
                >
                  Reset filters
                </button>
              </div>

              @if (filteredStylingTokens().length) {
                <div class="doc-page__styling-table-wrap">
                  <table class="doc-page__styling-table">
                    <thead>
                      <tr>
                        <th scope="col">Token</th>
                        <th scope="col">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (token of filteredStylingTokens(); track token.name) {
                        <tr>
                          <td class="doc-page__styling-token-cell">
                            <code>{{ token.name }}</code>
                            <button
                              type="button"
                              class="doc-page__styling-copy-icon"
                              (click)="copyStylingToken(token.name)"
                              [attr.aria-label]="'Copy ' + token.name"
                              [attr.title]="lastCopiedToken() === token.name ? 'Copied' : 'Copy'"
                            >
                              <span class="doc-page__sr-only">
                                @if (lastCopiedToken() === token.name) {
                                  Copied
                                } @else {
                                  Copy
                                }
                              </span>
                            </button>
                          </td>
                          <td class="doc-page__styling-description">
                            {{ getTokenDescription(token.name) }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <p class="doc-page__styling-empty">No styling tokens match your current filters.</p>
              }
            } @else {
              <h2 class="doc-page__section-title">Style Tokens</h2>
              <p class="doc-page__muted-text">
                No per-component styling tokens were extracted for this entry.
              </p>
            }
          </section>
        }

        @if (showExamples()) {
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
        }
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

      .doc-page__overview {
        display: grid;
        gap: 12px;
        max-width: 78ch;
      }

      .doc-page__overview-rich {
        display: grid;
        gap: 18px;
      }

      .doc-page__overview-rich-section {
        display: grid;
        gap: 12px;
        max-width: 78ch;
      }

      .doc-page__overview-rich-paragraphs {
        display: grid;
        gap: 10px;
      }

      .doc-page__overview-rich-codes {
        display: grid;
        gap: 10px;
      }

      .doc-page__overview-paragraph {
        margin: 0;
        color: #2b3345;
        font-size: 0.95rem;
        line-height: 1.7;
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

      .doc-page__overview-scenarios {
        display: grid;
        gap: 16px;
      }

      .doc-page__overview-scenarios-grid {
        display: grid;
        gap: 16px;
      }

      .doc-page__overview-scenario-card {
        display: grid;
        gap: 10px;
        padding: 14px;
        border: 1px solid #d6dceb;
        border-radius: 12px;
        background: #fbfcff;
      }

      .doc-page__overview-scenario-title {
        margin: 0;
        font-size: 1rem;
        color: #1f2a3f;
      }

      .doc-page__overview-scenario-label {
        margin: 0;
        font-size: 0.78rem;
        font-weight: 700;
        color: #435171;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .doc-page__overview-code {
        margin: 0;
        border: 1px solid #dde3ef;
        border-radius: 10px;
        background: #fff;
        padding: 10px 12px;
        overflow-x: auto;
      }

      .doc-page__empty-state-block {
        display: grid;
        gap: 10px;
      }

      .doc-page__muted-text {
        margin: 0;
        color: #5f697d;
      }

      .doc-page__api-layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 28px;
        align-items: start;
      }

      .doc-page__api-content {
        display: grid;
        gap: 28px;
      }

      .doc-page__api-section {
        display: grid;
        gap: 16px;
        scroll-margin-top: 92px;
      }

      .doc-page__api-section-title {
        margin: 0;
        font-size: clamp(1.6rem, 3vw, 2.1rem);
        font-weight: 500;
        padding-bottom: 8px;
        border-bottom: 1px solid #d5dae7;
      }

      .doc-page__api-target {
        display: grid;
        gap: 12px;
        padding: 16px;
        border: 1px solid #d0d7e5;
        border-radius: 14px;
        background: #f8faff;
        scroll-margin-top: 92px;
      }

      .doc-page__api-target-title {
        margin: 0;
        font-size: 1.42rem;
        font-weight: 600;
      }

      .doc-page__api-meta-grid {
        display: grid;
        gap: 8px;
      }

      .doc-page__api-meta-row {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 0.95rem;
      }

      .doc-page__inline-code {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 6px;
        background: #e8edf7;
        border: 1px solid #d6deec;
        color: #1f2738;
        font-family: var(--nsh-font-family-mono, ui-monospace, monospace);
        font-size: 0.88rem;
      }

      .doc-page__api-table-wrap {
        border: 1px solid #ced5e5;
        border-radius: 10px;
        background: #ffffff;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }

      .doc-page__api-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1100px;
      }

      .doc-page__api-table th,
      .doc-page__api-table td {
        padding: 12px 14px;
        text-align: left;
        vertical-align: top;
      }

      .doc-page__api-table thead th {
        font-size: 0.92rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #2a3347;
        font-weight: 600;
        background: #f7f9fd;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .doc-page__api-table tbody tr + tr td {
        border-top: 1px solid #dbe1ed;
      }

      .doc-page__signal-alias {
        display: inline-block;
        margin-left: 8px;
        font-size: 0.8rem;
        color: #5b6780;
      }

      .doc-page__signal-kind {
        display: inline-flex;
        padding: 2px 8px;
        border-radius: 999px;
        background: #e6edf9;
        color: #144eaa;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .doc-page__signal-description {
        color: #556176;
        font-size: 0.9rem;
        line-height: 1.5;
        max-width: 300px;
      }

      .doc-page__api-toc {
        position: sticky;
        top: 16px;
        display: grid;
        gap: 8px;
        padding-left: 16px;
        border-left: 4px solid #d7e4fa;
      }

      .doc-page__api-toc-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2533;
        margin-bottom: 4px;
      }

      .doc-page__api-toc-link {
        text-decoration: none;
        color: #2f3a50;
        font-size: 0.96rem;
      }

      .doc-page__api-toc-link--section {
        margin-top: 4px;
        font-weight: 700;
        color: #1f2636;
      }

      .doc-page__api-toc-link:not(.doc-page__api-toc-link--section) {
        padding-left: 12px;
      }

      .doc-page__api-toc-link:hover {
        color: #0f4ea9;
      }

      .doc-page__styling {
        display: grid;
        gap: 20px;
      }

      .doc-page__styling-code {
        margin: 0;
        border: 1px solid #2a3441;
        border-radius: 14px;
        background: #0b0f14;
        color: #e6edf3;
        padding: 18px 20px;
        overflow: auto;
        font-family: var(--nsh-font-family-mono, ui-monospace, monospace);
        font-size: 0.98rem;
        line-height: 1.55;
      }

      .doc-page__styling-code code.hljs {
        display: block;
        padding: 0;
        background: transparent;
        color: inherit;
        font: inherit;
      }

      .doc-page__styling-guide {
        display: grid;
        gap: 12px;
        padding: 14px 16px;
        background: #f7f9fd;
        border-radius: 10px;
        border-left: 4px solid #1a73e8;
      }

      .doc-page__styling-guide-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: #1f2533;
      }

      .doc-page__styling-guide-text {
        margin: 0;
        font-size: 0.85rem;
        color: #1f2533;
        line-height: 1.6;
        white-space: pre-wrap;
        background: #ffffff;
        border: 1px solid #d7dfed;
        border-radius: 8px;
        padding: 12px 14px;
        font-family: var(--nsh-font-family-mono, ui-monospace, monospace);
        overflow-x: auto;
      }

      .doc-page__styling-guide-text code {
        font: inherit;
        color: inherit;
      }

      .doc-page__styling-intro {
        margin: 0;
        color: #2f3a4f;
      }

      .doc-page__styling-filters {
        display: grid;
        grid-template-columns: minmax(260px, 1fr) auto;
        gap: 14px;
        align-items: center;
      }

      .doc-page__filter-field {
        display: block;
      }

      .doc-page__filter-field input,
      .doc-page__filter-field select {
        width: 100%;
        height: 52px;
        border: 1px solid #aab4c6;
        border-radius: 8px;
        background: #f7f9fd;
        color: #273245;
        font: inherit;
        font-size: 1rem;
        padding: 0 14px;
      }

      .doc-page__filter-field input:focus-visible,
      .doc-page__filter-field select:focus-visible {
        outline: 2px solid rgba(26, 115, 232, 0.3);
        outline-offset: 1px;
      }

      .doc-page__filter-reset {
        border: 0;
        background: transparent;
        color: #0f4ea9;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
      }

      .doc-page__filter-reset[disabled] {
        color: #8f99ab;
        cursor: default;
      }

      .doc-page__styling-table-wrap {
        border: 1px solid #d5dae7;
        border-radius: 10px;
        overflow: auto;
      }

      .doc-page__styling-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 640px;
      }

      .doc-page__styling-table th,
      .doc-page__styling-table td {
        padding: 14px 16px;
        text-align: left;
        border-bottom: 1px solid #d7ddea;
      }

      .doc-page__styling-table td code {
        display: inline-block;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .doc-page__styling-token-cell {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .doc-page__styling-token-cell code {
        flex: 1 1 auto;
        min-width: 0;
      }

      .doc-page__styling-table th {
        font-size: 0.92rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }

      .doc-page__styling-copy-icon {
        width: 34px;
        height: 34px;
        border: 1px solid transparent;
        border-radius: 8px;
        background: transparent;
        padding: 0;
        cursor: pointer;
        position: relative;
        flex: 0 0 auto;
      }

      .doc-page__styling-copy-icon::before,
      .doc-page__styling-copy-icon::after {
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        border: 2px solid #0f4ea9;
        border-radius: 3px;
        box-sizing: border-box;
      }

      .doc-page__styling-copy-icon::before {
        top: 10px;
        left: 12px;
        opacity: 0.9;
      }

      .doc-page__styling-copy-icon::after {
        top: 7px;
        left: 9px;
        opacity: 0.55;
      }

      .doc-page__styling-copy-icon:hover {
        background: rgba(15, 78, 169, 0.08);
      }

      .doc-page__styling-copy-icon:focus-visible {
        outline: 2px solid rgba(26, 115, 232, 0.3);
        outline-offset: 2px;
      }

      .doc-page__styling-description {
        color: #556176;
        font-size: 0.9rem;
      }

      .doc-page__styling-empty {
        margin: 0;
        color: #5a667d;
      }

      .doc-page__sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .doc-page__examples {
        display: grid;
        gap: 16px;
        scroll-margin-top: 92px;
      }

      .doc-page__examples-grid {
        display: grid;
        gap: 16px;
      }

      @media (max-width: 1240px) {
        .doc-page__api-layout {
          grid-template-columns: 1fr;
        }

        .doc-page__api-toc {
          display: none;
        }
      }

      @media (max-width: 980px) {
        .doc-page__styling-filters {
          grid-template-columns: 1fr;
        }
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

  readonly tabs = DOC_TABS;

  private readonly docId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  private readonly tabParam = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('tab'))), {
    initialValue: null,
  });

  readonly entry = computed(() => getDocEntry(this.docId()));
  readonly metadata = computed(
    () => DOC_ENTRY_METADATA[this.entry()?.id ?? ''] ?? EMPTY_ENTRY_METADATA
  );

  readonly activeTab = computed<DocTabId>(() => normalizeTab(this.tabParam()));
  readonly showExamples = computed(() => this.activeTab() === 'examples');

  readonly examples = computed(() => this.entry()?.exampleProvider() ?? []);

  readonly overviewSections = computed<ReadonlyArray<OverviewSectionViewModel>>(() =>
    (this.entry()?.overviewSections ?? []).map((section) => ({
      ...section,
      codeBlocks: (section.codeBlocks ?? []).map((codeBlock) => ({
        ...codeBlock,
        highlighted: highlightSnippet(codeBlock.code, toSnippetLanguage(codeBlock.language)),
      })),
    })),
  );

  readonly whenToUseItems = computed<ReadonlyArray<string>>(() => {
    const doc = this.entry();
    if (!doc) {
      return [];
    }

    if (doc.usage?.length) {
      return doc.usage.slice(0, 3);
    }

    return (doc.overview ?? []).slice(0, 3);
  });

  readonly howToUseItems = computed<ReadonlyArray<string>>(() => {
    const doc = this.entry();
    if (!doc) {
      return [];
    }

    if (doc.usage?.length) {
      return doc.usage;
    }

    const firstExample = this.examples()[0];
    if (!firstExample) {
      return [];
    }

    return [
      `Start with the "${firstExample.title}" example and adapt inputs for your product flow.`,
      'Prefer semantic variants and state bindings so behavior stays predictable.',
      'Keep styling token-based and scoped to avoid global regressions.',
    ];
  });

  readonly overviewScenarios = computed<ReadonlyArray<OverviewScenario>>(() =>
    this.examples().map((example) => ({
      title: example.title,
      htmlHighlighted: highlightSnippet(example.html, 'html'),
      tsHighlighted: highlightSnippet(example.ts, 'typescript'),
    })),
  );

  readonly completeOverviewSections = computed<ReadonlyArray<OverviewSectionViewModel>>(() => {
    const entry = this.entry();
    if (!entry) {
      return [];
    }

    const metadata = this.metadata();
    const examples = this.examples();
    const firstExample = examples[0];
    const secondExample = examples[1] ?? null;
    const signalTargets = metadata.api.filter((target) => target.signals.length > 0);
    const allSignals = signalTargets.flatMap((target) => target.signals);
    const signalCount = allSignals.length;
    const tokenCount = this.stylingTokens().length;
    const selector =
      metadata.api.find((target) => target.kind === 'component' && !!target.selector)?.selector ?? null;
    const serviceName =
      metadata.api.find((target) => target.kind === 'service' && target.name.endsWith('Service'))?.name ?? null;
    const configSignals =
      metadata.api.find((target) => target.kind === 'service' && target.name.endsWith('Config'))?.signals ?? [];

    const usageBullets = (entry.usage?.length ? entry.usage : this.whenToUseItems()).slice(0, 8);

    const quickStartBlocks: DocOverviewCodeBlock[] = [];
    if (selector) {
      quickStartBlocks.push({
        language: 'html',
        code: this.buildSelectorUsageSnippet(selector, allSignals),
      });
    }

    const integrationTs = this.buildIntegrationTsSnippet(entry, serviceName, configSignals);
    if (integrationTs) {
      quickStartBlocks.push({
        language: 'ts',
        code: integrationTs,
      });
    }

    const behaviorBullets = allSignals.slice(0, 8).map((signalDoc) => {
      const binding = this.signalBinding(signalDoc);
      return `\`${signalDoc.name}\` (${signalDoc.kind}, ${signalDoc.type}) controls behavior via ${binding}.`;
    });

    const configBullets = configSignals.slice(0, 6).map((signalDoc) => {
      return `Config option \`${signalDoc.name}\` (${signalDoc.type}) should be set explicitly for your flow defaults.`;
    });

    const configurationBullets = [...behaviorBullets, ...configBullets];

    const sections: Array<DocOverviewSection> = [
      {
        title: 'What this component is for',
        paragraphs: [
          entry.description,
          entry.overview?.[0] ??
            `${entry.title} is part of the ${entry.category} section and is intended for consistent, production-grade UI behavior.`,
          this.getCategoryOverviewParagraph(entry),
        ],
      },
      {
        title: 'When to use and when not to use',
        bullets: usageBullets.length
          ? usageBullets
          : [
              `Use ${entry.title} when you want a reusable interaction with consistent behavior across features.`,
              `Avoid forcing ${entry.title} into flows where a simpler primitive would reduce cognitive load.`,
              'Prefer design-system patterns over one-off UI to reduce long-term maintenance and regression risk.',
            ],
      },
      {
        title: 'Implementation approach',
        paragraphs: [
          `Start from the showcase example and adapt bindings to your feature state/store. This entry currently exposes ${metadata.api.length} API target(s), ${signalCount} signal member(s), and ${tokenCount} styling token(s).`,
          serviceName
            ? `For production flows, keep orchestration in a container component and delegate UI surface rendering to ${serviceName}.`
            : 'Keep state ownership in the parent and pass only minimal, explicit bindings into the UI primitive.',
        ],
        bullets: [
          `Implement the baseline flow with the "${firstExample?.title ?? 'Primary'}" scenario first.`,
          'Map inputs/models/outputs to your domain state and side effects.',
          'Define disabled/loading/empty/error states early to avoid behavior drift.',
          'Use Styling tab tokens for scoped theming instead of hard-coded values in feature CSS.',
          ...(serviceName
            ? [
                `Keep open/close and result handling in ${serviceName} callers, not inside deeply nested components.`,
              ]
            : []),
        ],
        codeBlocks: quickStartBlocks,
      },
      {
        title: 'Behavior and configuration details',
        paragraphs: [
          'Use explicit configuration for behavior that affects accessibility, close interaction, validation flow, and visual consistency.',
        ],
        bullets: configurationBullets.length
          ? configurationBullets
          : [
              'Define required bindings in template and keep optional bindings explicit in code review.',
              'Use predictable defaults and document any non-default behavior in feature code.',
              'Keep component contracts stable so examples and real app usage stay aligned.',
            ],
      },
      {
        title: 'Accessibility, keyboard, and focus guidance',
        paragraphs: [
          'Accessibility behavior should be verified as part of acceptance criteria and tested across keyboard, screen-reader, and responsive contexts.',
        ],
        bullets: this.getAccessibilityBullets(entry),
      },
      {
        title: 'Reference code from examples',
        paragraphs: [
          'Use these snippets as baseline implementations, then align naming, state boundaries, and error handling to your application architecture.',
        ],
        codeBlocks: [
          ...(firstExample
            ? [
                {
                  language: 'html' as const,
                  code: firstExample.html,
                },
                {
                  language: 'ts' as const,
                  code: firstExample.ts,
                },
              ]
            : []),
          ...(secondExample
            ? [
                {
                  language: 'html' as const,
                  code: secondExample.html,
                },
              ]
            : []),
        ],
      },
    ];

    return sections.map((section) => this.toOverviewSectionViewModel(section));
  });

  readonly apiGroups = computed<ReadonlyArray<ApiGroup>>(() => {
    const apiTargets = this.metadata().api;

    return API_GROUP_DEFS.map((groupDef) => {
      const targets = apiTargets.filter(
        (target) => target.kind === groupDef.kind && target.signals.length > 0
      );
      return {
        id: `api-${groupDef.kind}s`,
        kind: groupDef.kind,
        title: groupDef.title,
        targets,
      };
    }).filter((group) => group.targets.length > 0);
  });

  readonly stylingTokens = computed(() => this.metadata().stylingTokens);

  readonly tokenNameFilter = signal('');
  readonly lastCopiedToken = signal<string | null>(null);

  readonly filteredStylingTokens = computed<ReadonlyArray<DocStylingTokenMetadata>>(() => {
    const nameFilter = this.tokenNameFilter().trim().toLowerCase();

    return this.stylingTokens().filter((token) => {
      const matchesName = !nameFilter || token.name.toLowerCase().includes(nameFilter);
      return matchesName;
    });
  });

  readonly hasActiveStylingFilters = computed(() => this.tokenNameFilter().trim().length > 0);

  readonly stylingSnippet = computed(() => {
    const entry = this.entry();
    const tokens = this.stylingTokens().slice(0, 6);

    const selector =
      this.metadata().api.find((target) => target.kind === 'component' && !!target.selector)?.selector ?? null;

    if (!entry || tokens.length === 0) {
      return `/* No component-level styling tokens were extracted for this entry. */`;
    }

    const lines = [
      `/* ${entry.title} styling tokens (CSS variables) */`,
      '',
      '/* Global override (affects all instances) */',
      ':root {',
      ...tokens.map((token) => `  ${token.name}: /* value */;`),
      '}',
      '',
      `/* Scoped override (affects only matching elements) */`,
      `${selector ?? '.my-scope'} {`,
      ...tokens.map((token) => `  ${token.name}: /* value */;`),
      '}',
    ];

    return lines.join('\n');
  });

  readonly highlightedStylingSnippet = computed(() =>
    highlightSnippet(this.stylingSnippet(), 'css')
  );

  copyStylingToken(tokenName: string): void {
    if (!tokenName) {
      return;
    }

    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(tokenName).then(() => {
        this.lastCopiedToken.set(tokenName);
        setTimeout(() => this.lastCopiedToken.set(null), 1200);
      });
      return;
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = tokenName;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'absolute';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.lastCopiedToken.set(tokenName);
      setTimeout(() => this.lastCopiedToken.set(null), 1200);
    } catch {
      this.lastCopiedToken.set(null);
    }
  }

  getTokenDescription(tokenName: string): string {
    const descriptions = this.entry()?.tokenDescriptions;
    return descriptions?.[tokenName] ?? 'CSS custom property for styling override';
  }

  targetAnchor(group: ApiGroup, target: DocApiTargetMetadata): string {
    return `${group.id}-${toSlug(target.name)}`;
  }

  signalBinding(signalDoc: DocSignalMetadata): string {
    const bindingName = signalDoc.alias ?? signalDoc.name;
    const exampleValue = this.getExampleValue(signalDoc);

    if (signalDoc.kind === 'output') {
      return `(${bindingName})="on${toPascalCase(signalDoc.name)}($event)"`;
    }

    if (signalDoc.kind === 'model') {
      return `[(${bindingName})]="${exampleValue}"`;
    }

    return `[${bindingName}]="${exampleValue}"`;
  }

  private getExampleValue(signalDoc: DocSignalMetadata): string {
    const signalName = signalDoc.name;
    const signalType = signalDoc.type;
    const componentId = this.entry()?.id;

    if (componentId === 'breadcrumb') {
      if (signalName === 'items') {
        return 'items()';
      }

      if (signalName === 'itemIcons') {
        return 'itemIcons()';
      }

      const breadcrumbExamples: Record<string, string> = {
        accentColor: '"#2563eb"',
        activeIndex: '2',
        ariaLabel: '"Checkout steps"',
        compact: 'false',
        elevation: '"flat"',
        maxItems: '4',
        separator: '"chevron"',
        shadow: 'true',
        variant: '"segmented"',
      };

      if (breadcrumbExamples[signalName]) {
        return breadcrumbExamples[signalName];
      }
    }

    // Real example values for common signal names
    const examplesByName: Record<string, string> = {
      // Avatar
      name: '"John Doe"',
      ariaLabel: '"John Doe profile"',
      initials: '"JD"',
      status: '"online"',
      size: '"lg"',
      shape: '"circle"',
      src: '"assets/avatar.jpg"',
      alt: '"User avatar"',

      // Badge
      content: '"5"',

      // Button
      variant: '"primary"',
      disabled: 'false',
      loading: 'false',

      // Card
      elevation: '2',

      // Breadcrumb
      href: '"/"',

      // Checkbox
      checked: 'false',
      indeterminate: 'false',

      // Radio
      value: '"option1"',

      // Slider
      min: '0',
      max: '100',
      step: '1',

      // Input
      placeholder: '"Enter text..."',
      type: '"text"',
      inputValue: '""',

      // Textarea
      rows: '4',

      // Select
      options: '[{id: 1, label: "Option 1"}]',

      // Chips/List
      chipItems: '["Tag 1", "Tag 2"]',

      // Progress
      progress: '65',

      // Spinner
      diameter: '48',

      // Skeleton
      lines: '3',

      // Stepper
      activeStep: '0',
      steps: '[{label: "Step 1"}]',

      // Tabs
      activeTab: '0',
      tabs: '[{label: "Tab 1"}]',

      // Table
      columns: '[{key: "name"}]',
      dataRows: '[{name: "John"}]',

      // Toolbar
      title: '"Toolbar Title"',

      // Paginator
      pageSize: '10',
      pageSizeOptions: '[10, 25]',
      totalItems: '100',

      // Divider
      vertical: 'false',

      // Empty State
      icon: '"search"',
      emptyTitle: '"No results"',
      emptyMessage: '"Try different keywords"',

      // Menu
      menuItems: '[{label: "Item 1"}]',

      // Sidenav
      opened: 'true',
      position: '"start"',

      // Dialog
      dialogMessage: '"Dialog content"',

      // Snackbar
      duration: '3000',

      // Tooltip
      text: '"Helpful tooltip"',
      placement: '"top"',

      // Autocomplete
      suggestions: '["Apple", "Banana"]',

      // Form Field
      label: '"Form Label"',

      // Sort
      direction: '"asc"',

      // Common patterns
      color: '"primary"',
      dense: 'false',
      readonly: 'false',
    };

    if (examplesByName[signalName]) {
      return examplesByName[signalName];
    }

    const normalizedType = signalType.replace(/\s+/g, ' ').toLowerCase();

    if (normalizedType.includes('boolean')) {
      return 'false';
    }

    if (normalizedType.includes('number')) {
      return normalizedType.includes('null') ? 'null' : '1';
    }

    if (normalizedType.includes('record<')) {
      return '{}';
    }

    if (normalizedType.includes('[]')) {
      return '[]';
    }

    if (normalizedType.includes('string')) {
      return '"sample"';
    }

    return 'null';
  }

  private toOverviewSectionViewModel(section: DocOverviewSection): OverviewSectionViewModel {
    return {
      ...section,
      codeBlocks: (section.codeBlocks ?? []).map((codeBlock) => ({
        ...codeBlock,
        highlighted: highlightSnippet(codeBlock.code, toSnippetLanguage(codeBlock.language)),
      })),
    };
  }

  private buildSelectorUsageSnippet(
    selector: string,
    signals: ReadonlyArray<DocSignalMetadata>,
  ): string {
    const selectedSignals = [
      ...signals.filter((signal) => signal.kind !== 'output').slice(0, 3),
      ...signals.filter((signal) => signal.kind === 'output').slice(0, 1),
    ];

    if (!selectedSignals.length) {
      return `<${selector}></${selector}>`;
    }

    const bindings = selectedSignals.map((signalDoc) => `  ${this.signalBinding(signalDoc)}`);
    return [`<${selector}`, ...bindings, `></${selector}>`].join('\n');
  }

  private buildIntegrationTsSnippet(
    entry: DocEntry,
    serviceName: string | null,
    configSignals: ReadonlyArray<DocSignalMetadata>,
  ): string {
    if (serviceName && entry.category === 'overlays') {
      const configLines = configSignals
        .slice(0, 4)
        .map((signalDoc) => `      ${signalDoc.name}: ${this.getExampleValue(signalDoc)},`);

      const configBlock = configLines.length
        ? `,\n    {\n${configLines.join('\n')}\n    }`
        : '';

      return `import { Component, inject } from '@angular/core';
import { ${serviceName} } from 'nsh-kit-ui';

@Component({
  selector: 'app-feature-page',
  template: '<button type="button" (click)="open()">Open</button>',
})
export class FeaturePageComponent {
  private readonly service = inject(${serviceName});

  open(): void {
    this.service.open(ExampleContentComponent${configBlock});
  }
}`;
    }

    const modelSignal = this.metadata()
      .api.flatMap((target) => target.signals)
      .find((signalDoc) => signalDoc.kind === 'model');

    if (modelSignal) {
      return `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-feature-page',
  templateUrl: './feature-page.component.html',
})
export class FeaturePageComponent {
  readonly ${modelSignal.name}State = signal(${this.getExampleValue(modelSignal)});
}`;
    }

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-feature-page',
  templateUrl: './feature-page.component.html',
})
export class FeaturePageComponent {
  // Keep feature state in the page/container and pass explicit bindings to ${entry.title}.
}`;
  }

  private getCategoryOverviewParagraph(entry: DocEntry): string {
    switch (entry.category) {
      case 'components':
        return `${entry.title} is a reusable UI primitive for page-level composition. It should be integrated with predictable state and interaction contracts, then themed through design tokens.`;
      case 'forms':
        return `${entry.title} is part of the input and validation surface. It should integrate with form state, validation messaging, and disabled/error behavior in a consistent way.`;
      case 'overlays':
        return `${entry.title} belongs to the overlay system and should be treated as transient UI. Keep open/close orchestration, focus handling, and result handling explicit in calling components.`;
      case 'foundations':
        return `${entry.title} defines baseline design-system behavior. Use it to keep visual language, spacing, and interaction consistency stable across all component surfaces.`;
      default:
        return `${entry.title} should be integrated with explicit state, predictable behavior, and token-based styling.`;
    }
  }

  private getAccessibilityBullets(entry: DocEntry): ReadonlyArray<string> {
    const shared = [
      'Verify all interactive flows are fully keyboard-accessible (Tab, Shift+Tab, Enter/Space, Escape where applicable).',
      'Use explicit labels, roles, and states so screen readers can announce purpose and current status.',
      'Ensure focus indicators remain visible with custom theming and meet contrast requirements.',
    ];

    if (entry.category === 'overlays') {
      return [
        ...shared,
        'Confirm focus moves into the overlay on open, remains trapped when required, and restores to a logical trigger on close.',
        'Validate backdrop and Escape behavior against your product accessibility expectations.',
      ];
    }

    if (entry.category === 'forms') {
      return [
        ...shared,
        'Link labels, hints, and errors to controls so validation context is announced correctly.',
        'Do not rely on color alone for invalid/success state communication.',
      ];
    }

    return [
      ...shared,
      'Test responsive layouts to keep touch targets, spacing, and text wrapping usable on small screens.',
    ];
  }

  resetStylingFilters(): void {
    this.tokenNameFilter.set('');
  }

  getSignalDescription(signalDoc: DocSignalMetadata): string {
    const componentId = this.entry()?.id;
    return getSignalDescriptionText(componentId ?? '', signalDoc.name, signalDoc.kind, signalDoc.type);
  }
}
