import type {
  NshColorTokens,
  NshDensityTokens,
  NshElevationTokens,
  NshMotionTokens,
  NshRadiusTokens,
  NshSpacingTokens,
  NshTokens,
  NshTypographyTokens,
  NshZIndexTokens,
} from './token-models';

export type NshThemeMode = 'light' | 'dark';
export type NshDensityMode = 'comfortable' | 'compact';

export const NSH_DEFAULT_COLORS_LIGHT: NshColorTokens = {
  primary: '#2f6fed',
  secondary: '#7b61ff',
  tertiary: '#00a6a6',

  success: '#1a9c4b',
  warn: '#c77700',
  danger: '#d13b3b',

  surface: '#ffffff',
  surface1: '#f6f7fb',
  surface2: '#eef1f7',

  text: '#0f172a',
  textMuted: '#475569',
  textDisabled: '#94a3b8',

  border: '#d8deea',
  outline: '#9db3ff',
};

export const NSH_DEFAULT_COLORS_DARK: NshColorTokens = {
  primary: '#8db2ff',
  secondary: '#b6a7ff',
  tertiary: '#55d0d0',

  success: '#58d08b',
  warn: '#ffb65c',
  danger: '#ff7a7a',

  surface: '#0b1220',
  surface1: '#101a30',
  surface2: '#162241',

  text: '#e7edf8',
  textMuted: '#b6c2d6',
  textDisabled: '#7a8aa6',

  border: '#273451',
  outline: '#8db2ff',
};

export const NSH_DEFAULT_TYPOGRAPHY: NshTypographyTokens = {
  fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',

  fontSizeXs: '0.75rem',
  fontSizeSm: '0.875rem',
  fontSizeMd: '1rem',
  fontSizeLg: '1.125rem',
  fontSizeXl: '1.25rem',

  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',

  lineHeightTight: '1.2',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.7',
};

export const NSH_DEFAULT_SPACING: NshSpacingTokens = {
  spaceXs: '0.25rem',
  spaceSm: '0.5rem',
  spaceMd: '0.75rem',
  spaceLg: '1rem',
  spaceXl: '1.5rem',
};

export const NSH_DEFAULT_RADIUS: NshRadiusTokens = {
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusPill: '9999px',
};

export const NSH_DEFAULT_ELEVATION: NshElevationTokens = {
  elevation0: 'none',
  elevation1: '0 1px 2px rgba(15, 23, 42, 0.08)',
  elevation2: '0 6px 16px rgba(15, 23, 42, 0.14)',
  elevation3: '0 16px 40px rgba(15, 23, 42, 0.2)',
};

export const NSH_DEFAULT_MOTION: NshMotionTokens = {
  durationFast: '120ms',
  durationMedium: '200ms',
  durationSlow: '320ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',
};

export const NSH_DEFAULT_DENSITY_COMFORTABLE: NshDensityTokens = {
  controlHeight: '2.5rem',
  paddingInline: '0.75rem',
  paddingBlock: '0.5rem',
};

export const NSH_DEFAULT_DENSITY_COMPACT: NshDensityTokens = {
  controlHeight: '2.25rem',
  paddingInline: '0.625rem',
  paddingBlock: '0.375rem',
};

export const NSH_DEFAULT_Z_INDEX: NshZIndexTokens = {
  base: '0',
  dropdown: '1000',
  overlay: '1100',
  tooltip: '1200',
};

export function createNshDefaultTokens(mode: NshThemeMode, density: NshDensityMode): NshTokens {
  return {
    colors: mode === 'dark' ? NSH_DEFAULT_COLORS_DARK : NSH_DEFAULT_COLORS_LIGHT,
    typography: NSH_DEFAULT_TYPOGRAPHY,
    spacing: NSH_DEFAULT_SPACING,
    radius: NSH_DEFAULT_RADIUS,
    elevation: NSH_DEFAULT_ELEVATION,
    motion: NSH_DEFAULT_MOTION,
    density: density === 'compact' ? NSH_DEFAULT_DENSITY_COMPACT : NSH_DEFAULT_DENSITY_COMFORTABLE,
    zIndex: NSH_DEFAULT_Z_INDEX,
  };
}
