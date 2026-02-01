export interface NshColorTokens {
  primary: string;
  secondary: string;
  tertiary: string;

  success: string;
  warn: string;
  danger: string;

  surface: string;
  surface1: string;
  surface2: string;

  text: string;
  textMuted: string;
  textDisabled: string;

  border: string;
  outline: string;
}

export interface NshTypographyTokens {
  fontFamily: string;

  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;

  fontWeightRegular: string;
  fontWeightMedium: string;
  fontWeightSemibold: string;

  lineHeightTight: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
}

export interface NshSpacingTokens {
  spaceXs: string;
  spaceSm: string;
  spaceMd: string;
  spaceLg: string;
  spaceXl: string;
}

export interface NshRadiusTokens {
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusPill: string;
}

export interface NshElevationTokens {
  elevation0: string;
  elevation1: string;
  elevation2: string;
  elevation3: string;
}

export interface NshMotionTokens {
  durationFast: string;
  durationMedium: string;
  durationSlow: string;
  easingStandard: string;
  easingEmphasized: string;
}

export interface NshDensityTokens {
  controlHeight: string;
  paddingInline: string;
  paddingBlock: string;
}

export interface NshZIndexTokens {
  base: string;
  dropdown: string;
  overlay: string;
  tooltip: string;
}

export interface NshTokens {
  colors: NshColorTokens;
  typography: NshTypographyTokens;
  spacing: NshSpacingTokens;
  radius: NshRadiusTokens;
  elevation: NshElevationTokens;
  motion: NshMotionTokens;
  density: NshDensityTokens;
  zIndex: NshZIndexTokens;
}
