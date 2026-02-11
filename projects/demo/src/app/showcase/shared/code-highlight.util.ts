import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

export type SnippetLanguage = 'html' | 'typescript' | 'css';

let languagesRegistered = false;

function ensureLanguagesRegistered(): void {
  if (languagesRegistered) {
    return;
  }

  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('css', css);
  languagesRegistered = true;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toHighlightJsLanguage(language: SnippetLanguage): 'xml' | 'typescript' | 'css' {
  if (language === 'html') {
    return 'xml';
  }
  return language;
}

export function highlightSnippet(code: string, language: SnippetLanguage): string {
  if (!code) {
    return '';
  }

  ensureLanguagesRegistered();

  try {
    return hljs.highlight(code, { language: toHighlightJsLanguage(language) }).value;
  } catch {
    return escapeHtml(code);
  }
}
