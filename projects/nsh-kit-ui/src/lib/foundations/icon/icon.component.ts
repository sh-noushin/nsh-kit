import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NshIconRegistry } from './icon-registry';

@Component({
  selector: 'nsh-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (svg(); as markup) {
      <span
        class="nsh-icon"
        [style.width]="sizeCss()"
        [style.height]="sizeCss()"
        [attr.role]="ariaLabel() ? 'img' : null"
        [attr.aria-label]="ariaLabel() ?? null"
        [attr.aria-hidden]="ariaLabel() ? null : 'true'"
      >
        <span class="nsh-icon__svg" [innerHTML]="markup"></span>
      </span>
    }
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
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: inherit;
    }

    .nsh-icon__svg :where(svg) {
      display: block;
      width: 100%;
      height: 100%;
      color: inherit;
      fill: currentColor;
      stroke: currentColor;
      vertical-align: middle;
    }
  `,
})
export class NshIconComponent {
  private readonly registry = inject(NshIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly size = input<number | string>(24);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly svg = computed(() => {
    const markup = this.registry.get(this.name());
    if (!markup) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustHtml(markup);
  });

  readonly sizeCss = computed(() => {
    const size = this.size();
    return typeof size === 'number' ? `${size}px` : size;
  });
}
