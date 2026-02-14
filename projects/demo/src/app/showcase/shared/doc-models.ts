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

export interface DocOverviewCodeBlock {
  language: 'ts' | 'html' | 'css' | 'text';
  code: string;
}

export interface DocOverviewSection {
  title: string;
  paragraphs?: ReadonlyArray<string>;
  bullets?: ReadonlyArray<string>;
  codeBlocks?: ReadonlyArray<DocOverviewCodeBlock>;
}

export interface DocEntry {
  id: string;
  title: string;
  description: string;
  overview?: ReadonlyArray<string>;
  overviewSections?: ReadonlyArray<DocOverviewSection>;
  usage?: ReadonlyArray<string>;
  stylingGuide?: ReadonlyArray<string>;
  route: string;
  category: DocCategoryId;
  exampleProvider: () => ReadonlyArray<DocExample>;
  tokenDescriptions?: Readonly<Record<string, string>>;
}
