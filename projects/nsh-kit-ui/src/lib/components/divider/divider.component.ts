import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type NshDividerOrientation = 'horizontal' | 'vertical';
export type NshDividerThickness = 'hairline' | 'sm' | 'md';

@Component({
  selector: 'nsh-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVertical()) {
      <div
        class="nsh-divider"
        role="separator"
        aria-orientation="vertical"
        [class.nsh-divider--vertical]="true"
        [class.nsh-divider--inset]="inset()"
        [class.nsh-divider--hairline]="thickness() === 'hairline'"
        [class.nsh-divider--sm]="thickness() === 'sm'"
        [class.nsh-divider--md]="thickness() === 'md'"
      ></div>
    } @else {
      <hr
        class="nsh-divider"
        [class.nsh-divider--horizontal]="true"
        [class.nsh-divider--inset]="inset()"
        [class.nsh-divider--hairline]="thickness() === 'hairline'"
        [class.nsh-divider--sm]="thickness() === 'sm'"
        [class.nsh-divider--md]="thickness() === 'md'"
      />
    }
  `,
  styles: `
    :host {
      display: block;

      /* Per-instance override surface */
      --nsh-divider-color: var(--nsh-divider-color, unset);
      --nsh-divider-inset: var(--nsh-divider-inset, unset);
      --nsh-divider-thickness: var(--nsh-divider-thickness, unset);
      --nsh-divider-thickness-hairline: var(--nsh-divider-thickness-hairline, var(--nsh-divider-thickness, 1px));
      --nsh-divider-thickness-sm: var(--nsh-divider-thickness-sm, var(--nsh-divider-thickness, 2px));
      --nsh-divider-thickness-md: var(--nsh-divider-thickness-md, var(--nsh-divider-thickness, 4px));
    }

    .nsh-divider {
      --_div-color: var(--nsh-divider-color, var(--nsh-color-border));
      --_div-inset: var(--nsh-divider-inset, var(--nsh-space-lg));
      --_div-thickness: var(--nsh-divider-thickness-hairline);

      display: block;
      margin: 0;
      padding: 0;
      border: 0;
      background: var(--_div-color);
    }

    .nsh-divider--sm {
      --_div-thickness: var(--nsh-divider-thickness-sm);
    }
    .nsh-divider--md {
      --_div-thickness: var(--nsh-divider-thickness-md);
    }

    .nsh-divider--horizontal {
      width: 100%;
      height: var(--_div-thickness);
    }

    .nsh-divider--horizontal.nsh-divider--inset {
      margin-inline-start: var(--_div-inset);
      width: calc(100% - var(--_div-inset));
    }

    .nsh-divider--vertical {
      width: var(--_div-thickness);
      height: 100%;
      min-height: 100%;
    }

    .nsh-divider--vertical.nsh-divider--inset {
      margin-block-start: var(--_div-inset);
      height: calc(100% - var(--_div-inset));
    }
  `,
})
export class NshDividerComponent {
  readonly orientation = input<NshDividerOrientation>('horizontal');
  readonly inset = input(false, { transform: booleanAttribute });
  readonly thickness = input<NshDividerThickness>('hairline');

  readonly isVertical = computed(() => this.orientation() === 'vertical');
}
