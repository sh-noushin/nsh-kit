import { ContentChild, Directive, TemplateRef, booleanAttribute, input } from '@angular/core';

import { NshCellDefDirective, NshHeaderCellDefDirective } from './table-cell-def.directive';

@Directive({
  selector: '[nshColumnDef]',
  standalone: true,
  exportAs: 'nshColumnDef',
})
export class NshColumnDefDirective<T = unknown> {
  readonly name = input.required<string>();

  readonly sortable = input(false, { transform: booleanAttribute });
  readonly sortId = input<string | null>(null);

  @ContentChild(NshHeaderCellDefDirective)
  headerCellDef?: NshHeaderCellDefDirective;

  @ContentChild(NshCellDefDirective)
  cellDef?: NshCellDefDirective<T>;

  getEffectiveSortId(): string {
    return this.sortId() ?? this.name();
  }

  getHeaderTemplateRef(): TemplateRef<unknown> | null {
    return this.headerCellDef?.templateRef ?? null;
  }

  getCellTemplateRef(): TemplateRef<unknown> | null {
    return this.cellDef?.templateRef ?? null;
  }
}
