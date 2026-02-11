import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import {
  NshDividerComponent,
  NshInputComponent,
  NshListComponent,
  NshListItemComponent,
  NshSidenavComponent,
} from 'nsh-kit-ui';

import { DOC_SECTIONS, getDocEntry, type DocSection } from '../shared/doc-registry';
import type { DocEntry } from '../shared/doc-models';

@Component({
  selector: 'demo-showcase-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    NshDividerComponent,
    NshInputComponent,
    NshListComponent,
    NshListItemComponent,
    NshSidenavComponent,
  ],
  template: `
    <nsh-sidenav class="showcase-shell" [open]="true" mode="side" position="start">
      <div nshSidenavPanel class="showcase-shell__panel">
        <div class="showcase-shell__brand">
          <div class="showcase-shell__brand-mark">NSH</div>
          <div class="showcase-shell__brand-text">
            <span class="showcase-shell__brand-title">NSH Kit Showcase</span>
            <span class="showcase-shell__brand-subtitle">Component library docs</span>
          </div>
        </div>

        <div class="showcase-shell__search">
          <label class="showcase-shell__search-label" for="showcase-search">Search</label>
          <nsh-input
            id="showcase-search"
            placeholder="Find a component"
            [formControl]="searchControl"
          ></nsh-input>
        </div>

        @for (section of sections(); track section.category.id) {
          <div class="showcase-shell__section">
            <div class="showcase-shell__section-title">{{ section.category.title }}</div>

            <nsh-list role="navigation" [dense]="true" class="showcase-shell__nav-list">
              @for (entry of section.entries; track entry.id) {
                <nsh-list-item
                  [routerLink]="entry.route"
                  [selected]="isActive(entry)"
                  class="showcase-shell__nav-item"
                >
                  {{ entry.title }}
                </nsh-list-item>
              }
            </nsh-list>
          </div>

          <nsh-divider></nsh-divider>
        }
      </div>

      <div nshSidenavContent class="showcase-shell__content">
        <main class="showcase-shell__main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </nsh-sidenav>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: var(--nsh-color-surface);
        overflow-x: hidden;
      }

      .showcase-shell {
        min-height: 100vh;
        overflow-x: hidden;
      }

      .showcase-shell__panel {
        display: grid;
        gap: var(--nsh-space-lg);
        padding: var(--nsh-space-lg) var(--nsh-space-md);
        width: 360px;
        max-width: 100%;
        background: linear-gradient(180deg, var(--nsh-color-surface-1) 0%, #f7f9fd 100%);
        border-right: 1px solid color-mix(in srgb, var(--nsh-color-outline) 75%, transparent);
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
        overflow-x: hidden;
        box-sizing: border-box;
      }

      .showcase-shell__brand {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: var(--nsh-space-sm);
        padding: var(--nsh-space-sm);
        border-radius: var(--nsh-radius-lg);
        background: var(--nsh-color-surface-2);
        box-shadow: var(--nsh-elevation-1);
      }

      .showcase-shell__brand-mark {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        font-weight: var(--nsh-font-weight-semibold);
        font-size: var(--nsh-font-size-md);
        letter-spacing: 0.08em;
        color: #ffffff;
        background: linear-gradient(135deg, #1a73e8 0%, #0b5cad 100%);
        box-shadow: 0 10px 24px rgba(26, 115, 232, 0.25);
      }

      .showcase-shell__brand-text {
        display: grid;
        gap: 2px;
      }

      .showcase-shell__brand-title {
        font-size: var(--nsh-font-size-lg);
        font-weight: var(--nsh-font-weight-semibold);
        letter-spacing: 0.02em;
      }

      .showcase-shell__brand-subtitle {
        font-size: var(--nsh-font-size-sm);
        color: var(--nsh-color-text-muted);
      }

      .showcase-shell__search {
        margin-top: var(--nsh-space-sm);
        display: grid;
        gap: var(--nsh-space-xs);
        padding: var(--nsh-space-sm);
        border-radius: var(--nsh-radius-lg);
        background: #ffffff;
        box-shadow: var(--nsh-elevation-1);
      }

      .showcase-shell__search-label {
        font-size: var(--nsh-font-size-xs);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--nsh-color-text-muted);
        font-weight: var(--nsh-font-weight-semibold);
      }

      .showcase-shell__section {
        display: grid;
        gap: var(--nsh-space-sm);
        padding: var(--nsh-space-sm);
        border-radius: var(--nsh-radius-lg);
        background: #ffffff;
        box-shadow: var(--nsh-elevation-1);
      }

      .showcase-shell__section-title {
        font-size: var(--nsh-font-size-sm);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--nsh-color-text-muted);
        font-weight: var(--nsh-font-weight-semibold);
      }

      .showcase-shell__nav-list {
        display: grid;
        gap: 2px;
      }

      .showcase-shell__nav-item {
        border-radius: var(--nsh-radius-md);
        white-space: normal;
      }

      .showcase-shell__content {
        min-height: 100vh;
        display: grid;
        position: relative;
        overflow-x: hidden;
      }

      .showcase-shell__main {
        padding: clamp(24px, 4vw, 48px);
        width: 100%;
        max-width: 1120px;
        margin: 0 auto;
        animation: showcase-enter 280ms var(--nsh-motion-easing-standard) both;
        overflow-x: hidden;
      }

      @keyframes showcase-enter {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 960px) {
        .showcase-shell__main {
          padding: var(--nsh-space-lg);
        }

        .showcase-shell__panel {
          width: 100%;
        }
      }
    `,
  ],
})
export class ShowcaseShellComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);

  readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly searchValue = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: this.searchControl.value }
  );

  readonly currentId = signal<string | null>(null);

  readonly title = computed(() => getDocEntry(this.currentId())?.title ?? 'NSH Kit Showcase');

  readonly sections = computed<ReadonlyArray<DocSection>>(() => {
    const query = this.searchValue().trim().toLowerCase();

    if (!query) {
      return DOC_SECTIONS;
    }

    return DOC_SECTIONS.map((section) => ({
      category: section.category,
      entries: section.entries.filter((entry) => this.matchesQuery(entry, query)),
    })).filter((section) => section.entries.length > 0);
  });

  constructor() {
    this.updateCurrentId();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateCurrentId();
        this.scrollMainToTop();
      });
  }

  navigate(entry: DocEntry): void {
    this.router.navigateByUrl(entry.route);
  }

  isActive(entry: DocEntry): boolean {
    return this.currentId() === entry.id;
  }

  private matchesQuery(entry: DocEntry, query: string): boolean {
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query)
    );
  }

  private updateCurrentId(): void {
    const id = this.router.routerState.snapshot.root.firstChild?.firstChild?.paramMap.get('id') ?? null;
    this.currentId.set(id);
  }

  private scrollMainToTop(): void {
    const main = document.querySelector('.showcase-shell__main') as HTMLElement | null;
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.viewportScroller.scrollToPosition([0, 0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
