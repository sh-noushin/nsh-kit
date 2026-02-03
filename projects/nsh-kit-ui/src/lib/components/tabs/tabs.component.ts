import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChildren,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { NshIconComponent } from '../../foundations/icon';
import { NshTabComponent } from './tab.component';

export type NshTabsVariant = 'underline' | 'pill';
export type NshTabsAlign = 'start' | 'center' | 'end' | 'stretch';
export type NshTabsSize = 'sm' | 'md' | 'lg';
export type NshTabsColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral';

function clampIndex(index: number, length: number): number {
  if (!Number.isFinite(index)) {
    return 0;
  }
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(Math.floor(index), 0), length - 1);
}

function findFirstEnabled(tabs: readonly NshTabComponent[]): number {
  return tabs.findIndex((t) => !t.disabled());
}

function findNextEnabled(tabs: readonly NshTabComponent[], from: number, delta: 1 | -1): number {
  if (tabs.length === 0) {
    return -1;
  }

  for (let step = 1; step <= tabs.length; step++) {
    const idx = (from + delta * step + tabs.length) % tabs.length;
    if (!tabs[idx]?.disabled()) {
      return idx;
    }
  }

  return -1;
}

function findLastEnabled(tabs: readonly NshTabComponent[]): number {
  for (let idx = tabs.length - 1; idx >= 0; idx--) {
    if (!tabs[idx]?.disabled()) {
      return idx;
    }
  }
  return -1;
}

@Component({
  selector: 'nsh-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NshIconComponent],
  host: {
    '[class.nsh-tabs-host]': 'true',
    '[class.nsh-tabs-host--underline]': "variant() === 'underline'",
    '[class.nsh-tabs-host--pill]': "variant() === 'pill'",

    '[class.nsh-tabs-host--align-start]': "align() === 'start'",
    '[class.nsh-tabs-host--align-center]': "align() === 'center'",
    '[class.nsh-tabs-host--align-end]': "align() === 'end'",
    '[class.nsh-tabs-host--align-stretch]': "align() === 'stretch'",

    '[class.nsh-tabs-host--sm]': "size() === 'sm'",
    '[class.nsh-tabs-host--md]': "size() === 'md'",
    '[class.nsh-tabs-host--lg]': "size() === 'lg'",

    '[class.nsh-tabs-host--primary]': "color() === 'primary'",
    '[class.nsh-tabs-host--secondary]': "color() === 'secondary'",
    '[class.nsh-tabs-host--tertiary]': "color() === 'tertiary'",
    '[class.nsh-tabs-host--success]': "color() === 'success'",
    '[class.nsh-tabs-host--warn]': "color() === 'warn'",
    '[class.nsh-tabs-host--danger]': "color() === 'danger'",
    '[class.nsh-tabs-host--neutral]': "color() === 'neutral'",
  },
  template: `
    <div class="nsh-tabs">
      <div
        class="nsh-tabs__tablist"
        role="tablist"
        [attr.aria-label]="ariaLabel() ?? null"
        (keydown)="onKeydown($event)"
      >
        @for (tab of tabs(); track tab; let i = $index) {
          <button
            #tabButton
            type="button"
            class="nsh-tabs__tab"
            role="tab"
            [id]="tabId(tab)"
            [disabled]="tab.disabled()"
            [attr.aria-selected]="activeIndex() === i ? 'true' : 'false'"
            [attr.aria-controls]="panelId(tab)"
            [attr.tabindex]="tabIndexFor(i)"
            [class.nsh-tabs__tab--active]="activeIndex() === i"
            [class.nsh-tabs__tab--disabled]="tab.disabled()"
            (focus)="onTabFocus(i)"
            (click)="onTabClick(i)"
          >
            @if (tab.icon(); as iconName) {
              <nsh-icon class="nsh-tabs__icon" [name]="iconName" size="1em"></nsh-icon>
            }
            <span class="nsh-tabs__label">{{ tab.label() }}</span>
          </button>
        }
      </div>

      <div class="nsh-tabs__panels">
        @if (lazy()) {
          @if (activeTab(); as tab) {
            <div
              class="nsh-tabs__panel"
              role="tabpanel"
              [id]="panelId(tab)"
              [attr.aria-labelledby]="tabId(tab)"
            >
              <ng-container [ngTemplateOutlet]="tab.contentTpl"></ng-container>
            </div>
          }
        } @else {
          @for (tab of tabs(); track tab; let i = $index) {
            <div
              class="nsh-tabs__panel"
              role="tabpanel"
              [id]="panelId(tab)"
              [attr.aria-labelledby]="tabId(tab)"
              [attr.hidden]="activeIndex() === i ? null : ''"
              [class.nsh-tabs__panel--active]="activeIndex() === i"
            >
              <ng-container [ngTemplateOutlet]="tab.contentTpl"></ng-container>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-tabs-height: var(--nsh-tabs-height, unset);
      --nsh-tabs-gap: var(--nsh-tabs-gap, unset);
      --nsh-tabs-radius: var(--nsh-tabs-radius, unset);
      --nsh-tabs-indicator-color: var(--nsh-tabs-indicator-color, unset);
      --nsh-tabs-indicator-height: var(--nsh-tabs-indicator-height, unset);
      --nsh-tabs-text-color: var(--nsh-tabs-text-color, unset);
      --nsh-tabs-text-color-active: var(--nsh-tabs-text-color-active, unset);
      --nsh-tabs-bg: var(--nsh-tabs-bg, unset);
      --nsh-tabs-focus-ring: var(--nsh-tabs-focus-ring, unset);

      --_tabs-height: var(--nsh-density-control-height);
      --_tabs-gap: var(--nsh-tabs-gap, var(--nsh-space-sm));
      --_tabs-radius: var(--nsh-tabs-radius, var(--nsh-radius-pill));
      --_tabs-indicator-height: var(--nsh-tabs-indicator-height, var(--nsh-space-xs));

      --_tabs-accent: var(--nsh-color-primary);
      --_tabs-indicator: var(--nsh-tabs-indicator-color, var(--_tabs-accent));

      --_tabs-text: var(--nsh-tabs-text-color, var(--nsh-color-text-muted));
      --_tabs-text-active: var(--nsh-tabs-text-color-active, var(--nsh-color-text));

      --_tabs-bg: var(
        --nsh-tabs-bg,
        color-mix(in srgb, var(--nsh-color-surface-1) 85%, var(--nsh-color-surface))
      );

      --_tabs-focus-ring: var(
        --nsh-tabs-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 65%, transparent)
      );

      --_tabs-pad-x: var(--nsh-density-padding-inline);
      --_tabs-font-size: var(--nsh-font-size-md);
      --_tabs-duration: var(--nsh-motion-duration-fast);
      --_tabs-easing: var(--nsh-motion-easing-standard);
    }

    :host(.nsh-tabs-host--sm) {
      --_tabs-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_tabs-font-size: var(--nsh-font-size-sm);
    }

    :host(.nsh-tabs-host--md) {
      --_tabs-height: var(--nsh-density-control-height);
      --_tabs-font-size: var(--nsh-font-size-md);
    }

    :host(.nsh-tabs-host--lg) {
      --_tabs-height: calc(var(--nsh-density-control-height) + var(--nsh-space-sm));
      --_tabs-font-size: var(--nsh-font-size-lg);
    }

    /* Color mapping */
    :host(.nsh-tabs-host--primary) {
      --_tabs-accent: var(--nsh-color-primary);
    }
    :host(.nsh-tabs-host--secondary) {
      --_tabs-accent: var(--nsh-color-secondary);
    }
    :host(.nsh-tabs-host--tertiary) {
      --_tabs-accent: var(--nsh-color-tertiary);
    }
    :host(.nsh-tabs-host--success) {
      --_tabs-accent: var(--nsh-color-success);
    }
    :host(.nsh-tabs-host--warn) {
      --_tabs-accent: var(--nsh-color-warn);
    }
    :host(.nsh-tabs-host--danger) {
      --_tabs-accent: var(--nsh-color-danger);
    }
    :host(.nsh-tabs-host--neutral) {
      --_tabs-accent: var(--nsh-color-text);
    }

    .nsh-tabs {
      display: grid;
      gap: var(--_tabs-gap);
      min-width: 0;
      font-family: var(--nsh-font-family);
    }

    .nsh-tabs__tablist {
      display: flex;
      align-items: stretch;
      gap: var(--_tabs-gap);
      min-width: 0;
    }

    :host(.nsh-tabs-host--align-start) .nsh-tabs__tablist {
      justify-content: flex-start;
    }

    :host(.nsh-tabs-host--align-center) .nsh-tabs__tablist {
      justify-content: center;
    }

    :host(.nsh-tabs-host--align-end) .nsh-tabs__tablist {
      justify-content: flex-end;
    }

    :host(.nsh-tabs-host--align-stretch) .nsh-tabs__tablist {
      justify-content: stretch;
    }

    :host(.nsh-tabs-host--align-stretch) .nsh-tabs__tab {
      flex: 1 1 0;
    }

    .nsh-tabs__tab {
      position: relative;
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--_tabs-text);
      cursor: pointer;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--nsh-space-xs);

      min-height: var(--nsh-tabs-height, var(--_tabs-height));
      padding-inline: var(--_tabs-pad-x);
      font-size: var(--_tabs-font-size);
      font-weight: var(--nsh-font-weight-medium);
      line-height: var(--nsh-line-height-tight);

      border-radius: var(--_tabs-radius);
      user-select: none;
      min-width: 0;
      white-space: nowrap;

      transition:
        color var(--_tabs-duration) var(--_tabs-easing),
        background var(--_tabs-duration) var(--_tabs-easing),
        box-shadow var(--_tabs-duration) var(--_tabs-easing);
    }

    .nsh-tabs__label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nsh-tabs__icon {
      display: inline-flex;
      color: currentColor;
    }

    .nsh-tabs__tab:focus-visible {
      box-shadow: 0 0 0 var(--nsh-space-xs) var(--_tabs-focus-ring);
      outline: none;
    }

    .nsh-tabs__tab--disabled {
      cursor: default;
      opacity: 0.6;
    }

    .nsh-tabs__tab--active {
      color: var(--_tabs-text-active);
    }

    /* Variant: underline */
    :host(.nsh-tabs-host--underline) .nsh-tabs__tab {
      border-radius: 0;
    }

    :host(.nsh-tabs-host--underline) .nsh-tabs__tab::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      bottom: 0;
      height: var(--_tabs-indicator-height);
      background: transparent;
      border-radius: var(--_tabs-indicator-height);
      transition: background var(--_tabs-duration) var(--_tabs-easing);
    }

    :host(.nsh-tabs-host--underline) .nsh-tabs__tab--active::after {
      background: var(--_tabs-indicator);
    }

    /* Variant: pill */
    :host(.nsh-tabs-host--pill) .nsh-tabs__tablist {
      background: var(--_tabs-bg);
      border-radius: var(--_tabs-radius);
      padding: var(--nsh-space-xs);
    }

    :host(.nsh-tabs-host--pill) .nsh-tabs__tab {
      border-radius: var(--_tabs-radius);
    }

    :host(.nsh-tabs-host--pill) .nsh-tabs__tab--active {
      background: color-mix(in srgb, var(--_tabs-indicator) 18%, transparent);
    }

    .nsh-tabs__panels {
      min-width: 0;
    }

    .nsh-tabs__panel {
      min-width: 0;
    }

    .nsh-tabs__panel[hidden] {
      display: none;
    }
  `,
})
export class NshTabsComponent {
  @ViewChildren('tabButton', { read: ElementRef })
  private readonly tabButtons?: { toArray(): Array<ElementRef<HTMLButtonElement>> };

  readonly selectedIndex = input(0);
  readonly variant = input<NshTabsVariant>('underline');
  readonly align = input<NshTabsAlign>('start');
  readonly size = input<NshTabsSize>('md');
  readonly color = input<NshTabsColor>('primary');
  readonly lazy = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly selectedIndexChange = output<number>();

  private readonly tabsQuery = contentChildren(NshTabComponent);

  readonly tabs = computed(() => this.tabsQuery());

  readonly activeIndex = computed(() => {
    const tabs = this.tabs();
    if (tabs.length === 0) {
      return -1;
    }

    const desired = clampIndex(this.selectedIndex(), tabs.length);
    if (!tabs[desired]?.disabled()) {
      return desired;
    }

    const first = findFirstEnabled(tabs);
    return first;
  });

  readonly activeTab = computed(() => {
    const tabs = this.tabs();
    const idx = this.activeIndex();
    return idx >= 0 ? (tabs[idx] ?? null) : null;
  });

  private readonly focusedIndex = signal(0);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const active = this.activeIndex();

      if (tabs.length === 0) {
        this.focusedIndex.set(0);
        return;
      }

      const current = this.focusedIndex();
      const clamped = clampIndex(current, tabs.length);

      const next = !tabs[clamped]?.disabled() ? clamped : active;
      if (next >= 0) {
        this.focusedIndex.set(next);
      }
    });
  }

  tabId(tab: NshTabComponent): string {
    return `${tab.resolvedId()}-tab`;
  }

  panelId(tab: NshTabComponent): string {
    return `${tab.resolvedId()}-panel`;
  }

  tabIndexFor(index: number): string {
    const tabs = this.tabs();
    if (tabs[index]?.disabled()) {
      return '-1';
    }

    return this.focusedIndex() === index ? '0' : '-1';
  }

  onTabFocus(index: number) {
    if (this.tabs()[index]?.disabled()) {
      return;
    }
    this.focusedIndex.set(index);
  }

  onTabClick(index: number) {
    const tab = this.tabs()[index];
    if (!tab || tab.disabled()) {
      return;
    }

    this.focusedIndex.set(index);
    this.selectedIndexChange.emit(index);
  }

  onKeydown(event: KeyboardEvent) {
    const tabs = this.tabs();
    if (tabs.length === 0) {
      return;
    }

    const current = this.focusedIndex();

    const moveFocus = (next: number) => {
      if (next < 0) {
        return;
      }
      this.focusedIndex.set(next);
      this.focusButton(next);
      event.preventDefault();
    };

    switch (event.key) {
      case 'ArrowRight': {
        const next = findNextEnabled(tabs, current, 1);
        moveFocus(next);
        break;
      }
      case 'ArrowLeft': {
        const prev = findNextEnabled(tabs, current, -1);
        moveFocus(prev);
        break;
      }
      case 'Home': {
        moveFocus(findFirstEnabled(tabs));
        break;
      }
      case 'End': {
        moveFocus(findLastEnabled(tabs));
        break;
      }
      case 'Enter':
      case ' ': {
        const tab = tabs[current];
        if (tab && !tab.disabled()) {
          this.selectedIndexChange.emit(current);
          event.preventDefault();
        }
        break;
      }
      default:
        break;
    }
  }

  private focusButton(index: number) {
    const refs = this.tabButtons?.toArray?.() ?? [];
    const btn = refs[index]?.nativeElement;
    if (!btn) {
      return;
    }
    btn.focus();
  }
}
