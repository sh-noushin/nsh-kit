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

export type NshTabsVariant = 'underline' | 'pill' | 'contained';

function clampIndex(index: number, length: number): number {
  if (!Number.isFinite(index)) {
    return 0;
  }
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(Math.floor(index), 0), length - 1);
}

function findFirstEnabled(tabs: readonly NshTabComponent[], disabled: boolean): number {
  if (disabled) {
    return -1;
  }
  return tabs.findIndex((tab) => !tab.disabled());
}

function findLastEnabled(tabs: readonly NshTabComponent[], disabled: boolean): number {
  if (disabled) {
    return -1;
  }
  for (let idx = tabs.length - 1; idx >= 0; idx--) {
    if (!tabs[idx]?.disabled()) {
      return idx;
    }
  }
  return -1;
}

function findNextEnabled(
  tabs: readonly NshTabComponent[],
  from: number,
  delta: 1 | -1,
  disabled: boolean
): number {
  if (tabs.length === 0 || disabled) {
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

@Component({
  selector: 'nsh-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NshIconComponent],
  host: {
    '[class.nsh-tabs-host]': 'true',
    '[class.nsh-tabs-host--underline]': "variant() === 'underline'",
    '[class.nsh-tabs-host--pill]': "variant() === 'pill'",
    '[class.nsh-tabs-host--contained]': "variant() === 'contained'",
    '[class.nsh-tabs-host--stretch]': 'stretch()',
    '[class.nsh-tabs-host--disabled]': 'disabled()',
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
            [disabled]="isTabDisabled(tab)"
            [attr.aria-selected]="activeIndexResolved() === i ? 'true' : 'false'"
            [attr.aria-controls]="panelId(tab)"
            [attr.aria-disabled]="isTabDisabled(tab) ? 'true' : null"
            [attr.tabindex]="tabIndexFor(i)"
            [class.nsh-tabs__tab--active]="activeIndexResolved() === i"
            [class.nsh-tabs__tab--disabled]="isTabDisabled(tab)"
            (focus)="onTabFocus(i)"
            (click)="onTabClick(i)"
          >
            @if (tab.icon(); as iconName) {
              <nsh-icon class="nsh-tabs__icon" [name]="iconName" [size]="iconSize()" />
            }
            <span class="nsh-tabs__label">
              @if (tab.label(); as label) {
                {{ label }}
              } @else {
                <ng-container [ngTemplateOutlet]="tab.labelTpl"></ng-container>
              }
            </span>
          </button>
        }
      </div>

      <div class="nsh-tabs__panels">
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
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;

      /* Component override surface */
      --nsh-tabs-gap: var(--nsh-tabs-gap, unset);
      --nsh-tabs-header-height: var(--nsh-tabs-header-height, unset);
      --nsh-tabs-radius: var(--nsh-tabs-radius, unset);
      --nsh-tabs-bg: var(--nsh-tabs-bg, unset);
      --nsh-tabs-fg: var(--nsh-tabs-fg, unset);
      --nsh-tabs-fg-muted: var(--nsh-tabs-fg-muted, unset);
      --nsh-tabs-hover-bg: var(--nsh-tabs-hover-bg, unset);
      --nsh-tabs-active-indicator-color: var(--nsh-tabs-active-indicator-color, unset);
      --nsh-tabs-active-indicator-height: var(--nsh-tabs-active-indicator-height, unset);
      --nsh-tabs-pill-bg: var(--nsh-tabs-pill-bg, unset);
      --nsh-tabs-pill-bg-active: var(--nsh-tabs-pill-bg-active, unset);
      --nsh-tabs-focus-ring: var(--nsh-tabs-focus-ring, unset);
      --nsh-tabs-panel-padding: var(--nsh-tabs-panel-padding, unset);

      --_tabs-gap: var(--nsh-tabs-gap, var(--nsh-space-sm));
      --_tabs-header-height: var(--nsh-tabs-header-height, var(--nsh-density-control-height));
      --_tabs-radius: var(--nsh-tabs-radius, var(--nsh-radius-pill));
      --_tabs-bg: var(--nsh-tabs-bg, var(--nsh-color-surface-1));
      --_tabs-fg: var(--nsh-tabs-fg, var(--nsh-color-text));
      --_tabs-fg-muted: var(--nsh-tabs-fg-muted, var(--nsh-color-text-muted));
      --_tabs-hover-bg: var(--nsh-tabs-hover-bg, var(--nsh-color-surface-2));
      --_tabs-active-indicator-color: var(
        --nsh-tabs-active-indicator-color,
        var(--nsh-color-primary)
      );
      --_tabs-active-indicator-height: var(
        --nsh-tabs-active-indicator-height,
        var(--nsh-space-xs)
      );
      --_tabs-pill-bg: var(--nsh-tabs-pill-bg, var(--nsh-color-surface-1));
      --_tabs-pill-bg-active: var(--nsh-tabs-pill-bg-active, var(--nsh-color-surface-2));
      --_tabs-focus-ring: var(--nsh-tabs-focus-ring, var(--nsh-color-outline));
      --_tabs-panel-padding: var(--nsh-tabs-panel-padding, var(--nsh-space-md));

      --_tabs-font-size: var(--nsh-font-size-md);
      --_tabs-duration: var(--nsh-motion-duration-fast);
      --_tabs-easing: var(--nsh-motion-easing-standard);
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

    :host(.nsh-tabs-host--stretch) .nsh-tabs__tab {
      flex: 1 1 0;
    }

    .nsh-tabs__tab {
      position: relative;
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--_tabs-fg);
      cursor: pointer;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--nsh-space-xs);

      min-height: var(--_tabs-header-height);
      padding-inline: var(--nsh-density-padding-inline);
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

    .nsh-tabs__tab:hover {
      background: var(--_tabs-hover-bg);
    }

    .nsh-tabs__label {
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--_tabs-fg);
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
      color: var(--_tabs-fg);
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
      height: var(--_tabs-active-indicator-height);
      background: transparent;
      border-radius: var(--_tabs-active-indicator-height);
      transition: background var(--_tabs-duration) var(--_tabs-easing);
    }

    :host(.nsh-tabs-host--underline) .nsh-tabs__tab--active::after {
      background: var(--_tabs-active-indicator-color);
    }

    /* Variant: pill */
    :host(.nsh-tabs-host--pill) .nsh-tabs__tablist {
      background: var(--_tabs-pill-bg);
      border-radius: var(--_tabs-radius);
      padding: var(--nsh-space-xs);
    }

    :host(.nsh-tabs-host--pill) .nsh-tabs__tab {
      border-radius: var(--_tabs-radius);
    }

    :host(.nsh-tabs-host--pill) .nsh-tabs__tab--active {
      background: var(--_tabs-pill-bg-active);
    }

    /* Variant: contained */
    :host(.nsh-tabs-host--contained) .nsh-tabs__tablist {
      background: var(--_tabs-bg);
      border-radius: var(--_tabs-radius);
      padding: var(--nsh-space-xs);
    }

    :host(.nsh-tabs-host--contained) .nsh-tabs__tab {
      border-radius: var(--_tabs-radius);
    }

    :host(.nsh-tabs-host--contained) .nsh-tabs__tab--active {
      background: var(--_tabs-pill-bg-active);
    }

    .nsh-tabs__panels {
      min-width: 0;
    }

    .nsh-tabs__panel {
      min-width: 0;
      padding: var(--_tabs-panel-padding);
      background: var(--_tabs-bg);
      border-radius: var(--_tabs-radius);
    }
  `,
})
export class NshTabsComponent {
  @ViewChildren('tabButton', { read: ElementRef })
  private readonly tabButtons?: { toArray(): Array<ElementRef<HTMLButtonElement>> };

  readonly activeIndex = input(0);
  readonly variant = input<NshTabsVariant>('underline');
  readonly stretch = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>('Tabs');

  readonly activeIndexChange = output<number>();
  readonly tabChange = output<{ previousIndex: number; currentIndex: number }>();

  private readonly tabsQuery = contentChildren(NshTabComponent);

  readonly tabs = computed(() => this.tabsQuery());

  readonly activeIndexResolved = computed(() => {
    const tabs = this.tabs();
    if (tabs.length === 0) {
      return -1;
    }

    const desired = clampIndex(this.activeIndex(), tabs.length);
    if (!this.isTabDisabled(tabs[desired])) {
      return desired;
    }

    return findFirstEnabled(tabs, this.disabled());
  });

  readonly activeTab = computed(() => {
    const tabs = this.tabs();
    const idx = this.activeIndexResolved();
    return idx >= 0 ? (tabs[idx] ?? null) : null;
  });

  private readonly focusedIndex = signal(0);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const active = this.activeIndexResolved();

      if (tabs.length === 0) {
        this.focusedIndex.set(0);
        return;
      }

      const current = this.focusedIndex();
      const clamped = clampIndex(current, tabs.length);
      const next = !this.isTabDisabled(tabs[clamped]) ? clamped : active;

      if (next >= 0) {
        this.focusedIndex.set(next);
      }
    });
  }

  iconSize(): string {
    return 'var(--nsh-font-size-sm)';
  }

  tabId(tab: NshTabComponent): string {
    return `${tab.resolvedId()}-tab`;
  }

  panelId(tab: NshTabComponent): string {
    return `${tab.resolvedId()}-panel`;
  }

  tabIndexFor(index: number): string {
    const tabs = this.tabs();
    if (this.isTabDisabled(tabs[index])) {
      return '-1';
    }

    return this.focusedIndex() === index ? '0' : '-1';
  }

  isTabDisabled(tab: NshTabComponent | undefined): boolean {
    if (!tab) {
      return true;
    }
    return this.disabled() || tab.disabled();
  }

  onTabFocus(index: number) {
    const tabs = this.tabs();
    if (this.isTabDisabled(tabs[index])) {
      return;
    }
    this.focusedIndex.set(index);
  }

  onTabClick(index: number) {
    this.attemptActivate(index);
  }

  onKeydown(event: KeyboardEvent) {
    if (this.disabled()) {
      return;
    }

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
        const next = findNextEnabled(tabs, current, 1, this.disabled());
        moveFocus(next);
        break;
      }
      case 'ArrowLeft': {
        const prev = findNextEnabled(tabs, current, -1, this.disabled());
        moveFocus(prev);
        break;
      }
      case 'Home': {
        moveFocus(findFirstEnabled(tabs, this.disabled()));
        break;
      }
      case 'End': {
        moveFocus(findLastEnabled(tabs, this.disabled()));
        break;
      }
      case 'PageDown': {
        if (event.ctrlKey) {
          const next = findNextEnabled(tabs, current, 1, this.disabled());
          moveFocus(next);
        }
        break;
      }
      case 'PageUp': {
        if (event.ctrlKey) {
          const prev = findNextEnabled(tabs, current, -1, this.disabled());
          moveFocus(prev);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        const tab = tabs[current];
        if (tab && !this.isTabDisabled(tab)) {
          this.attemptActivate(current);
          event.preventDefault();
        }
        break;
      }
      default:
        break;
    }
  }

  private attemptActivate(index: number) {
    const tabs = this.tabs();
    if (index < 0 || index >= tabs.length) {
      return;
    }

    const tab = tabs[index];
    if (this.isTabDisabled(tab)) {
      return;
    }

    const current = this.activeIndexResolved();
    if (index === current) {
      this.focusedIndex.set(index);
      return;
    }

    this.focusedIndex.set(index);
    this.activeIndexChange.emit(index);
    this.tabChange.emit({ previousIndex: current, currentIndex: index });
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
