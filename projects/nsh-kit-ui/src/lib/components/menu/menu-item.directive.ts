import {
  Directive,
  ElementRef,
  HostListener,
  computed,
  inject,
} from '@angular/core';

@Directive({
  selector: '[nshMenuItem]',
  standalone: true,
  host: {
    '[attr.role]': "'menuitem'",
    '[attr.aria-disabled]': 'ariaDisabled()',
  },
})
export class NshMenuItemDirective {
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly disabled = computed(() => this.isHostDisabled());

  readonly ariaDisabled = computed(() => {
    const host = this.elRef.nativeElement;
    if (host instanceof HTMLButtonElement) {
      return null;
    }

    return this.disabled() ? 'true' : null;
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
  }

  private isHostDisabled(): boolean {
    const host = this.elRef.nativeElement;

    if (host instanceof HTMLButtonElement) {
      return host.disabled;
    }

    if (host.hasAttribute('disabled')) {
      return true;
    }

    const ariaDisabled = host.getAttribute('aria-disabled');
    if (ariaDisabled === 'true') {
      return true;
    }

    return false;
  }
}
