import * as _angular_core from '@angular/core';
import { InjectionToken } from '@angular/core';

declare class NshFocusVisibleDirective {
    private readonly el;
    private readonly renderer;
    private readonly destroyRef;
    private readonly doc;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NshFocusVisibleDirective, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<NshFocusVisibleDirective, "[nshFocusVisible]", never, {}, {}, never, never, true, never>;
}

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface NshColorTokens {
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
interface NshTypographyTokens {
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
interface NshSpacingTokens {
    spaceXs: string;
    spaceSm: string;
    spaceMd: string;
    spaceLg: string;
    spaceXl: string;
}
interface NshRadiusTokens {
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusPill: string;
}
interface NshElevationTokens {
    elevation0: string;
    elevation1: string;
    elevation2: string;
    elevation3: string;
}
interface NshMotionTokens {
    durationFast: string;
    durationMedium: string;
    durationSlow: string;
    easingStandard: string;
    easingEmphasized: string;
}
interface NshDensityTokens {
    controlHeight: string;
    paddingInline: string;
    paddingBlock: string;
}
interface NshZIndexTokens {
    base: string;
    dropdown: string;
    overlay: string;
    tooltip: string;
}
interface NshTokens {
    colors: NshColorTokens;
    typography: NshTypographyTokens;
    spacing: NshSpacingTokens;
    radius: NshRadiusTokens;
    elevation: NshElevationTokens;
    motion: NshMotionTokens;
    density: NshDensityTokens;
    zIndex: NshZIndexTokens;
}

type NshCssVars = Record<`--nsh-${string}`, string>;
declare function tokensToCssVars(tokens: NshTokens): NshCssVars;

type NshThemeMode = 'light' | 'dark';
type NshDensityMode = 'comfortable' | 'compact';
declare const NSH_DEFAULT_COLORS_LIGHT: NshColorTokens;
declare const NSH_DEFAULT_COLORS_DARK: NshColorTokens;
declare const NSH_DEFAULT_TYPOGRAPHY: NshTypographyTokens;
declare const NSH_DEFAULT_SPACING: NshSpacingTokens;
declare const NSH_DEFAULT_RADIUS: NshRadiusTokens;
declare const NSH_DEFAULT_ELEVATION: NshElevationTokens;
declare const NSH_DEFAULT_MOTION: NshMotionTokens;
declare const NSH_DEFAULT_DENSITY_COMFORTABLE: NshDensityTokens;
declare const NSH_DEFAULT_DENSITY_COMPACT: NshDensityTokens;
declare const NSH_DEFAULT_Z_INDEX: NshZIndexTokens;
declare function createNshDefaultTokens(mode: NshThemeMode, density: NshDensityMode): NshTokens;

declare function mergeDeep<T>(base: T, overrides?: DeepPartial<T>): T;

interface NshTheme {
    mode: NshThemeMode;
    density: NshDensityMode;
    tokens: NshTokens;
}
interface NshThemeConfig {
    mode?: NshThemeMode;
    density?: NshDensityMode;
    tokens?: DeepPartial<NshTokens>;
}

declare class NshThemeDirective {
    private readonly el;
    private readonly renderer;
    private readonly themeService;
    readonly config: _angular_core.InputSignal<NshThemeConfig | null>;
    private readonly effectiveMode;
    private readonly effectiveDensity;
    private readonly effectiveTokens;
    private readonly effectiveCssVars;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NshThemeDirective, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<NshThemeDirective, "[nshTheme]", never, { "config": { "alias": "nshTheme"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class NshThemeService {
    private readonly defaults;
    readonly mode: _angular_core.WritableSignal<NshThemeMode>;
    readonly density: _angular_core.WritableSignal<NshDensityMode>;
    readonly tokenOverrides: _angular_core.WritableSignal<DeepPartial<NshTokens>>;
    readonly tokens: _angular_core.Signal<NshTokens>;
    readonly theme: _angular_core.Signal<NshTheme>;
    readonly cssVars: _angular_core.Signal<NshCssVars>;
    setMode(mode: NshThemeMode): void;
    setDensity(density: NshDensityMode): void;
    setTokenOverrides(overrides: DeepPartial<NshTokens>): void;
    patchTokenOverrides(overrides: DeepPartial<NshTokens>): void;
    applyConfig(config: NshThemeConfig): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NshThemeService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<NshThemeService>;
}

declare const NSH_THEME_DEFAULTS: InjectionToken<NshThemeConfig>;
declare function provideNshTheme(config: NshThemeConfig): _angular_core.EnvironmentProviders;

declare class NshIconComponent {
    private readonly registry;
    readonly name: _angular_core.InputSignal<string>;
    readonly size: _angular_core.InputSignal<string | number>;
    readonly ariaLabel: _angular_core.InputSignal<string | undefined>;
    readonly svg: _angular_core.Signal<string | null>;
    readonly sizeCss: _angular_core.Signal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NshIconComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<NshIconComponent, "nsh-icon", never, { "name": { "alias": "name"; "required": true; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

declare class NshIconRegistry {
    private readonly icons;
    register(name: string, svg: string): void;
    registerMany(icons: Record<string, string>): void;
    get(name: string): string | null;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NshIconRegistry, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<NshIconRegistry>;
}

declare function provideNshIcons(icons: Record<string, string>): _angular_core.EnvironmentProviders;

type NshButtonSize = 'sm' | 'md' | 'lg';
type NshButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';
type NshButtonColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warn' | 'danger' | 'neutral';
declare class NshButtonComponent {
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    readonly loading: _angular_core.InputSignalWithTransform<boolean, unknown>;
    readonly size: _angular_core.InputSignal<NshButtonSize>;
    readonly variant: _angular_core.InputSignal<NshButtonVariant>;
    readonly color: _angular_core.InputSignal<NshButtonColor>;
    readonly ariaLabel: _angular_core.InputSignal<string | undefined>;
    readonly leadingIcon: _angular_core.InputSignal<string | undefined>;
    readonly trailingIcon: _angular_core.InputSignal<string | undefined>;
    readonly isDisabled: _angular_core.Signal<boolean>;
    readonly iconSize: _angular_core.Signal<string>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<NshButtonComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<NshButtonComponent, "nsh-button", never, { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "loading": { "alias": "loading"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "color": { "alias": "color"; "required": false; "isSignal": true; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; "isSignal": true; }; "leadingIcon": { "alias": "leadingIcon"; "required": false; "isSignal": true; }; "trailingIcon": { "alias": "trailingIcon"; "required": false; "isSignal": true; }; }, {}, never, ["*"], true, never>;
}

export { NSH_DEFAULT_COLORS_DARK, NSH_DEFAULT_COLORS_LIGHT, NSH_DEFAULT_DENSITY_COMFORTABLE, NSH_DEFAULT_DENSITY_COMPACT, NSH_DEFAULT_ELEVATION, NSH_DEFAULT_MOTION, NSH_DEFAULT_RADIUS, NSH_DEFAULT_SPACING, NSH_DEFAULT_TYPOGRAPHY, NSH_DEFAULT_Z_INDEX, NSH_THEME_DEFAULTS, NshButtonComponent, NshFocusVisibleDirective, NshIconComponent, NshIconRegistry, NshThemeDirective, NshThemeService, createNshDefaultTokens, mergeDeep, provideNshIcons, provideNshTheme, tokensToCssVars };
export type { DeepPartial, NshButtonColor, NshButtonSize, NshButtonVariant, NshColorTokens, NshDensityMode, NshDensityTokens, NshElevationTokens, NshMotionTokens, NshRadiusTokens, NshSpacingTokens, NshTheme, NshThemeConfig, NshThemeMode, NshTokens, NshTypographyTokens, NshZIndexTokens };
