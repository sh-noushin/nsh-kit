import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

import { NshStepLabelDefDirective } from './step-label.directive';

export type NshStepId = string;

let nextStepAutoId = 0;

@Component({
  selector: 'nsh-step',
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
export class NshStepComponent {
  @ViewChild('contentTpl', { static: true })
  readonly contentTpl!: TemplateRef<unknown>;

  @ContentChild(NshStepLabelDefDirective)
  readonly labelTemplate?: NshStepLabelDefDirective;

  private readonly autoId: NshStepId = `nsh-step-${nextStepAutoId++}`;

  readonly label = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly completed = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });
  readonly editable = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly icon = input<string | null>(null);

  readonly resolvedId = computed(() => this.autoId);
}
