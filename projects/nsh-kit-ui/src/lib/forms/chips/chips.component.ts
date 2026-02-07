import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type NshChipsGap = 'sm' | 'md' | 'lg';

@Component({
  selector: 'nsh-chips',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-chips-host]': 'true',
    '[class.nsh-chips-host--wrap]': 'wrap()',
    '[class.nsh-chips-host--nowrap]': '!wrap()',
    '[class.nsh-chips-host--gap-sm]': "gap() === 'sm'",
    '[class.nsh-chips-host--gap-md]': "gap() === 'md'",
    '[class.nsh-chips-host--gap-lg]': "gap() === 'lg'",

    role: 'list',
    '[attr.aria-label]': 'effectiveAriaLabel()',

    '[style.--nsh-chips-wrap]': 'wrapCss()',
    '[style.--nsh-chips-gap]': 'gapCss()',
  },
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      flex-wrap: var(--nsh-chips-wrap, wrap);
      gap: var(--nsh-chips-gap, var(--nsh-space-sm));
    }
  `,
})
export class NshChipsComponent {
  readonly wrap = input(true, { transform: booleanAttribute });
  readonly gap = input<NshChipsGap>('md');
  readonly ariaLabel = input<string | null>(null);

  private readonly hasUserAriaLabel = computed(() => {
    const v = this.ariaLabel();
    return v !== null && v.trim().length > 0;
  });

  readonly effectiveAriaLabel = computed(() => {
    if (this.hasUserAriaLabel()) {
      return this.ariaLabel();
    }
    return null;
  });

  readonly wrapCss = computed(() => (this.wrap() ? 'wrap' : 'nowrap'));

  readonly gapCss = computed(() => {
    switch (this.gap()) {
      case 'sm':
        return 'var(--nsh-space-xs)';
      case 'lg':
        return 'var(--nsh-space-md)';
      case 'md':
      default:
        return 'var(--nsh-space-sm)';
    }
  });
}
