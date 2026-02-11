import type { Type } from '@angular/core';

export type DocCategoryId = 'components' | 'forms' | 'overlays' | 'foundations';

export interface DocCategory {
  id: DocCategoryId;
  title: string;
}

export interface DocExample {
  title: string;
  html: string;
  ts: string;
  component: Type<unknown>;
}

export interface DocEntry {
  id: string;
  title: string;
  description: string;
  route: string;
  category: DocCategoryId;
  exampleProvider: () => ReadonlyArray<DocExample>;
}
