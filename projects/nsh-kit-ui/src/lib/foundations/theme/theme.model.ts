import type { DeepPartial, NshDensityMode, NshThemeMode, NshTokens } from '../tokens';

export interface NshTheme {
  mode: NshThemeMode;
  density: NshDensityMode;
  tokens: NshTokens;
}

export interface NshThemeConfig {
  mode?: NshThemeMode;
  density?: NshDensityMode;
  tokens?: DeepPartial<NshTokens>;
}
