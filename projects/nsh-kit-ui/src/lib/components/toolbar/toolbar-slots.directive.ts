import { Directive } from '@angular/core';

@Directive({
  selector: '[nshToolbarStart]',
  standalone: true,
})
export class NshToolbarStartDirective {}

@Directive({
  selector: '[nshToolbarCenter]',
  standalone: true,
})
export class NshToolbarCenterDirective {}

@Directive({
  selector: '[nshToolbarEnd]',
  standalone: true,
})
export class NshToolbarEndDirective {}
