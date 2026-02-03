import { Directive, booleanAttribute, input, output } from '@angular/core';

export type NshSortDirection = 'asc' | 'desc' | '';

export interface NshSortChange {
  active: string;
  direction: NshSortDirection;
}

function nextDirection(current: NshSortDirection, disableClear: boolean): NshSortDirection {
  if (disableClear) {
    return current === 'asc' ? 'desc' : 'asc';
  }

  switch (current) {
    case '':
      return 'asc';
    case 'asc':
      return 'desc';
    case 'desc':
      return '';
  }
}

@Directive({
  selector: '[nshSort]',
  standalone: true,
  exportAs: 'nshSort',
})
export class NshSortDirective {
  readonly active = input<string | null>(null);
  readonly direction = input<NshSortDirection>('');
  readonly disableClear = input(false, { transform: booleanAttribute });

  readonly sortChange = output<NshSortChange>();

  sort(id: string) {
    const nextActive = id;

    if (this.active() !== id) {
      this.sortChange.emit({ active: nextActive, direction: 'asc' });
      return;
    }

    const currentDirection = this.direction();
    const newDirection = nextDirection(currentDirection, this.disableClear());
    this.sortChange.emit({ active: nextActive, direction: newDirection });
  }
}
