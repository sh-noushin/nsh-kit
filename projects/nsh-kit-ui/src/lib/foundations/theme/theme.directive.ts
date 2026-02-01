import {
  Directive,
  ElementRef,
  Renderer2,
  RendererStyleFlags2,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';

import {
  createNshDefaultTokens,
  mergeDeep,
  tokensToCssVars,
  type DeepPartial,
  type NshDensityMode,
  type NshThemeMode,
  type NshTokens,
} from '../tokens';
import type { NshThemeConfig } from './theme.model';
import { NshThemeService } from './theme.service';

@Directive({
  selector: '[nshTheme]',
  standalone: true,
})
export class NshThemeDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(NshThemeService);

  readonly config = input<NshThemeConfig | null>(null, { alias: 'nshTheme' });

  private readonly effectiveMode = computed<NshThemeMode>(() =>
    this.config()?.mode ?? this.themeService.mode(),
  );

  private readonly effectiveDensity = computed<NshDensityMode>(() =>
    this.config()?.density ?? this.themeService.density(),
  );

  private readonly effectiveTokens = computed<NshTokens>(() => {
    const base = createNshDefaultTokens(this.effectiveMode(), this.effectiveDensity());
    const merged = mergeDeep(base, this.themeService.tokenOverrides());
    return mergeDeep(merged, (this.config()?.tokens ?? {}) as DeepPartial<NshTokens>);
  });

  private readonly effectiveCssVars = computed(() => tokensToCssVars(this.effectiveTokens()));

  constructor() {
    effect(() => {
      const vars = this.effectiveCssVars();
      const host = this.el.nativeElement;
      for (const [name, value] of Object.entries(vars)) {
        this.renderer.setStyle(host, name, value, RendererStyleFlags2.DashCase);
      }
    });
  }
}
