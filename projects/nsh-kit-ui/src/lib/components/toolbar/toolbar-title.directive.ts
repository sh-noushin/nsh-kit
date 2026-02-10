import { Directive } from '@angular/core';

@Directive({
  selector: '[nshToolbarTitle]',
  standalone: true,
  host: {
    class: 'nsh-toolbar__title',
  },
})
export class NshToolbarTitleDirective {}
