import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

export type NshBadgeColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warn'
  | 'danger'
  | 'neutral';

export type NshBadgeSize = 'sm' | 'md';

export type NshBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type NshBadgeValue = string | number | null;

function hasMeaningfulContent(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) {
    return true;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').trim().length > 0;
  }
  return false;
}

@Component({
  selector: 'nsh-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="nsh-badge-host"
      [class.nsh-badge-host--attached]="hasAttachedContent()"
      [class.nsh-badge-host--top-right]="position() === 'top-right'"
      [class.nsh-badge-host--top-left]="position() === 'top-left'"
      [class.nsh-badge-host--bottom-right]="position() === 'bottom-right'"
      [class.nsh-badge-host--bottom-left]="position() === 'bottom-left'"
    >
      <span #content class="nsh-badge-host__content"><ng-content /></span>

      @if (showBadge()) {
        <span
          class="nsh-badge"
          [class.nsh-badge--dot]="dot()"
          [class.nsh-badge--sm]="size() === 'sm'"
          [class.nsh-badge--md]="size() === 'md'"
          [class.nsh-badge--primary]="color() === 'primary'"
          [class.nsh-badge--secondary]="color() === 'secondary'"
          [class.nsh-badge--tertiary]="color() === 'tertiary'"
          [class.nsh-badge--success]="color() === 'success'"
          [class.nsh-badge--warn]="color() === 'warn'"
          [class.nsh-badge--danger]="color() === 'danger'"
          [class.nsh-badge--neutral]="color() === 'neutral'"
          [attr.aria-hidden]="ariaLabel() ? null : 'true'"
          [attr.aria-label]="ariaLabel() ?? null"
        >
          @if (!dot()) {
            {{ displayText() }}
          }
        </span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;

      /* Per-instance override surface */
      --nsh-badge-bg: var(--nsh-badge-bg, unset);
      --nsh-badge-fg: var(--nsh-badge-fg, unset);
      --nsh-badge-border-color: var(--nsh-badge-border-color, unset);
      --nsh-badge-offset: var(--nsh-badge-offset, unset);
      --nsh-badge-radius: var(--nsh-badge-radius, var(--nsh-radius-pill));
    }

    .nsh-badge-host {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .nsh-badge-host__content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .nsh-badge {
      --_badge-accent: var(--nsh-color-primary);
      --_badge-bg: var(--nsh-badge-bg, var(--_badge-accent));
      --_badge-fg: var(--nsh-badge-fg, var(--nsh-color-surface));
      --_badge-border: var(
        --nsh-badge-border-color,
        color-mix(in srgb, var(--nsh-color-border) 60%, transparent)
      );

      --_badge-offset: var(--nsh-badge-offset, var(--nsh-space-xs));
      --_badge-height: 1.25rem;
      --_badge-min-width: 1.25rem;
      --_badge-pad-inline: var(--nsh-space-xs);
      --_badge-font-size: var(--nsh-font-size-xs);

      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--_badge-min-width);
      height: var(--_badge-height);
      padding-inline: var(--_badge-pad-inline);
      border-radius: var(--nsh-badge-radius);
      border: 1px solid var(--_badge-border);

      background: var(--_badge-bg);
      color: var(--_badge-fg);
      font-family: var(--nsh-font-family);
      font-size: var(--_badge-font-size);
      font-weight: var(--nsh-font-weight-medium);
      line-height: var(--nsh-line-height-tight);
      white-space: nowrap;
      pointer-events: none;
    }

    .nsh-badge--sm {
      --_badge-height: 1.125rem;
      --_badge-min-width: 1.125rem;
      --_badge-font-size: var(--nsh-font-size-xs);
    }

    .nsh-badge--md {
      --_badge-height: 1.25rem;
      --_badge-min-width: 1.25rem;
      --_badge-font-size: var(--nsh-font-size-xs);
    }

    .nsh-badge--dot {
      --_badge-height: 0.625rem;
      --_badge-min-width: 0.625rem;
      padding-inline: 0;
    }

    /* Color mapping */
    .nsh-badge--primary {
      --_badge-accent: var(--nsh-color-primary);
    }
    .nsh-badge--secondary {
      --_badge-accent: var(--nsh-color-secondary);
    }
    .nsh-badge--tertiary {
      --_badge-accent: var(--nsh-color-tertiary);
    }
    .nsh-badge--success {
      --_badge-accent: var(--nsh-color-success);
    }
    .nsh-badge--warn {
      --_badge-accent: var(--nsh-color-warn);
    }
    .nsh-badge--danger {
      --_badge-accent: var(--nsh-color-danger);
    }
    .nsh-badge--neutral {
      --_badge-accent: var(--nsh-color-text);
    }

    /* Attached positioning */
    .nsh-badge-host--attached .nsh-badge {
      position: absolute;
      transform: translate(50%, -50%);
    }

    .nsh-badge-host--attached.nsh-badge-host--top-right .nsh-badge {
      top: var(--_badge-offset);
      right: var(--_badge-offset);
      left: auto;
      bottom: auto;
      transform: translate(50%, -50%);
    }

    .nsh-badge-host--attached.nsh-badge-host--top-left .nsh-badge {
      top: var(--_badge-offset);
      left: var(--_badge-offset);
      right: auto;
      bottom: auto;
      transform: translate(-50%, -50%);
    }

    .nsh-badge-host--attached.nsh-badge-host--bottom-right .nsh-badge {
      bottom: var(--_badge-offset);
      right: var(--_badge-offset);
      left: auto;
      top: auto;
      transform: translate(50%, 50%);
    }

    .nsh-badge-host--attached.nsh-badge-host--bottom-left .nsh-badge {
      bottom: var(--_badge-offset);
      left: var(--_badge-offset);
      right: auto;
      top: auto;
      transform: translate(-50%, 50%);
    }
  `,
})
export class NshBadgeComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly value = input<NshBadgeValue>(null);
  readonly max = input<number>(99);
  readonly dot = input(false, { transform: booleanAttribute });
  readonly color = input<NshBadgeColor>('primary');
  readonly size = input<NshBadgeSize>('md');
  readonly position = input<NshBadgePosition>('top-right');
  readonly ariaLabel = input<string | undefined>(undefined);

  @ViewChild('content', { read: ElementRef })
  private contentEl?: ElementRef<HTMLElement>;
  private readonly attachedContent = signal(false);

  readonly hasAttachedContent = computed(() => this.attachedContent());

  readonly showBadge = computed(() => this.dot() || this.value() !== null);

  readonly displayText = computed(() => {
    if (this.dot()) {
      return '';
    }
    const value = this.value();
    if (value === null) {
      return '';
    }
    if (typeof value === 'number') {
      const max = this.max();
      return value > max ? `${max}+` : `${value}`;
    }
    return `${value}`;
  });

  constructor() {
    afterNextRender(() => {
      const el = this.contentEl?.nativeElement;
      if (!el) {
        return;
      }

      const recompute = () => {
        const nodes = Array.from(el.childNodes) as Node[];
        this.attachedContent.set(nodes.some((node) => hasMeaningfulContent(node)));
      };

      recompute();

      const observer = new MutationObserver(() => recompute());
      observer.observe(el, { childList: true, subtree: true, characterData: true });
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
