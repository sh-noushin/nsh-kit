import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  input,
  viewChild,
} from '@angular/core';

let nextMenuId = 0;

@Component({
  selector: 'nsh-menu',
  exportAs: 'nshMenu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
})
export class NshMenuComponent {
  readonly ariaLabel = input<string | null>(null);
  readonly width = input<string | null>(null);
  readonly closeOnItemClick = input(true, { transform: booleanAttribute });

  private readonly autoId = `nsh-menu-${nextMenuId++}`;
  readonly id = computed(() => this.autoId);

  private readonly contentTpl = viewChild.required<TemplateRef<unknown>>('content');
  readonly template = computed(() => this.contentTpl());
}
