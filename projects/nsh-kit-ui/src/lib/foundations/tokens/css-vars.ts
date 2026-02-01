import type { NshTokens } from './token-models';

export type NshCssVars = Record<`--nsh-${string}`, string>;

export function tokensToCssVars(tokens: NshTokens): NshCssVars {
  const vars: Record<string, string> = {};

  vars['--nsh-color-primary'] = tokens.colors.primary;
  vars['--nsh-color-secondary'] = tokens.colors.secondary;
  vars['--nsh-color-tertiary'] = tokens.colors.tertiary;
  vars['--nsh-color-success'] = tokens.colors.success;
  vars['--nsh-color-warn'] = tokens.colors.warn;
  vars['--nsh-color-danger'] = tokens.colors.danger;
  vars['--nsh-color-surface'] = tokens.colors.surface;
  vars['--nsh-color-surface-1'] = tokens.colors.surface1;
  vars['--nsh-color-surface-2'] = tokens.colors.surface2;
  vars['--nsh-color-text'] = tokens.colors.text;
  vars['--nsh-color-text-muted'] = tokens.colors.textMuted;
  vars['--nsh-color-text-disabled'] = tokens.colors.textDisabled;
  vars['--nsh-color-border'] = tokens.colors.border;
  vars['--nsh-color-outline'] = tokens.colors.outline;

  vars['--nsh-font-family'] = tokens.typography.fontFamily;
  vars['--nsh-font-size-xs'] = tokens.typography.fontSizeXs;
  vars['--nsh-font-size-sm'] = tokens.typography.fontSizeSm;
  vars['--nsh-font-size-md'] = tokens.typography.fontSizeMd;
  vars['--nsh-font-size-lg'] = tokens.typography.fontSizeLg;
  vars['--nsh-font-size-xl'] = tokens.typography.fontSizeXl;
  vars['--nsh-font-weight-regular'] = tokens.typography.fontWeightRegular;
  vars['--nsh-font-weight-medium'] = tokens.typography.fontWeightMedium;
  vars['--nsh-font-weight-semibold'] = tokens.typography.fontWeightSemibold;
  vars['--nsh-line-height-tight'] = tokens.typography.lineHeightTight;
  vars['--nsh-line-height-normal'] = tokens.typography.lineHeightNormal;
  vars['--nsh-line-height-relaxed'] = tokens.typography.lineHeightRelaxed;

  vars['--nsh-space-xs'] = tokens.spacing.spaceXs;
  vars['--nsh-space-sm'] = tokens.spacing.spaceSm;
  vars['--nsh-space-md'] = tokens.spacing.spaceMd;
  vars['--nsh-space-lg'] = tokens.spacing.spaceLg;
  vars['--nsh-space-xl'] = tokens.spacing.spaceXl;

  vars['--nsh-radius-sm'] = tokens.radius.radiusSm;
  vars['--nsh-radius-md'] = tokens.radius.radiusMd;
  vars['--nsh-radius-lg'] = tokens.radius.radiusLg;
  vars['--nsh-radius-pill'] = tokens.radius.radiusPill;

  vars['--nsh-elevation-0'] = tokens.elevation.elevation0;
  vars['--nsh-elevation-1'] = tokens.elevation.elevation1;
  vars['--nsh-elevation-2'] = tokens.elevation.elevation2;
  vars['--nsh-elevation-3'] = tokens.elevation.elevation3;

  vars['--nsh-motion-duration-fast'] = tokens.motion.durationFast;
  vars['--nsh-motion-duration-medium'] = tokens.motion.durationMedium;
  vars['--nsh-motion-duration-slow'] = tokens.motion.durationSlow;
  vars['--nsh-motion-easing-standard'] = tokens.motion.easingStandard;
  vars['--nsh-motion-easing-emphasized'] = tokens.motion.easingEmphasized;

  vars['--nsh-density-control-height'] = tokens.density.controlHeight;
  vars['--nsh-density-padding-inline'] = tokens.density.paddingInline;
  vars['--nsh-density-padding-block'] = tokens.density.paddingBlock;

  vars['--nsh-z-base'] = tokens.zIndex.base;
  vars['--nsh-z-dropdown'] = tokens.zIndex.dropdown;
  vars['--nsh-z-overlay'] = tokens.zIndex.overlay;
  vars['--nsh-z-tooltip'] = tokens.zIndex.tooltip;

  return vars as NshCssVars;
}
