import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { NshListComponent, NshListItemComponent } from 'nsh-kit-ui';

import { DOC_CATEGORIES, DOC_SECTIONS, getDocEntry } from '../shared/doc-registry';
import type { DocCategoryId, DocEntry } from '../shared/doc-models';

@Component({
  selector: 'demo-showcase-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, NshListComponent, NshListItemComponent],
  template: `
    <div class="showcase-shell">
      <header class="showcase-shell__topbar">
        <div class="showcase-shell__brand">
          <div class="showcase-shell__brand-mark">N</div>
          <span class="showcase-shell__brand-title">NSH Kit</span>
        </div>

        <nav class="showcase-shell__topnav" aria-label="Doc categories">
          @for (category of categories; track category.id) {
            <a
              class="showcase-shell__topnav-link"
              [class.showcase-shell__topnav-link--active]="isCategoryActive(category.id)"
              [routerLink]="categoryRoute(category.id)"
            >
              {{ category.title }}
            </a>
          }
        </nav>
      </header>

      <div class="showcase-shell__layout">
        <aside class="showcase-shell__panel">
          <div class="showcase-shell__panel-inner">
            <nsh-list role="navigation" class="showcase-shell__nav-list">
              @for (entry of visibleEntries(); track entry.id) {
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
        </aside>

        <section class="showcase-shell__content">
          <main class="showcase-shell__main">
            <router-outlet></router-outlet>
          </main>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f3f5fa;
        color: #1e2433;
        overflow-x: hidden;
      }

      .showcase-shell {
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        background: #f3f5fa;
      }

      .showcase-shell__topbar {
        display: flex;
        align-items: center;
        gap: clamp(16px, 3vw, 40px);
        min-height: 76px;
        padding: 0 clamp(16px, 3vw, 40px);
        background: #dce6fc;
        border-bottom: 1px solid #c4d1ea;
      }

      .showcase-shell__brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #1f4da0;
      }

      .showcase-shell__brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.03em;
        color: #ffffff;
        background: linear-gradient(160deg, #2076e8, #0f57c2);
      }

      .showcase-shell__brand-title {
        font-size: 1.45rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        white-space: nowrap;
      }

      .showcase-shell__topnav {
        display: inline-flex;
        align-items: center;
        gap: 12px;
      }

      .showcase-shell__topnav-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        padding: 0 24px;
        border-radius: 999px;
        text-decoration: none;
        color: #1a4f9d;
        font-size: 1.12rem;
        font-weight: 600;
        transition:
          background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
          color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
      }

      .showcase-shell__topnav-link:hover {
        background: #ceddf9;
      }

      .showcase-shell__topnav-link--active {
        color: #0f4ca8;
        background: #c2d5fb;
      }

      .showcase-shell__layout {
        min-height: calc(100vh - 77px);
        display: grid;
        grid-template-columns: 328px minmax(0, 1fr);
      }

      .showcase-shell__panel {
        border-right: 1px solid #cfd5e2;
        background: #f3f5fa;
        min-width: 0;
      }

      .showcase-shell__panel-inner {
        height: calc(100vh - 77px);
        overflow-y: auto;
        padding: 18px 10px 28px;
      }

      .showcase-shell__nav-list {
        --nsh-list-padding-y: 0px;
        --nsh-list-item-height: 56px;
        --nsh-list-item-radius: 999px;
        --nsh-list-item-bg: transparent;
        --nsh-list-item-bg-hover: #e6ebf9;
        --nsh-list-item-bg-selected: #d4e0fa;
        --nsh-list-item-fg: #1f2533;
        --nsh-list-item-fg-muted: #1f2533;
        --nsh-list-focus-ring: rgba(26, 96, 195, 0.32);
        display: grid;
        gap: 2px;
      }

      .showcase-shell__nav-item {
        font-size: 1.18rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        white-space: nowrap;
      }

      .showcase-shell__content {
        min-width: 0;
        background: #f4f6fb;
        overflow-x: hidden;
      }

      .showcase-shell__main {
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        padding: clamp(18px, 2.8vw, 36px) clamp(20px, 4vw, 56px) 64px;
        overflow-x: hidden;
        animation: showcase-enter 220ms var(--nsh-motion-easing-standard) both;
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

      @media (max-width: 1100px) {
        .showcase-shell__layout {
          grid-template-columns: 286px minmax(0, 1fr);
        }

        .showcase-shell__topnav-link {
          height: 44px;
          padding: 0 18px;
          font-size: 1.02rem;
        }
      }

      @media (max-width: 860px) {
        .showcase-shell__topbar {
          align-items: flex-start;
          flex-direction: column;
          padding: 12px 16px;
          gap: 12px;
        }

        .showcase-shell__topnav {
          width: 100%;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .showcase-shell__layout {
          grid-template-columns: 1fr;
          min-height: 0;
        }

        .showcase-shell__panel {
          border-right: 0;
          border-bottom: 1px solid #cfd5e2;
        }

        .showcase-shell__panel-inner {
          height: auto;
          max-height: 40vh;
        }

        .showcase-shell__nav-item {
          font-size: 1.04rem;
        }

        .showcase-shell__main {
          padding: 20px 16px 40px;
        }
      }
    `,
  ],
})
export class ShowcaseShellComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);

  private readonly routeId = toSignal(
    this.activatedRoute.firstChild
      ? this.activatedRoute.firstChild.paramMap.pipe(map((params) => params.get('id') ?? null))
      : this.router.events.pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => this.extractIdFromRouter())
        ),
    { initialValue: null }
  );

  readonly currentId = computed(() => this.routeId());
  readonly categories = DOC_CATEGORIES;
  readonly currentEntry = computed(() => getDocEntry(this.currentId()));
  readonly activeCategory = computed<DocCategoryId>(
    () => this.currentEntry()?.category ?? this.categories[0]?.id ?? 'components'
  );
  readonly visibleEntries = computed<ReadonlyArray<DocEntry>>(() => {
    const section = DOC_SECTIONS.find((candidate) => candidate.category.id === this.activeCategory());
    return section?.entries ?? [];
  });

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.scrollMainToTop();
      });
  }

  isActive(entry: DocEntry): boolean {
    return this.currentId() === entry.id;
  }

  isCategoryActive(categoryId: DocCategoryId): boolean {
    return this.activeCategory() === categoryId;
  }

  categoryRoute(categoryId: DocCategoryId): string {
    const section = DOC_SECTIONS.find((candidate) => candidate.category.id === categoryId);
    return section?.entries[0]?.route ?? '/showcase/button';
  }

  private extractIdFromRouter(): string | null {
    // Try to find the :id param from the activated route tree
    let route = this.activatedRoute;
    while (route) {
      const id = route.snapshot.paramMap.get('id');
      if (id) {
        return id;
      }
      route = route.firstChild as ActivatedRoute;
    }
    return null;
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
