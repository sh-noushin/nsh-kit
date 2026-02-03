import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NshIconComponent } from '../../foundations/icon';

export type NshBreadcrumbSeparator = 'slash' | 'chevron' | 'dot' | 'custom';

export interface NshBreadcrumbItem {
  label: string;
  href?: string | null;
  disabled?: boolean;
  ariaLabel?: string | null;
}

type RenderedCrumb =
  | { kind: 'ellipsis'; key: 'ellipsis' }
  | { kind: 'item'; key: string; item: NshBreadcrumbItem; originalIndex: number };

@Component({
  selector: 'nsh-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshIconComponent],
  template: `
    <nav class="nsh-breadcrumb" [attr.aria-label]="ariaLabel()">
      <ol class="nsh-breadcrumb__list">
        @for (crumb of renderedCrumbs(); track crumb.key; let isLast = $last) {
          <li class="nsh-breadcrumb__item">
            @if (crumb.kind === 'ellipsis') {
              <span class="nsh-breadcrumb__text nsh-breadcrumb__text--ellipsis">…</span>
            } @else {
              @if (isLast) {
                <span
                  class="nsh-breadcrumb__text nsh-breadcrumb__text--current"
                  aria-current="page"
                  [attr.aria-label]="crumb.item.ariaLabel ?? null"
                >
                  {{ crumb.item.label }}
                </span>
              } @else {
                @if (crumb.item.href && !crumb.item.disabled) {
                  <a
                    class="nsh-breadcrumb__link"
                    [href]="crumb.item.href"
                    [attr.aria-label]="crumb.item.ariaLabel ?? null"
                  >
                    {{ crumb.item.label }}
                  </a>
                } @else {
                  <span class="nsh-breadcrumb__text" [attr.aria-label]="crumb.item.ariaLabel ?? null">
                    {{ crumb.item.label }}
                  </span>
                }
              }
            }

            @if (!isLast) {
              <span class="nsh-breadcrumb__separator" aria-hidden="true">
                @switch (separator()) {
                  @case ('chevron') {
                    <nsh-icon class="nsh-breadcrumb__separator-icon" name="chevron-right" size="1em" />
                  }
                  @case ('slash') {
                    <span class="nsh-breadcrumb__separator-char">/</span>
                  }
                  @case ('dot') {
                    <span class="nsh-breadcrumb__separator-char">·</span>
                  }
                  @case ('custom') {
                    <span class="nsh-breadcrumb__separator-custom"></span>
                  }
                }
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-breadcrumb-gap: var(--nsh-breadcrumb-gap, unset);
      --nsh-breadcrumb-separator-color: var(--nsh-breadcrumb-separator-color, unset);
      --nsh-breadcrumb-text-color: var(--nsh-breadcrumb-text-color, unset);
      --nsh-breadcrumb-text-color-current: var(--nsh-breadcrumb-text-color-current, unset);
      --nsh-breadcrumb-hover-color: var(--nsh-breadcrumb-hover-color, unset);
      --nsh-breadcrumb-font-size: var(--nsh-breadcrumb-font-size, unset);

      --_breadcrumb-gap: var(--nsh-breadcrumb-gap, var(--nsh-space-xs));
      --_breadcrumb-separator-color: var(--nsh-breadcrumb-separator-color, var(--nsh-color-text-muted));
      --_breadcrumb-text-color: var(--nsh-breadcrumb-text-color, var(--nsh-color-text-muted));
      --_breadcrumb-text-color-current: var(--nsh-breadcrumb-text-color-current, var(--nsh-color-text));
      --_breadcrumb-hover-color: var(--nsh-breadcrumb-hover-color, var(--nsh-color-primary));
      --_breadcrumb-font-size: var(--nsh-breadcrumb-font-size, var(--nsh-font-size-sm));

      --_breadcrumb-focus-ring: color-mix(
        in srgb,
        var(--nsh-color-outline) 65%,
        transparent
      );
    }

    .nsh-breadcrumb {
      font-family: var(--nsh-font-family);
      font-size: var(--_breadcrumb-font-size);
      line-height: var(--nsh-line-height-tight);
    }

    .nsh-breadcrumb__list {
      list-style: none;
      padding: 0;
      margin: 0;

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--_breadcrumb-gap);
      min-width: 0;
    }

    .nsh-breadcrumb__item {
      display: inline-flex;
      align-items: center;
      gap: var(--_breadcrumb-gap);
      min-width: 0;
    }

    .nsh-breadcrumb__link,
    .nsh-breadcrumb__text {
      color: var(--_breadcrumb-text-color);
      font: inherit;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nsh-breadcrumb__link {
      text-decoration: none;
      border-radius: var(--nsh-radius-sm);
      transition:
        color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    .nsh-breadcrumb__link:hover {
      color: var(--_breadcrumb-hover-color);
    }

    .nsh-breadcrumb__link:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--nsh-space-xxs) var(--_breadcrumb-focus-ring);
    }

    .nsh-breadcrumb__text--current {
      color: var(--_breadcrumb-text-color-current);
      font-weight: var(--nsh-font-weight-medium);
    }

    .nsh-breadcrumb__separator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--_breadcrumb-separator-color);
      user-select: none;
    }

    .nsh-breadcrumb__separator-icon {
      display: inline-flex;
      color: currentColor;
    }

    .nsh-breadcrumb__separator-char {
      display: inline-flex;
      color: currentColor;
    }

    .nsh-breadcrumb__separator-custom {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .nsh-breadcrumb__separator-custom::before {
      content: var(--nsh-breadcrumb-custom-separator-content, '›');
    }
  `,
})
export class NshBreadcrumbComponent {
  readonly items = input<NshBreadcrumbItem[]>([]);
  readonly separator = input<NshBreadcrumbSeparator>('chevron');
  readonly maxItems = input<number | null>(null);
  readonly ariaLabel = input<string>('Breadcrumb');

  readonly renderedCrumbs = computed<RenderedCrumb[]>(() => {
    const items = this.items();
    if (!items.length) {
      return [];
    }

    const maxItems = this.maxItems();
    if (maxItems == null || items.length <= maxItems) {
      return items.map((item, originalIndex) => ({
        kind: 'item' as const,
        key: `item-${originalIndex}`,
        item,
        originalIndex,
      }));
    }

    const tailCount = Math.max(1, maxItems - 1);
    const tailStart = Math.max(1, items.length - tailCount);
    const tail = items.slice(tailStart);

    return [
      {
        kind: 'item' as const,
        key: 'item-0',
        item: items[0]!,
        originalIndex: 0,
      },
      { kind: 'ellipsis' as const, key: 'ellipsis' },
      ...tail.map((item, idx) => ({
        kind: 'item' as const,
        key: `item-${tailStart + idx}`,
        item,
        originalIndex: tailStart + idx,
      })),
    ];
  });
}
