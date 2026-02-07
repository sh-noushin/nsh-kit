import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { NshFocusVisibleDirective } from '../../a11y/focus-visible';
import { NshIconComponent } from '../../foundations/icon';

export type NshChipVariant = 'filled' | 'outlined';
export type NshChipColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral';
export type NshChipSize = 'sm' | 'md';

function readTrimmedText(el: HTMLElement): string {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

@Component({
  selector: 'nsh-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshFocusVisibleDirective, NshIconComponent],
  host: {
    '[class.nsh-chip-host]': 'true',

    '[class.nsh-chip-host--filled]': "variant() === 'filled'",
    '[class.nsh-chip-host--outlined]': "variant() === 'outlined'",

    '[class.nsh-chip-host--primary]': "color() === 'primary'",
    '[class.nsh-chip-host--secondary]': "color() === 'secondary'",
    '[class.nsh-chip-host--tertiary]': "color() === 'tertiary'",
    '[class.nsh-chip-host--success]': "color() === 'success'",
    '[class.nsh-chip-host--warn]': "color() === 'warn'",
    '[class.nsh-chip-host--danger]': "color() === 'danger'",
    '[class.nsh-chip-host--neutral]': "color() === 'neutral'",

    '[class.nsh-chip-host--sm]': "size() === 'sm'",
    '[class.nsh-chip-host--md]': "size() === 'md'",

    '[class.nsh-chip-host--selected]': 'selected()',
    '[class.nsh-chip-host--disabled]': 'disabled()',
    '[class.nsh-chip-host--removable]': 'removable()',
  },
  template: `
    <span class="nsh-chip">
      <button
        nshFocusVisible
        class="nsh-chip__main"
        type="button"
        [disabled]="disabled()"
        [attr.aria-pressed]="selected() ? 'true' : 'false'"
        [attr.aria-label]="effectiveAriaLabel()"
        (click)="onMainClick()"
      >
        @if (leadingIcon(); as iconName) {
          <nsh-icon class="nsh-chip__icon nsh-chip__icon--leading" [name]="iconName" size="1em" />
        }

        <span #text class="nsh-chip__text"><ng-content /></span>

        @if (!removable() && trailingIcon(); as iconName) {
          <nsh-icon class="nsh-chip__icon nsh-chip__icon--trailing" [name]="iconName" size="1em" />
        }
      </button>

      @if (removable()) {
        <button
          nshFocusVisible
          class="nsh-chip__remove"
          type="button"
          [disabled]="disabled()"
          [attr.aria-label]="removeAriaLabel()"
          (click)="onRemoveClick($event)"
        >
          <nsh-icon class="nsh-chip__icon" [name]="removeIconName()" size="1em" />
        </button>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;

      --_chip-height: var(--nsh-chip-height, var(--nsh-density-control-height));
      --_chip-radius: var(--nsh-chip-radius, var(--nsh-radius-pill));
      --_chip-pad-x: var(--nsh-chip-padding-x, var(--nsh-density-padding-inline));
      --_chip-gap: var(--nsh-chip-gap, var(--nsh-space-xs));

      --_chip-accent: var(--nsh-color-text);

      --_chip-bg: var(
        --nsh-chip-bg,
        color-mix(in srgb, var(--_chip-accent) 12%, var(--nsh-color-surface-1))
      );
      --_chip-bg-selected: var(
        --nsh-chip-bg-selected,
        color-mix(in srgb, var(--_chip-accent) 20%, var(--nsh-color-surface-1))
      );
      --_chip-border: var(
        --nsh-chip-border-color,
        color-mix(in srgb, var(--_chip-accent) 55%, transparent)
      );

      --_chip-fg: var(--nsh-chip-fg, var(--nsh-color-text));
      --_chip-fg-muted: var(--nsh-chip-fg-muted, var(--nsh-color-text-muted));

      --_chip-focus-ring: var(
        --nsh-chip-focus-ring,
        color-mix(in srgb, var(--nsh-color-outline) 60%, transparent)
      );

      --_chip-border-width: var(--nsh-chip-border-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
      --_chip-focus-width: var(--nsh-chip-focus-width, var(--nsh-space-xxs, var(--nsh-space-xs)));
    }

    /* Size */
    :host(.nsh-chip-host--sm) {
      --_chip-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_chip-pad-x: calc(var(--nsh-density-padding-inline) - var(--nsh-space-xs));
    }

    :host(.nsh-chip-host--md) {
      --_chip-height: var(--nsh-density-control-height);
    }

    /* Color -> accent */
    :host(.nsh-chip-host--primary) {
      --_chip-accent: var(--nsh-color-primary);
    }
    :host(.nsh-chip-host--secondary) {
      --_chip-accent: var(--nsh-color-secondary);
    }
    :host(.nsh-chip-host--tertiary) {
      --_chip-accent: var(--nsh-color-tertiary);
    }
    :host(.nsh-chip-host--success) {
      --_chip-accent: var(--nsh-color-success);
    }
    :host(.nsh-chip-host--warn) {
      --_chip-accent: var(--nsh-color-warn);
    }
    :host(.nsh-chip-host--danger) {
      --_chip-accent: var(--nsh-color-danger);
    }
    :host(.nsh-chip-host--neutral) {
      --_chip-accent: var(--nsh-color-text);
    }

    /* Variant */
    :host(.nsh-chip-host--filled) {
      --_chip-bg: var(
        --nsh-chip-bg,
        color-mix(in srgb, var(--_chip-accent) 12%, var(--nsh-color-surface-1))
      );
      --_chip-fg: var(--nsh-chip-fg, var(--nsh-color-text));
      --_chip-border: var(--nsh-chip-border-color, transparent);
    }

    :host(.nsh-chip-host--outlined) {
      --_chip-bg: var(--nsh-chip-bg, transparent);
      --_chip-fg: var(--nsh-chip-fg, var(--_chip-accent));
      --_chip-border: var(
        --nsh-chip-border-color,
        color-mix(in srgb, var(--_chip-accent) 55%, transparent)
      );
    }

    .nsh-chip {
      display: inline-flex;
      align-items: stretch;
      max-width: 100%;
      min-width: 0;
      gap: 0;
      font-family: var(--nsh-font-family);
    }

    .nsh-chip__main,
    .nsh-chip__remove {
      height: var(--_chip-height);
      border: var(--_chip-border-width) solid var(--_chip-border);
      background: var(--_chip-bg);
      color: var(--_chip-fg);

      padding-inline: var(--_chip-pad-x);

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--_chip-gap);

      font-size: var(--nsh-font-size-sm);
      line-height: var(--nsh-line-height-tight);

      cursor: pointer;

      transition:
        background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),
        opacity var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard);
    }

    :host(.nsh-chip-host--selected) .nsh-chip__main,
    :host(.nsh-chip-host--selected) .nsh-chip__remove {
      background: var(--_chip-bg-selected);
    }

    .nsh-chip__main {
      border-radius: var(--_chip-radius);
      min-width: 0;
    }

    :host(.nsh-chip-host--removable) .nsh-chip__main {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-width: 0;
    }

    .nsh-chip__remove {
      border-radius: var(--_chip-radius);
      padding-inline: calc(var(--_chip-pad-x) - var(--nsh-space-xs));
    }

    :host(.nsh-chip-host--removable) .nsh-chip__remove {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .nsh-chip__main:hover:not(:disabled),
    .nsh-chip__remove:hover:not(:disabled) {
      background: color-mix(in srgb, var(--_chip-bg) 92%, var(--nsh-color-surface));
    }

    :host(.nsh-chip-host--selected) .nsh-chip__main:hover:not(:disabled),
    :host(.nsh-chip-host--selected) .nsh-chip__remove:hover:not(:disabled) {
      background: color-mix(in srgb, var(--_chip-bg-selected) 92%, var(--nsh-color-surface));
    }

    .nsh-chip__main:focus,
    .nsh-chip__remove:focus {
      outline: none;
    }

    .nsh-chip__main.nsh-focus-visible,
    .nsh-chip__main:focus-visible,
    .nsh-chip__remove.nsh-focus-visible,
    .nsh-chip__remove:focus-visible {
      box-shadow: 0 0 0 var(--_chip-focus-width) var(--_chip-focus-ring);
    }

    .nsh-chip__text {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nsh-chip__icon {
      display: inline-flex;
      color: currentColor;
      opacity: 0.9;
    }

    :host(.nsh-chip-host--disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .nsh-chip__main:disabled,
    .nsh-chip__remove:disabled {
      cursor: not-allowed;
    }
  `,
})
export class NshChipComponent {
  readonly variant = input<NshChipVariant>('filled');
  readonly color = input<NshChipColor>('neutral');
  readonly size = input<NshChipSize>('md');

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly removable = input(false, { transform: booleanAttribute });

  readonly leadingIcon = input<string | null>(null);
  readonly trailingIcon = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<void>();
  readonly removed = output<void>();

  private readonly labelText = signal('');
  private readonly hasMeasuredText = signal(false);

  private readonly textEl = viewChild<ElementRef<HTMLElement>>('text');

  private readonly hasUserAriaLabel = computed(() => {
    const v = this.ariaLabel();
    return v !== null && v.trim().length > 0;
  });

  private readonly hasText = computed(() => this.labelText().trim().length > 0);

  readonly effectiveAriaLabel = computed(() => {
    if (this.hasText()) {
      return null;
    }

    if (this.hasUserAriaLabel()) {
      return this.ariaLabel();
    }

    return null;
  });

  readonly removeIconName = computed(() => {
    const icon = this.trailingIcon();
    if (icon !== null && icon.trim().length > 0) {
      return icon;
    }
    return 'x';
  });

  readonly removeAriaLabel = computed(() => {
    const label = this.labelText();
    if (label.trim().length > 0) {
      return `Remove ${label}`;
    }
    return 'Remove';
  });

  constructor() {
    effect((onCleanup) => {
      const el = this.textEl()?.nativeElement;
      if (!el) {
        return;
      }

      const recompute = () => {
        this.labelText.set(readTrimmedText(el));
        this.hasMeasuredText.set(true);
      };

      recompute();

      const observer = new MutationObserver(() => recompute());
      observer.observe(el, { childList: true, subtree: true, characterData: true });

      onCleanup(() => observer.disconnect());
    });

    effect(() => {
      if (!this.hasMeasuredText()) {
        return;
      }

      if (this.hasText()) {
        return;
      }

      if (this.hasUserAriaLabel()) {
        return;
      }

      throw new Error('nsh-chip: ariaLabel is required when the chip has no text content.');
    });
  }

  onMainClick(): void {
    if (this.disabled()) {
      return;
    }
    this.clicked.emit();
  }

  onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled()) {
      return;
    }

    this.removed.emit();
  }
}
