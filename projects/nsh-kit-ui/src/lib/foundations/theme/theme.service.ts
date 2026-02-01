import { Injectable, computed, inject, signal } from '@angular/core';

import {
  createNshDefaultTokens,
  mergeDeep,
  tokensToCssVars,
  type DeepPartial,
  type NshDensityMode,
  type NshThemeMode,
  type NshTokens,
} from '../tokens';
import type { NshTheme, NshThemeConfig } from './theme.model';
import { NSH_THEME_DEFAULTS } from './theme.providers';

@Injectable({ providedIn: 'root' })
export class NshThemeService {
  private readonly defaults = inject(NSH_THEME_DEFAULTS, { optional: true });

  readonly mode = signal<NshThemeMode>(this.defaults?.mode ?? 'light');
  readonly density = signal<NshDensityMode>(this.defaults?.density ?? 'comfortable');
  readonly tokenOverrides = signal<DeepPartial<NshTokens>>(this.defaults?.tokens ?? {});

  readonly tokens = computed(() => {
    const base = createNshDefaultTokens(this.mode(), this.density());
    return mergeDeep(base, this.tokenOverrides());
  });

  readonly theme = computed<NshTheme>(() => ({
    mode: this.mode(),
    density: this.density(),
    tokens: this.tokens(),
  }));

  readonly cssVars = computed(() => tokensToCssVars(this.tokens()));

  setMode(mode: NshThemeMode) {
    this.mode.set(mode);
  }

  setDensity(density: NshDensityMode) {
    this.density.set(density);
  }

  setTokenOverrides(overrides: DeepPartial<NshTokens>) {
    this.tokenOverrides.set(overrides);
  }

  patchTokenOverrides(overrides: DeepPartial<NshTokens>) {
    this.tokenOverrides.update((current) => mergeDeep(current, overrides));
  }

  applyConfig(config: NshThemeConfig) {
    if (config.mode) {
      this.mode.set(config.mode);
    }
    if (config.density) {
      this.density.set(config.density);
    }
    if (config.tokens) {
      this.tokenOverrides.set(config.tokens);
    }
  }
}
