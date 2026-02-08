import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  NSH_MENU_PANEL,
  type NshMenuCloseReason,
  type NshMenuPanelItemHandle,
  type NshMenuPanelRegistry,
} from './menu-panel.types';

let nextMenuPanelId = 0;

class NshMenuPanelRegistryService implements NshMenuPanelRegistry {
  private readonly items = signal<ReadonlyArray<NshMenuPanelItemHandle>>([]);
  private readonly activeIndex = signal<number | null>(null);

  private closeOnItemClick = true;
  private closeFn: ((reason: NshMenuCloseReason) => void) | null = null;

  setCloseOptions(opts: { closeOnItemClick: boolean; close: (reason: NshMenuCloseReason) => void }): void {
    this.closeOnItemClick = opts.closeOnItemClick;
    this.closeFn = opts.close;
  }

  register(item: NshMenuPanelItemHandle): void {
    this.items.set([...this.items(), item]);

    // Default all items to not tabbable until focused.
    item.setTabIndex(-1);

    if (this.activeIndex() !== null) {
      return;
    }

    // Initialize roving tabindex to first enabled item.
    const idx = this.firstEnabledIndex();
    if (idx !== null) {
      this.setActiveIndex(idx);
    }
  }

  unregister(item: NshMenuPanelItemHandle): void {
    const items = this.items();
    const idx = items.indexOf(item);
    if (idx < 0) {
      return;
    }

    const next = items.slice(0, idx).concat(items.slice(idx + 1));
    this.items.set(next);

    const active = this.activeIndex();
    if (active === null) {
      return;
    }

    if (active === idx) {
      this.activeIndex.set(null);
      const nextIdx = this.firstEnabledIndex();
      if (nextIdx !== null) {
        this.setActiveIndex(nextIdx);
      }
      return;
    }

    if (active > idx) {
      this.activeIndex.set(active - 1);
    }
  }

  notifyItemActivated(item: NshMenuPanelItemHandle): void {
    if (item.isDisabled()) {
      return;
    }

    if (this.closeOnItemClick) {
      this.closeFn?.('item');
    }
  }

  focusFirstEnabledItem(): void {
    const idx = this.firstEnabledIndex();
    if (idx === null) {
      return;
    }

    this.setActiveIndex(idx);
    this.items()[idx]?.focus();
  }

  focusLastEnabledItem(): void {
    const idx = this.lastEnabledIndex();
    if (idx === null) {
      return;
    }

    this.setActiveIndex(idx);
    this.items()[idx]?.focus();
  }

  focusNext(): void {
    const idx = this.nextEnabledIndex(1);
    if (idx === null) {
      return;
    }

    this.setActiveIndex(idx);
    this.items()[idx]?.focus();
  }

  focusPrev(): void {
    const idx = this.nextEnabledIndex(-1);
    if (idx === null) {
      return;
    }

    this.setActiveIndex(idx);
    this.items()[idx]?.focus();
  }

  activateFocused(): void {
    const idx = this.activeIndex();
    if (idx === null) {
      return;
    }

    const item = this.items()[idx];
    if (!item || item.isDisabled()) {
      return;
    }

    item.click();
  }

  syncTabIndexes(): void {
    const active = this.activeIndex();
    const items = this.items();

    for (let i = 0; i < items.length; i++) {
      items[i]?.setTabIndex(i === active ? 0 : -1);
    }
  }

  private setActiveIndex(index: number): void {
    this.activeIndex.set(index);
    this.syncTabIndexes();
  }

  private firstEnabledIndex(): number | null {
    const items = this.items();
    for (let i = 0; i < items.length; i++) {
      if (items[i] && !items[i].isDisabled()) {
        return i;
      }
    }
    return null;
  }

  private lastEnabledIndex(): number | null {
    const items = this.items();
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i] && !items[i].isDisabled()) {
        return i;
      }
    }
    return null;
  }

  private nextEnabledIndex(direction: 1 | -1): number | null {
    const items = this.items();
    if (items.length === 0) {
      return null;
    }

    const current = this.activeIndex();
    const startIndex = current === null ? (direction === 1 ? -1 : 0) : current;

    let i = startIndex;
    for (let step = 0; step < items.length; step++) {
      i = (i + direction + items.length) % items.length;
      const it = items[i];
      if (it && !it.isDisabled()) {
        return i;
      }
    }

    return null;
  }
}

@Component({
  selector: 'nsh-menu-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [
    NshMenuPanelRegistryService,
    {
      provide: NSH_MENU_PANEL,
      useExisting: NshMenuPanelRegistryService,
    },
  ],
  host: {
    '[class.nsh-menu-panel]': 'true',
    '[attr.id]': 'panelId()',
    role: 'menu',
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[style.--nsh-menu-panel-width]': 'width() ?? null',
    '(keydown)': 'onKeydown($event)',
    '(click)': 'onPanelClick($event)',
  },
  template: `
    @if (template(); as tpl) {
      <ng-container [ngTemplateOutlet]="tpl" />
    }
  `,
  styles: `
    :host {
      display: block;
      background: var(--nsh-menu-bg, var(--nsh-color-surface-1));
      color: var(--nsh-menu-fg, var(--nsh-color-text));

      border-radius: var(--nsh-menu-radius, var(--nsh-radius-md));
      border: var(--nsh-space-xxs, var(--nsh-space-xs)) solid
        var(--nsh-menu-border-color, var(--nsh-color-outline));
      box-shadow: var(--nsh-menu-shadow, var(--nsh-elevation-2));

      padding-block: var(--nsh-menu-padding-y, var(--nsh-space-xs));

      width: var(--nsh-menu-panel-width, auto);
      outline: none;

      /* Ensure panel can sit above nearby content */
      position: relative;
      z-index: 1;
    }

    :host [nshMenuItem] {
      display: flex;
      align-items: center;
      min-height: var(--nsh-menu-item-height, var(--nsh-density-control-height));
      padding-inline: var(--nsh-menu-item-padding-x, var(--nsh-density-padding-inline));
      gap: var(--nsh-menu-item-gap, var(--nsh-space-sm));

      background: transparent;
      border: none;
      width: 100%;
      text-align: left;

      font-family: var(--nsh-font-family);
      font-size: var(--nsh-font-size-md);
      line-height: var(--nsh-line-height-normal);

      color: inherit;
      cursor: pointer;
      user-select: none;
    }

    :host [nshMenuItem]:hover {
      background: var(
        --nsh-menu-item-hover-bg,
        color-mix(in srgb, var(--nsh-color-outline) 14%, transparent)
      );
    }

    :host [nshMenuItem]:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--nsh-space-xxs, var(--nsh-space-xs))
        var(--nsh-menu-focus-ring, color-mix(in srgb, var(--nsh-color-outline) 60%, transparent));
      background: var(
        --nsh-menu-item-focus-bg,
        color-mix(in srgb, var(--nsh-color-outline) 22%, transparent)
      );
    }

    :host button[nshMenuItem][disabled],
    :host [nshMenuItem][aria-disabled='true'] {
      cursor: not-allowed;
      color: var(--nsh-menu-item-disabled-fg, var(--nsh-color-text-disabled));
    }

    :host button[nshMenuItem][disabled]:hover,
    :host [nshMenuItem][aria-disabled='true']:hover {
      background: transparent;
    }
  `,
})
export class NshMenuPanelComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly registry = inject(NshMenuPanelRegistryService);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  private registeredDomItems = false;

  readonly template = input<TemplateRef<unknown> | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly width = input<string | null>(null);
  readonly closeOnItemClick = input(true);
  readonly autoFocus = input(false);

  readonly panelId = input<string>(`nsh-menu-panel-${nextMenuPanelId++}`);

  readonly closeRequested = output<NshMenuCloseReason>();

  readonly hasContent = computed(() => !!this.template());

  constructor() {
    this.destroyRef.onDestroy(() => {
      // no-op; registry cleanup occurs via directive unregister
    });

    effect(() => {
      this.registry.setCloseOptions({
        closeOnItemClick: this.closeOnItemClick(),
        close: (reason) => this.closeRequested.emit(reason),
      });
    });

    effect(() => {
      // Wait until the consumer template has rendered into the overlay.
      if (!this.template() || this.registeredDomItems) {
        return;
      }

      afterNextRender(
        () => {
          if (this.registeredDomItems) {
            return;
          }

          this.registerDomItems();
          this.registeredDomItems = true;

          if (this.autoFocus()) {
            this.registry.focusFirstEnabledItem();
          }
        },
        { injector: this.injector },
      );
    });
  }

  onPanelClick(event: MouseEvent): void {
    if (!this.closeOnItemClick()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    const item = target?.closest?.('[nshMenuItem]') as HTMLElement | null;

    if (!item || !this.hostEl.nativeElement.contains(item)) {
      return;
    }

    if (this.isDisabledEl(item)) {
      return;
    }

    this.closeRequested.emit('item');
  }

  private registerDomItems(): void {
    const root = this.hostEl.nativeElement;
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[nshMenuItem]'));

    for (const el of elements) {
      const handle: NshMenuPanelItemHandle = {
        nativeElement: el,
        isDisabled: () => this.isDisabledEl(el),
        setTabIndex: (value) => {
          el.tabIndex = value;
        },
        focus: () => el.focus(),
        click: () => el.click(),
      };

      this.registry.register(handle);
    }
  }

  private isDisabledEl(el: HTMLElement): boolean {
    if (el instanceof HTMLButtonElement) {
      return el.disabled;
    }

    if (el.hasAttribute('disabled')) {
      return true;
    }

    return el.getAttribute('aria-disabled') === 'true';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeRequested.emit('escape');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.registry.focusNext();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.registry.focusPrev();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.registry.focusFirstEnabledItem();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.registry.focusLastEnabledItem();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.registry.activateFocused();
      return;
    }
  }
}
