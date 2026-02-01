import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, Renderer2, inject } from '@angular/core';

let hadKeyboardEvent = false;
let listenersAttached = false;

function attachGlobalListeners(doc: Document) {
  if (listenersAttached) {
    return;
  }
  listenersAttached = true;

  const onKeyDown = () => {
    hadKeyboardEvent = true;
  };
  const onPointer = () => {
    hadKeyboardEvent = false;
  };

  doc.addEventListener('keydown', onKeyDown, true);
  doc.addEventListener('pointerdown', onPointer, true);
  doc.addEventListener('mousedown', onPointer, true);
  doc.addEventListener('touchstart', onPointer, true);
}

@Directive({
  selector: '[nshFocusVisible]',
  standalone: true,
})
export class NshFocusVisibleDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    attachGlobalListeners(this.doc);

    const element = this.el.nativeElement;
    const onFocus = () => {
      if (hadKeyboardEvent) {
        this.renderer.addClass(element, 'nsh-focus-visible');
      }
    };
    const onBlur = () => {
      this.renderer.removeClass(element, 'nsh-focus-visible');
    };

    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);

    this.destroyRef.onDestroy(() => {
      element.removeEventListener('focus', onFocus);
      element.removeEventListener('blur', onBlur);
    });
  }
}
