import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NshIconRegistry } from './icon-registry';

@Component({
  selector: 'nsh-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="nsh-icon"
      [style.width]="sizeCss()"
      [style.height]="sizeCss()"
      [attr.role]="ariaLabel() ? 'img' : null"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-hidden]="ariaLabel() ? null : 'true'"
    >
      @if (svg(); as markup) {
        <span class="nsh-icon__svg" [innerHTML]="markup"></span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .nsh-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }

    .nsh-icon__svg {
      display: inline-flex;
      width: 100%;
      height: 100%;
    }

    .nsh-icon__svg :where(svg) {
      width: 100%;
      height: 100%;
      fill: currentColor;
      stroke: currentColor;
    }
  `,
})
export class NshIconComponent {
  private readonly registry = inject(NshIconRegistry);

  readonly name = input.required<string>();
  readonly size = input<number | string>(24);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly svg = computed(() => this.registry.get(this.name()));

  readonly sizeCss = computed(() => {
    const size = this.size();
    return typeof size === 'number' ? `${size}px` : size;
  });
}
