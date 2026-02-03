import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[nshHeaderCell]',
  standalone: true,
})
export class NshHeaderCellDefDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[nshCell]',
  standalone: true,
})
export class NshCellDefDirective<T = unknown> {
  readonly templateRef = inject<TemplateRef<T>>(TemplateRef);
}
