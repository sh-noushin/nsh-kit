import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NshSkeletonVariant = 'text' | 'rect' | 'circle';
export type NshSkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type NshSkeletonAnimation = 'pulse' | 'wave' | 'none';

function clampLines(lines: number): number {
  if (!Number.isFinite(lines)) {
    return 1;
  }
  return Math.max(1, Math.floor(lines));
}

@Component({
  selector: 'nsh-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-skeleton]': 'true',

    '[class.nsh-skeleton--text]': "variant() === 'text'",
    '[class.nsh-skeleton--rect]': "variant() === 'rect'",
    '[class.nsh-skeleton--circle]': "variant() === 'circle'",

    '[class.nsh-skeleton--radius-none]': "radius() === 'none'",
    '[class.nsh-skeleton--radius-sm]': "radius() === 'sm'",
    '[class.nsh-skeleton--radius-md]': "radius() === 'md'",
    '[class.nsh-skeleton--radius-lg]': "radius() === 'lg'",
    '[class.nsh-skeleton--radius-full]': "radius() === 'full'",

    '[class.nsh-skeleton--anim-pulse]': "animation() === 'pulse'",
    '[class.nsh-skeleton--anim-wave]': "animation() === 'wave'",
    '[class.nsh-skeleton--anim-none]': "animation() === 'none'",

    '[style.--nsh-skeleton-width]': 'width() ?? null',
    '[style.--nsh-skeleton-height]': 'height() ?? null',

    '[attr.aria-hidden]': "ariaLabel() ? null : 'true'",
    '[attr.role]': "ariaLabel() ? 'status' : null",
    '[attr.aria-label]': 'ariaLabel() ?? null',
  },
  template: `
    @switch (variant()) {
      @case ('text') {
        <span class="nsh-skeleton__lines" [class.nsh-skeleton__lines--multiline]="lineCount() > 1">
          @for (index of lineIndexes(); track index) {
            <span
              class="nsh-skeleton__line"
              [class.nsh-skeleton__line--last]="index === lineCount() - 1 && lineCount() > 1"
            ></span>
          }
        </span>
      }
      @default {
        <span class="nsh-skeleton__block"></span>
      }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;

      /* Required component variables (override surface) */
      --nsh-skeleton-bg: var(--nsh-skeleton-bg, unset);
      --nsh-skeleton-highlight: var(--nsh-skeleton-highlight, unset);
      --nsh-skeleton-radius: var(--nsh-skeleton-radius, unset);
      --nsh-skeleton-line-height: var(--nsh-skeleton-line-height, unset);
      --nsh-skeleton-gap: var(--nsh-skeleton-gap, unset);
      --nsh-skeleton-wave-duration: var(--nsh-skeleton-wave-duration, unset);
      --nsh-skeleton-pulse-duration: var(--nsh-skeleton-pulse-duration, unset);

      /* Optional width/height inputs */
      --nsh-skeleton-width: var(--nsh-skeleton-width, unset);
      --nsh-skeleton-height: var(--nsh-skeleton-height, unset);

      --_sk-bg: var(
        --nsh-skeleton-bg,
        color-mix(in srgb, var(--nsh-color-surface-2) 80%, var(--nsh-color-surface))
      );
      --_sk-highlight: var(
        --nsh-skeleton-highlight,
        color-mix(in srgb, var(--nsh-color-surface-1) 75%, var(--nsh-color-outline))
      );

      --_sk-radius: var(--nsh-skeleton-radius, var(--nsh-radius-md));
      --_sk-gap: var(--nsh-skeleton-gap, var(--nsh-space-sm));
      --_sk-line-height: var(--nsh-skeleton-line-height, var(--nsh-font-size-md));

      --_sk-wave-duration: var(--nsh-skeleton-wave-duration, var(--nsh-motion-duration-slow));
      --_sk-pulse-duration: var(--nsh-skeleton-pulse-duration, var(--nsh-motion-duration-slow));

      --_sk-width: var(--nsh-skeleton-width, 100%);
      --_sk-height: var(--nsh-skeleton-height, unset);

      --_sk-last-line-width: calc(100% - var(--nsh-space-xl));
    }

    :host(.nsh-skeleton--radius-none) {
      --_sk-radius: 0;
    }

    :host(.nsh-skeleton--radius-sm) {
      --_sk-radius: var(--nsh-radius-sm);
    }

    :host(.nsh-skeleton--radius-md) {
      --_sk-radius: var(--nsh-radius-md);
    }

    :host(.nsh-skeleton--radius-lg) {
      --_sk-radius: var(--nsh-radius-lg);
    }

    :host(.nsh-skeleton--radius-full) {
      --_sk-radius: var(--nsh-radius-pill);
    }

    :host(.nsh-skeleton--circle) {
      --_sk-radius: var(--nsh-radius-pill);
    }

    .nsh-skeleton__lines {
      display: inline-flex;
      flex-direction: column;
      width: var(--_sk-width);
      gap: var(--_sk-gap);
    }

    .nsh-skeleton__line,
    .nsh-skeleton__block {
      display: block;
      width: var(--_sk-width);
      border-radius: var(--_sk-radius);
      background: var(--_sk-bg);
      position: relative;
      overflow: hidden;
    }

    .nsh-skeleton__line {
      height: var(--_sk-height, var(--_sk-line-height));
    }

    .nsh-skeleton__line--last {
      width: var(--nsh-skeleton-last-line-width, var(--_sk-last-line-width));
    }

    :host(.nsh-skeleton--rect) .nsh-skeleton__block {
      height: var(--_sk-height, var(--nsh-density-control-height));
    }

    :host(.nsh-skeleton--circle) .nsh-skeleton__block {
      width: var(--_sk-width, var(--nsh-density-control-height));
      height: var(--_sk-height, var(--nsh-density-control-height));
      aspect-ratio: 1 / 1;
    }

    /* Pulse */
    :host(.nsh-skeleton--anim-pulse) .nsh-skeleton__line,
    :host(.nsh-skeleton--anim-pulse) .nsh-skeleton__block {
      animation: nsh-skeleton-pulse var(--_sk-pulse-duration) var(--nsh-motion-easing-standard) infinite;
    }

    @keyframes nsh-skeleton-pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.55;
      }
      100% {
        opacity: 1;
      }
    }

    /* Wave */
    :host(.nsh-skeleton--anim-wave) .nsh-skeleton__line::after,
    :host(.nsh-skeleton--anim-wave) .nsh-skeleton__block::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(
        90deg,
        transparent,
        var(--_sk-highlight),
        transparent
      );
      transform: translateX(-100%);
      animation: nsh-skeleton-wave var(--_sk-wave-duration) ease-in-out infinite;
    }

    @keyframes nsh-skeleton-wave {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    /* None */
    :host(.nsh-skeleton--anim-none) .nsh-skeleton__line,
    :host(.nsh-skeleton--anim-none) .nsh-skeleton__block {
      animation: none;
    }

    :host(.nsh-skeleton--anim-none) .nsh-skeleton__line::after,
    :host(.nsh-skeleton--anim-none) .nsh-skeleton__block::after {
      content: none;
    }
  `,
})
export class NshSkeletonComponent {
  readonly variant = input<NshSkeletonVariant>('text');
  readonly width = input<string | null>(null);
  readonly height = input<string | null>(null);
  readonly lines = input(1);
  readonly radius = input<NshSkeletonRadius>('md');
  readonly animation = input<NshSkeletonAnimation>('wave');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly lineCount = computed(() => (this.variant() === 'text' ? clampLines(this.lines()) : 1));

  readonly lineIndexes = computed(() => {
    const count = this.lineCount();
    return Array.from({ length: count }, (_, index) => index);
  });
}
