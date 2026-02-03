import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

let nextOptionId = 0;

function readTrimmedText(el: HTMLElement): string {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

@Component({
  selector: 'nsh-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nsh-option-host]': 'true',
    '[attr.aria-hidden]': "'true'",
  },
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: none;
    }
  `,
})
export class NshOptionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly value = input.required<string | number>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly id = `nsh-option-${nextOptionId++}`;

  private readonly labelText = signal('');

  readonly label = computed(() => this.labelText());

  constructor() {
    const el = this.hostEl.nativeElement;

    const recompute = () => {
      this.labelText.set(readTrimmedText(el));
    };

    recompute();

    const observer = new MutationObserver(() => recompute());
    observer.observe(el, { childList: true, subtree: true, characterData: true });

    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
