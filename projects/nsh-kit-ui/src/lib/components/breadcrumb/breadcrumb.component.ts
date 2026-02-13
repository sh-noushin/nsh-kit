import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NshIconComponent } from '../../foundations/icon';

export type NshBreadcrumbSeparator = 'slash' | 'chevron' | 'dot' | 'custom';
export type NshBreadcrumbVariant = 'minimal' | 'soft' | 'solid' | 'segmented' | 'steps';
export type NshBreadcrumbElevation = 'flat' | 'raised';

export type NshBreadcrumbIconValue = string | { name?: string | null; svg?: string | null };

type ResolvedBreadcrumbIcon =
  | { kind: 'name'; value: string }
  | { kind: 'svg'; value: SafeHtml };

export interface NshBreadcrumbItem {
  id?: string;
  label: string;
  href?: string | null;
  disabled?: boolean;
  ariaLabel?: string | null;
  icon?: NshBreadcrumbIconValue | null;
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
    <nav
      class="nsh-breadcrumb"
      [attr.aria-label]="ariaLabel()"
      [attr.data-variant]="variant()"
      [class.nsh-breadcrumb--raised]="elevation() === 'raised'"
      [class.nsh-breadcrumb--shadow]="shadow()"
      [class.nsh-breadcrumb--compact]="compact()"
      [style.--nsh-breadcrumb-accent]="accentColor() ?? null"
    >
      <ol class="nsh-breadcrumb__list">
        @for (crumb of renderedCrumbs(); track crumb.key; let isLast = $last) {
          <li
            class="nsh-breadcrumb__item"
            [class.nsh-breadcrumb__item--active]="crumb.kind === 'item' && isStepActive(crumb.originalIndex)"
          >
            @if (crumb.kind === 'ellipsis') {
              <span class="nsh-breadcrumb__text nsh-breadcrumb__text--ellipsis">…</span>
            } @else {
              @let itemIcon = resolveItemIcon(crumb.item, crumb.originalIndex);
              @if (isLast) {
                <span
                  class="nsh-breadcrumb__text nsh-breadcrumb__text--current"
                  aria-current="page"
                  [attr.aria-label]="crumb.item.ariaLabel ?? null"
                >
                  <span class="nsh-breadcrumb__step-index">{{ crumb.originalIndex + 1 }}</span>
                  @if (itemIcon) {
                    @if (itemIcon.kind === 'svg') {
                      <span class="nsh-breadcrumb__item-icon nsh-breadcrumb__item-icon--svg" [innerHTML]="itemIcon.value"></span>
                    } @else {
                      <nsh-icon class="nsh-breadcrumb__item-icon" [name]="itemIcon.value" size="1em" />
                    }
                  }
                  {{ crumb.item.label }}
                </span>
              } @else {
                @if (crumb.item.href && !crumb.item.disabled) {
                  <a
                    class="nsh-breadcrumb__link"
                    [href]="crumb.item.href"
                    [attr.aria-label]="crumb.item.ariaLabel ?? null"
                  >
                    <span class="nsh-breadcrumb__step-index">{{ crumb.originalIndex + 1 }}</span>
                    @if (itemIcon) {
                      @if (itemIcon.kind === 'svg') {
                        <span class="nsh-breadcrumb__item-icon nsh-breadcrumb__item-icon--svg" [innerHTML]="itemIcon.value"></span>
                      } @else {
                        <nsh-icon class="nsh-breadcrumb__item-icon" [name]="itemIcon.value" size="1em" />
                      }
                    }
                    {{ crumb.item.label }}
                  </a>
                } @else {
                  <span class="nsh-breadcrumb__text" [attr.aria-label]="crumb.item.ariaLabel ?? null">
                    <span class="nsh-breadcrumb__step-index">{{ crumb.originalIndex + 1 }}</span>
                    @if (itemIcon) {
                      @if (itemIcon.kind === 'svg') {
                        <span class="nsh-breadcrumb__item-icon nsh-breadcrumb__item-icon--svg" [innerHTML]="itemIcon.value"></span>
                      } @else {
                        <nsh-icon class="nsh-breadcrumb__item-icon" [name]="itemIcon.value" size="1em" />
                      }
                    }
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
      --nsh-breadcrumb-surface: var(--nsh-breadcrumb-surface, unset);
      --nsh-breadcrumb-item-bg: var(--nsh-breadcrumb-item-bg, unset);
      --nsh-breadcrumb-item-bg-current: var(--nsh-breadcrumb-item-bg-current, unset);
      --nsh-breadcrumb-shadow: var(--nsh-breadcrumb-shadow, unset);
      --nsh-breadcrumb-item-radius: var(--nsh-breadcrumb-item-radius, unset);
      --nsh-breadcrumb-accent: var(--nsh-breadcrumb-accent, unset);
      --nsh-breadcrumb-item-padding-inline: var(--nsh-breadcrumb-item-padding-inline, unset);
      --nsh-breadcrumb-item-padding-block: var(--nsh-breadcrumb-item-padding-block, unset);
      --nsh-breadcrumb-item-min-width: var(--nsh-breadcrumb-item-min-width, unset);

      --_breadcrumb-gap: var(--nsh-breadcrumb-gap, var(--nsh-space-xs));
      --_breadcrumb-separator-color: var(--nsh-breadcrumb-separator-color, var(--nsh-color-text-muted));
      --_breadcrumb-text-color: var(--nsh-breadcrumb-text-color, var(--nsh-color-text-muted));
      --_breadcrumb-text-color-current: var(--nsh-breadcrumb-text-color-current, var(--nsh-color-text));
      --_breadcrumb-hover-color: var(--nsh-breadcrumb-hover-color, var(--nsh-color-primary));
      --_breadcrumb-font-size: var(--nsh-breadcrumb-font-size, var(--nsh-font-size-sm));
      --_breadcrumb-surface: var(
        --nsh-breadcrumb-surface,
        color-mix(in srgb, var(--nsh-color-surface) 94%, var(--nsh-color-primary) 6%)
      );
      --_breadcrumb-item-bg: var(
        --nsh-breadcrumb-item-bg,
        color-mix(in srgb, var(--nsh-color-surface) 86%, var(--nsh-color-primary) 14%)
      );
      --_breadcrumb-item-bg-current: var(
        --nsh-breadcrumb-item-bg-current,
        color-mix(in srgb, var(--nsh-color-primary) 22%, var(--nsh-color-surface) 78%)
      );
      --_breadcrumb-item-radius: var(--nsh-breadcrumb-item-radius, var(--nsh-radius-pill));
      --_breadcrumb-item-padding-inline: var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-sm));
      --_breadcrumb-item-padding-block: var(--nsh-breadcrumb-item-padding-block, var(--nsh-space-xxs));
      --_breadcrumb-item-min-width: var(--nsh-breadcrumb-item-min-width, auto);
      --_breadcrumb-shadow: var(
        --nsh-breadcrumb-shadow,
        0 8px 24px color-mix(in srgb, var(--nsh-color-shadow) 20%, transparent)
      );

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
      --_breadcrumb-accent: var(--nsh-breadcrumb-accent, var(--nsh-color-primary));
    }

    .nsh-breadcrumb--raised .nsh-breadcrumb__list {
      box-shadow: var(--_breadcrumb-shadow);
    }

    .nsh-breadcrumb--shadow .nsh-breadcrumb__list {
      box-shadow: var(--_breadcrumb-shadow);
    }

    .nsh-breadcrumb--compact {
      --_breadcrumb-gap: var(--nsh-space-xxs);
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
      display: inline-flex;
      align-items: center;
      gap: var(--nsh-space-xxs);
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nsh-breadcrumb__item-icon {
      flex: 0 0 auto;
      color: inherit;
      font-size: 0.92em;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transform: translateY(-0.02em);
      margin-inline-end: 0.22em;
    }

    .nsh-breadcrumb__item-icon--svg {
      display: inline-flex;
      width: 1em;
      height: 1em;
      align-items: center;
      justify-content: center;
    }

    .nsh-breadcrumb__item-icon--svg :where(svg) {
      width: 100%;
      height: 100%;
      fill: currentColor;
      stroke: currentColor;
    }

    .nsh-breadcrumb__step-index {
      display: none;
      width: 1.55rem;
      height: 1.55rem;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 2px solid currentColor;
      font-size: 0.78em;
      font-weight: var(--nsh-font-weight-semibold);
      line-height: 1;
      flex: 0 0 auto;
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

    .nsh-breadcrumb[data-variant='minimal'] .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='minimal'] .nsh-breadcrumb__text {
      padding-inline: var(--nsh-space-sm);
      min-height: 2.2rem;
      border-radius: var(--nsh-radius-pill);
      background: color-mix(in srgb, var(--_breadcrumb-accent) 8%, var(--nsh-color-surface) 92%);
    }

    .nsh-breadcrumb[data-variant='soft'] .nsh-breadcrumb__list {
      padding: var(--nsh-space-xs) var(--nsh-space-sm);
      border-radius: var(--nsh-radius-pill);
      background: var(--_breadcrumb-surface);
      border: 1px solid color-mix(in srgb, var(--nsh-color-border) 68%, transparent);
    }

    .nsh-breadcrumb[data-variant='soft'] .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='soft'] .nsh-breadcrumb__text {
      padding: var(--_breadcrumb-item-padding-block) var(--_breadcrumb-item-padding-inline);
      min-width: var(--_breadcrumb-item-min-width);
      border-radius: var(--_breadcrumb-item-radius);
      background: var(--_breadcrumb-item-bg);
      color: var(--_breadcrumb-text-color-current);
      justify-content: center;
      text-align: center;
    }

    .nsh-breadcrumb[data-variant='soft'] .nsh-breadcrumb__text--current {
      background: var(--_breadcrumb-item-bg-current);
      font-weight: var(--nsh-font-weight-semibold);
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__list {
      padding: var(--nsh-space-xs) var(--nsh-space-sm);
      border-radius: var(--nsh-radius-lg);
      background: color-mix(in srgb, var(--nsh-color-primary) 86%, var(--nsh-color-surface) 14%);
      width: 100%;
      display: flex;
      align-items: center;
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__item {
      flex: 1 1 0;
      min-width: 0;
      justify-content: center;
      position: relative;
      gap: 0;
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__text {
      color: var(--nsh-color-surface);
      justify-content: center;
      text-align: center;
      width: 100%;
      min-width: 0;
      padding: var(--_breadcrumb-item-padding-block, var(--nsh-space-xxs))
        var(--_breadcrumb-item-padding-inline, var(--nsh-space-sm));
      border-radius: var(--nsh-radius-pill);
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__item:not(.nsh-breadcrumb__item--active) .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__item:not(.nsh-breadcrumb__item--active) .nsh-breadcrumb__text {
      color: color-mix(in srgb, var(--nsh-color-surface) 84%, transparent);
      background: transparent;
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__item--active .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__item--active .nsh-breadcrumb__text {
      color: var(--nsh-color-surface);
      background: color-mix(in srgb, var(--nsh-color-surface) 34%, var(--_breadcrumb-accent) 66%);
      border: 1px solid color-mix(in srgb, var(--nsh-color-surface) 26%, transparent);
      font-weight: var(--nsh-font-weight-semibold);
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__separator {
      display: none;
    }

    .nsh-breadcrumb[data-variant='solid'] .nsh-breadcrumb__item:not(:last-child)::after {
      content: '/';
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
      color: color-mix(in srgb, var(--nsh-color-surface) 82%, transparent);
      pointer-events: none;
    }

    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__list {
      gap: 0;
      overflow: hidden;
      border-radius: var(--nsh-radius-lg);
      border: 1px solid color-mix(in srgb, var(--nsh-color-border) 68%, transparent);
      background: color-mix(in srgb, var(--nsh-color-surface) 92%, var(--nsh-color-primary) 8%);
    }

    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__item {
      gap: 0;
    }

    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__separator {
      display: none;
    }

    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__text {
      position: relative;
      padding:
        var(--nsh-breadcrumb-item-padding-block, var(--nsh-space-xs))
        calc(var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-md)) + 6px)
        var(--nsh-breadcrumb-item-padding-block, var(--nsh-space-xs))
        var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-md));
      min-width: var(--_breadcrumb-item-min-width);
      background: var(--_breadcrumb-item-bg);
      border-radius: 0;
      margin-right: -8px;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%);
      color: var(--_breadcrumb-text-color-current);
      z-index: 1;
      justify-content: center;
      text-align: center;
    }

    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__item:first-child .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__item:first-child .nsh-breadcrumb__text {
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
      padding-left: calc(
        var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-md)) + var(--nsh-space-sm)
      );
    }

    .nsh-breadcrumb[data-variant='segmented'] .nsh-breadcrumb__text--current {
      background: var(--_breadcrumb-item-bg-current);
      color: var(--nsh-color-surface);
      font-weight: var(--nsh-font-weight-semibold);
      z-index: 2;
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__list {
      gap: 0;
      overflow: hidden;
      border-radius: var(--nsh-radius-md);
      border: 1px solid color-mix(in srgb, var(--_breadcrumb-accent) 35%, var(--nsh-color-border) 65%);
      background: var(--nsh-color-surface);
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__item {
      gap: 0;
      color: var(--_breadcrumb-accent);
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__separator {
      display: none;
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__text {
      position: relative;
      padding:
        var(--nsh-breadcrumb-item-padding-block, var(--nsh-space-xs))
        calc(var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-md)) + 8px)
        var(--nsh-breadcrumb-item-padding-block, var(--nsh-space-xs))
        var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-md));
      min-width: var(--_breadcrumb-item-min-width);
      margin-right: -6px;
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%);
      background: var(--nsh-color-surface);
      color: var(--_breadcrumb-accent);
      border-inline-end: 1px solid color-mix(in srgb, var(--_breadcrumb-accent) 45%, transparent);
      z-index: 1;
      text-decoration: none;
      gap: var(--nsh-space-xs);
      justify-content: center;
      text-align: center;
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__item:first-child .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__item:first-child .nsh-breadcrumb__text {
      clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%);
      padding-left: var(--nsh-breadcrumb-item-padding-inline, var(--nsh-space-md));
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__step-index {
      display: inline-flex;
      background: color-mix(in srgb, var(--_breadcrumb-accent) 16%, var(--nsh-color-surface) 84%);
      color: var(--_breadcrumb-accent);
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__item--active .nsh-breadcrumb__link,
    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__item--active .nsh-breadcrumb__text {
      background: var(--_breadcrumb-accent);
      color: var(--nsh-color-surface);
      border-inline-end-color: color-mix(in srgb, var(--_breadcrumb-accent) 60%, transparent);
      z-index: 2;
    }

    .nsh-breadcrumb[data-variant='steps'] .nsh-breadcrumb__item--active .nsh-breadcrumb__step-index {
      background: color-mix(in srgb, var(--_breadcrumb-accent) 24%, var(--nsh-color-surface) 76%);
      color: var(--_breadcrumb-accent);
      border-color: color-mix(in srgb, var(--_breadcrumb-accent) 70%, transparent);
    }
  `,
})
export class NshBreadcrumbComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly items = input<NshBreadcrumbItem[]>([]);
  readonly separator = input<NshBreadcrumbSeparator>('chevron');
  readonly variant = input<NshBreadcrumbVariant>('minimal');
  readonly elevation = input<NshBreadcrumbElevation>('flat');
  readonly shadow = input(false, { transform: booleanAttribute });
  readonly compact = input(false, { transform: booleanAttribute });
  readonly activeIndex = input<number | null>(null);
  readonly accentColor = input<string | null>(null);
  readonly itemIcons = input<Record<string, NshBreadcrumbIconValue> | null>(null);
  readonly maxItems = input<number | null>(null);
  readonly ariaLabel = input<string>('Breadcrumb');

  resolveItemIcon(item: NshBreadcrumbItem, index: number): ResolvedBreadcrumbIcon | null {
    if (item.icon) {
      const resolved = this.normalizeIconValue(item.icon);
      if (resolved) {
        return resolved;
      }
    }

    const icons = this.itemIcons();
    if (!icons) {
      return null;
    }

    if (item.id && icons[item.id]) {
      const byId = this.normalizeIconValue(icons[item.id]);
      if (byId) {
        return byId;
      }
    }

    if (icons[item.label]) {
      const byLabel = this.normalizeIconValue(icons[item.label]);
      if (byLabel) {
        return byLabel;
      }
    }

    const byIndex = icons[`${index}`];
    return this.normalizeIconValue(byIndex ?? null);
  }

  private normalizeIconValue(value: NshBreadcrumbIconValue | null | undefined): ResolvedBreadcrumbIcon | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      if (trimmed.startsWith('<svg')) {
        return { kind: 'svg', value: this.sanitizer.bypassSecurityTrustHtml(trimmed) };
      }

      return { kind: 'name', value: trimmed };
    }

    const svg = value.svg?.trim();
    if (svg) {
      return { kind: 'svg', value: this.sanitizer.bypassSecurityTrustHtml(svg) };
    }

    const name = value.name?.trim();
    if (name) {
      return { kind: 'name', value: name };
    }

    return null;
  }

  isStepActive(index: number): boolean {
    const selected = this.activeIndex();
    if (selected != null) {
      return index === selected;
    }
    return index === this.items().length - 1;
  }

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
