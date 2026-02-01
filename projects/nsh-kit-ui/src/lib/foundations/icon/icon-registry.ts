import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NshIconRegistry {
  private readonly icons = new Map<string, string>();

  register(name: string, svg: string) {
    this.icons.set(name, svg);
  }

  registerMany(icons: Record<string, string>) {
    for (const [name, svg] of Object.entries(icons)) {
      this.register(name, svg);
    }
  }

  get(name: string): string | null {
    return this.icons.get(name) ?? null;
  }
}
