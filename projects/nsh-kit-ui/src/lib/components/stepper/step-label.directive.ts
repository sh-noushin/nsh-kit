import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[nshStepLabel]',
  standalone: true,
})
export class NshStepLabelDefDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
