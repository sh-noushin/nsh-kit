import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, booleanAttribute, computed, input } from '@angular/core';

export type NshTabId = string;

let nextTabAutoId = 0;

@Component({
  selector: 'nsh-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #contentTpl>
      <ng-content />
    </ng-template>
  `,
  styles: `
    :host {
      display: none;
    }
  `,
})
export class NshTabComponent {
  @ViewChild('contentTpl', { static: true })
  readonly contentTpl!: TemplateRef<unknown>;

  private readonly autoId: NshTabId = `nsh-tab-${nextTabAutoId++}`;

  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly icon = input<string | null>(null);
  readonly id = input<string | null>(null);

  readonly resolvedId = computed(() => this.id() ?? this.autoId);
}
