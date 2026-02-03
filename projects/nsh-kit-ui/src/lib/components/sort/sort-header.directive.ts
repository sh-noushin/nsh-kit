import {
  Directive,
  ElementRef,
  HostListener,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';

import { NshSortDirective } from './sort.directive';

type AriaSort = 'ascending' | 'descending' | 'none';

function isNaturallyInteractive(tagName: string): boolean {
  return tagName === 'button' || tagName === 'a' || tagName === 'input' || tagName === 'select' || tagName === 'textarea';
}

@Directive({
  selector: '[nshSortHeader]',
  standalone: true,
  host: {
    '[class.nsh-sort-header]': 'true',
    '[class.nsh-sort-header--disabled]': 'disabled()',
    '[class.nsh-sort-active]': 'isActive()',
    '[class.nsh-sort-asc]': "isActive() && sortDirection() === 'asc'",
    '[class.nsh-sort-desc]': "isActive() && sortDirection() === 'desc'",

    '[attr.aria-sort]': 'ariaSort()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.role]': 'roleAttr()',
  },
})
export class NshSortHeaderDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sort = inject(NshSortDirective, { optional: true, host: true });

  readonly id = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);

  private readonly tagName = this.host.nativeElement.tagName.toLowerCase();

  readonly isActive = computed(() => (this.sort ? this.sort.active() === this.id() : false));
  readonly sortDirection = computed(() => (this.sort ? this.sort.direction() : ''));

  readonly ariaSort = computed<AriaSort | null>(() => {
    if (!this.isActive()) {
      return null;
    }

    const dir = this.sortDirection();
    if (dir === 'asc') {
      return 'ascending';
    }
    if (dir === 'desc') {
      return 'descending';
    }
    return null;
  });

  readonly roleAttr = computed(() => {
    if (isNaturallyInteractive(this.tagName)) {
      return null;
    }
    return 'button';
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled() || !this.sort) {
      return;
    }

    event.preventDefault();
    this.sort.sort(this.id());
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled() || !this.sort) {
      return;
    }

    const key = event.key;
    if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 'Space') {
      event.preventDefault();
      this.sort.sort(this.id());
    }
  }
}
