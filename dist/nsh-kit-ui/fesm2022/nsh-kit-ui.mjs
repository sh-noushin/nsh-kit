import { DOCUMENT } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, ElementRef, Renderer2, DestroyRef, Directive, InjectionToken, makeEnvironmentProviders, ENVIRONMENT_INITIALIZER, signal, computed, Injectable, input, effect, RendererStyleFlags2, ChangeDetectionStrategy, Component, booleanAttribute } from '@angular/core';

let hadKeyboardEvent = false;
let listenersAttached = false;
function attachGlobalListeners(doc) {
    if (listenersAttached) {
        return;
    }
    listenersAttached = true;
    const onKeyDown = () => {
        hadKeyboardEvent = true;
    };
    const onPointer = () => {
        hadKeyboardEvent = false;
    };
    doc.addEventListener('keydown', onKeyDown, true);
    doc.addEventListener('pointerdown', onPointer, true);
    doc.addEventListener('mousedown', onPointer, true);
    doc.addEventListener('touchstart', onPointer, true);
}
class NshFocusVisibleDirective {
    el = inject((ElementRef));
    renderer = inject(Renderer2);
    destroyRef = inject(DestroyRef);
    doc = inject(DOCUMENT);
    constructor() {
        attachGlobalListeners(this.doc);
        const element = this.el.nativeElement;
        const onFocus = () => {
            if (hadKeyboardEvent) {
                this.renderer.addClass(element, 'nsh-focus-visible');
            }
        };
        const onBlur = () => {
            this.renderer.removeClass(element, 'nsh-focus-visible');
        };
        element.addEventListener('focus', onFocus);
        element.addEventListener('blur', onBlur);
        this.destroyRef.onDestroy(() => {
            element.removeEventListener('focus', onFocus);
            element.removeEventListener('blur', onBlur);
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshFocusVisibleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.2", type: NshFocusVisibleDirective, isStandalone: true, selector: "[nshFocusVisible]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshFocusVisibleDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[nshFocusVisible]',
                    standalone: true,
                }]
        }], ctorParameters: () => [] });

function tokensToCssVars(tokens) {
    const vars = {};
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
    return vars;
}

const NSH_DEFAULT_COLORS_LIGHT = {
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
const NSH_DEFAULT_COLORS_DARK = {
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
const NSH_DEFAULT_TYPOGRAPHY = {
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
const NSH_DEFAULT_SPACING = {
    spaceXs: '0.25rem',
    spaceSm: '0.5rem',
    spaceMd: '0.75rem',
    spaceLg: '1rem',
    spaceXl: '1.5rem',
};
const NSH_DEFAULT_RADIUS = {
    radiusSm: '0.25rem',
    radiusMd: '0.5rem',
    radiusLg: '0.75rem',
    radiusPill: '9999px',
};
const NSH_DEFAULT_ELEVATION = {
    elevation0: 'none',
    elevation1: '0 1px 2px rgba(15, 23, 42, 0.08)',
    elevation2: '0 6px 16px rgba(15, 23, 42, 0.14)',
    elevation3: '0 16px 40px rgba(15, 23, 42, 0.2)',
};
const NSH_DEFAULT_MOTION = {
    durationFast: '120ms',
    durationMedium: '200ms',
    durationSlow: '320ms',
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',
};
const NSH_DEFAULT_DENSITY_COMFORTABLE = {
    controlHeight: '2.5rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
};
const NSH_DEFAULT_DENSITY_COMPACT = {
    controlHeight: '2.25rem',
    paddingInline: '0.625rem',
    paddingBlock: '0.375rem',
};
const NSH_DEFAULT_Z_INDEX = {
    base: '0',
    dropdown: '1000',
    overlay: '1100',
    tooltip: '1200',
};
function createNshDefaultTokens(mode, density) {
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

function mergeDeep(base, overrides) {
    if (!overrides) {
        return base;
    }
    if (typeof base !== 'object' || base === null) {
        return base;
    }
    const result = Array.isArray(base) ? [...base] : { ...base };
    for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined) {
            continue;
        }
        const current = result[key];
        if (typeof value === 'object' && value !== null && typeof current === 'object' && current !== null) {
            result[key] = mergeDeep(current, value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}

const NSH_THEME_DEFAULTS = new InjectionToken('NSH_THEME_DEFAULTS');
function provideNshTheme(config) {
    return makeEnvironmentProviders([
        { provide: NSH_THEME_DEFAULTS, useValue: config },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue: () => {
                const service = inject(NshThemeService);
                service.applyConfig(config);
            },
        },
    ]);
}

class NshThemeService {
    defaults = inject(NSH_THEME_DEFAULTS, { optional: true });
    mode = signal(this.defaults?.mode ?? 'light', ...(ngDevMode ? [{ debugName: "mode" }] : []));
    density = signal(this.defaults?.density ?? 'comfortable', ...(ngDevMode ? [{ debugName: "density" }] : []));
    tokenOverrides = signal(this.defaults?.tokens ?? {}, ...(ngDevMode ? [{ debugName: "tokenOverrides" }] : []));
    tokens = computed(() => {
        const base = createNshDefaultTokens(this.mode(), this.density());
        return mergeDeep(base, this.tokenOverrides());
    }, ...(ngDevMode ? [{ debugName: "tokens" }] : []));
    theme = computed(() => ({
        mode: this.mode(),
        density: this.density(),
        tokens: this.tokens(),
    }), ...(ngDevMode ? [{ debugName: "theme" }] : []));
    cssVars = computed(() => tokensToCssVars(this.tokens()), ...(ngDevMode ? [{ debugName: "cssVars" }] : []));
    setMode(mode) {
        this.mode.set(mode);
    }
    setDensity(density) {
        this.density.set(density);
    }
    setTokenOverrides(overrides) {
        this.tokenOverrides.set(overrides);
    }
    patchTokenOverrides(overrides) {
        this.tokenOverrides.update((current) => mergeDeep(current, overrides));
    }
    applyConfig(config) {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshThemeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshThemeService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshThemeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class NshThemeDirective {
    el = inject((ElementRef));
    renderer = inject(Renderer2);
    themeService = inject(NshThemeService);
    config = input(null, { ...(ngDevMode ? { debugName: "config" } : {}), alias: 'nshTheme' });
    effectiveMode = computed(() => this.config()?.mode ?? this.themeService.mode(), ...(ngDevMode ? [{ debugName: "effectiveMode" }] : []));
    effectiveDensity = computed(() => this.config()?.density ?? this.themeService.density(), ...(ngDevMode ? [{ debugName: "effectiveDensity" }] : []));
    effectiveTokens = computed(() => {
        const base = createNshDefaultTokens(this.effectiveMode(), this.effectiveDensity());
        const merged = mergeDeep(base, this.themeService.tokenOverrides());
        return mergeDeep(merged, (this.config()?.tokens ?? {}));
    }, ...(ngDevMode ? [{ debugName: "effectiveTokens" }] : []));
    effectiveCssVars = computed(() => tokensToCssVars(this.effectiveTokens()), ...(ngDevMode ? [{ debugName: "effectiveCssVars" }] : []));
    constructor() {
        effect(() => {
            const vars = this.effectiveCssVars();
            const host = this.el.nativeElement;
            for (const [name, value] of Object.entries(vars)) {
                this.renderer.setStyle(host, name, value, RendererStyleFlags2.DashCase);
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshThemeDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "21.1.2", type: NshThemeDirective, isStandalone: true, selector: "[nshTheme]", inputs: { config: { classPropertyName: "config", publicName: "nshTheme", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshThemeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[nshTheme]',
                    standalone: true,
                }]
        }], ctorParameters: () => [], propDecorators: { config: [{ type: i0.Input, args: [{ isSignal: true, alias: "nshTheme", required: false }] }] } });

class NshIconRegistry {
    icons = new Map();
    register(name, svg) {
        this.icons.set(name, svg);
    }
    registerMany(icons) {
        for (const [name, svg] of Object.entries(icons)) {
            this.register(name, svg);
        }
    }
    get(name) {
        return this.icons.get(name) ?? null;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshIconRegistry, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshIconRegistry, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshIconRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class NshIconComponent {
    registry = inject(NshIconRegistry);
    name = input.required(...(ngDevMode ? [{ debugName: "name" }] : []));
    size = input(24, ...(ngDevMode ? [{ debugName: "size" }] : []));
    ariaLabel = input(undefined, ...(ngDevMode ? [{ debugName: "ariaLabel" }] : []));
    svg = computed(() => this.registry.get(this.name()), ...(ngDevMode ? [{ debugName: "svg" }] : []));
    sizeCss = computed(() => {
        const size = this.size();
        return typeof size === 'number' ? `${size}px` : size;
    }, ...(ngDevMode ? [{ debugName: "sizeCss" }] : []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.2", type: NshIconComponent, isStandalone: true, selector: "nsh-icon", inputs: { name: { classPropertyName: "name", publicName: "name", isSignal: true, isRequired: true, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <span
      class="nsh-icon"
      [style.width]="sizeCss()"
      [style.height]="sizeCss()"
      [attr.role]="ariaLabel() ? 'img' : null"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-hidden]="ariaLabel() ? null : 'true'"
    >
      @if (svg(); as markup) {
        <span class="nsh-icon__svg" [innerHTML]="markup"></span>
      }
    </span>
  `, isInline: true, styles: [":host{display:inline-flex;align-items:center;justify-content:center}.nsh-icon{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}.nsh-icon__svg{display:inline-flex;width:100%;height:100%}.nsh-icon__svg :where(svg){width:100%;height:100%;fill:currentColor;stroke:currentColor}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'nsh-icon', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <span
      class="nsh-icon"
      [style.width]="sizeCss()"
      [style.height]="sizeCss()"
      [attr.role]="ariaLabel() ? 'img' : null"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-hidden]="ariaLabel() ? null : 'true'"
    >
      @if (svg(); as markup) {
        <span class="nsh-icon__svg" [innerHTML]="markup"></span>
      }
    </span>
  `, styles: [":host{display:inline-flex;align-items:center;justify-content:center}.nsh-icon{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}.nsh-icon__svg{display:inline-flex;width:100%;height:100%}.nsh-icon__svg :where(svg){width:100%;height:100%;fill:currentColor;stroke:currentColor}\n"] }]
        }], propDecorators: { name: [{ type: i0.Input, args: [{ isSignal: true, alias: "name", required: true }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }] } });

function provideNshIcons(icons) {
    return makeEnvironmentProviders([
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue: () => {
                inject(NshIconRegistry).registerMany(icons);
            },
        },
    ]);
}

class NshButtonComponent {
    disabled = input(false, { ...(ngDevMode ? { debugName: "disabled" } : {}), transform: booleanAttribute });
    loading = input(false, { ...(ngDevMode ? { debugName: "loading" } : {}), transform: booleanAttribute });
    size = input('md', ...(ngDevMode ? [{ debugName: "size" }] : []));
    variant = input('filled', ...(ngDevMode ? [{ debugName: "variant" }] : []));
    color = input('primary', ...(ngDevMode ? [{ debugName: "color" }] : []));
    ariaLabel = input(undefined, ...(ngDevMode ? [{ debugName: "ariaLabel" }] : []));
    leadingIcon = input(undefined, ...(ngDevMode ? [{ debugName: "leadingIcon" }] : []));
    trailingIcon = input(undefined, ...(ngDevMode ? [{ debugName: "trailingIcon" }] : []));
    isDisabled = computed(() => this.disabled() || this.loading(), ...(ngDevMode ? [{ debugName: "isDisabled" }] : []));
    iconSize = computed(() => '1.125em', ...(ngDevMode ? [{ debugName: "iconSize" }] : []));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.2", type: NshButtonComponent, isStandalone: true, selector: "nsh-button", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, loading: { classPropertyName: "loading", publicName: "loading", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, color: { classPropertyName: "color", publicName: "color", isSignal: true, isRequired: false, transformFunction: null }, ariaLabel: { classPropertyName: "ariaLabel", publicName: "ariaLabel", isSignal: true, isRequired: false, transformFunction: null }, leadingIcon: { classPropertyName: "leadingIcon", publicName: "leadingIcon", isSignal: true, isRequired: false, transformFunction: null }, trailingIcon: { classPropertyName: "trailingIcon", publicName: "trailingIcon", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: `
    <button
      nshFocusVisible
      class="nsh-button"
      type="button"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-busy]="loading() ? 'true' : null"
      [class.nsh-button--sm]="size() === 'sm'"
      [class.nsh-button--md]="size() === 'md'"
      [class.nsh-button--lg]="size() === 'lg'"
      [class.nsh-button--filled]="variant() === 'filled'"
      [class.nsh-button--tonal]="variant() === 'tonal'"
      [class.nsh-button--outlined]="variant() === 'outlined'"
      [class.nsh-button--text]="variant() === 'text'"
      [class.nsh-button--primary]="color() === 'primary'"
      [class.nsh-button--secondary]="color() === 'secondary'"
      [class.nsh-button--tertiary]="color() === 'tertiary'"
      [class.nsh-button--success]="color() === 'success'"
      [class.nsh-button--warn]="color() === 'warn'"
      [class.nsh-button--danger]="color() === 'danger'"
      [class.nsh-button--neutral]="color() === 'neutral'"
      [class.nsh-button--loading]="loading()"
    >
      <span class="nsh-button__content">
        @if (loading()) {
          <span class="nsh-button__spinner" aria-hidden="true"></span>
        }

        @if (leadingIcon(); as iconName) {
          <nsh-icon class="nsh-button__icon" [name]="iconName" [size]="iconSize()"></nsh-icon>
        }

        <span class="nsh-button__label"><ng-content /></span>

        @if (trailingIcon(); as iconName) {
          <nsh-icon class="nsh-button__icon" [name]="iconName" [size]="iconSize()"></nsh-icon>
        }
      </span>
    </button>
  `, isInline: true, styles: [":host{display:inline-flex;vertical-align:middle;--nsh-button-bg: var(--nsh-button-bg, unset);--nsh-button-fg: var(--nsh-button-fg, unset);--nsh-button-border-color: var(--nsh-button-border-color, unset);--nsh-button-focus-ring-color: var(--nsh-button-focus-ring-color, unset);--nsh-button-radius: var(--nsh-button-radius, var(--nsh-radius-md))}.nsh-button{--_btn-accent: var(--nsh-color-primary);--_btn-bg: var(--nsh-button-bg, var(--_btn-accent));--_btn-fg: var(--nsh-button-fg, var(--nsh-color-text));--_btn-border: var(--nsh-button-border-color, transparent);--_btn-height: var(--nsh-density-control-height);--_btn-pad-inline: var(--nsh-density-padding-inline);--_btn-pad-block: var(--nsh-density-padding-block);--_btn-gap: var(--nsh-space-sm);--_btn-font-size: var(--nsh-font-size-md);--_btn-font-weight: var(--nsh-font-weight-medium);--_btn-line-height: var(--nsh-line-height-tight);--_btn-icon-size: 1.125em;--_btn-focus-ring: var( --nsh-button-focus-ring-color, color-mix(in srgb, var(--nsh-color-outline) 60%, transparent) );appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:var(--_btn-gap);min-height:var(--_btn-height);padding:var(--_btn-pad-block) var(--_btn-pad-inline);border-radius:var(--nsh-button-radius);border:.0625rem solid var(--_btn-border);background:var(--_btn-bg);color:var(--_btn-fg);font-family:var(--nsh-font-family);font-size:var(--_btn-font-size);font-weight:var(--_btn-font-weight);line-height:var(--_btn-line-height);text-decoration:none;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;transition:background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),opacity var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard)}.nsh-button__content{display:inline-flex;align-items:center;justify-content:center;gap:var(--_btn-gap)}.nsh-button__label{display:inline-flex;align-items:center}.nsh-button__icon{display:inline-flex;color:currentColor}.nsh-button__spinner{width:var(--_btn-icon-size);height:var(--_btn-icon-size);border-radius:9999px;border:.125rem solid color-mix(in srgb,currentColor 25%,transparent);border-top-color:currentColor;animation:nsh-button-spin var(--nsh-motion-duration-slow) linear infinite}@keyframes nsh-button-spin{to{transform:rotate(360deg)}}.nsh-button--sm{--_btn-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));--_btn-font-size: var(--nsh-font-size-sm);--_btn-pad-inline: calc(var(--nsh-density-padding-inline) - var(--nsh-space-xs));--_btn-pad-block: calc(var(--nsh-density-padding-block) - var(--nsh-space-xs))}.nsh-button--md{--_btn-height: var(--nsh-density-control-height);--_btn-font-size: var(--nsh-font-size-md)}.nsh-button--lg{--_btn-height: calc(var(--nsh-density-control-height) + var(--nsh-space-sm));--_btn-font-size: var(--nsh-font-size-lg);--_btn-pad-inline: calc(var(--nsh-density-padding-inline) + var(--nsh-space-xs));--_btn-pad-block: calc(var(--nsh-density-padding-block) + var(--nsh-space-xs))}.nsh-button--primary{--_btn-accent: var(--nsh-color-primary)}.nsh-button--secondary{--_btn-accent: var(--nsh-color-secondary)}.nsh-button--tertiary{--_btn-accent: var(--nsh-color-tertiary)}.nsh-button--success{--_btn-accent: var(--nsh-color-success)}.nsh-button--warn{--_btn-accent: var(--nsh-color-warn)}.nsh-button--danger{--_btn-accent: var(--nsh-color-danger)}.nsh-button--neutral{--_btn-accent: var(--nsh-color-text)}.nsh-button--filled{--_btn-bg: var(--nsh-button-bg, var(--_btn-accent));--_btn-fg: var(--nsh-button-fg, var(--nsh-color-surface));--_btn-border: var(--nsh-button-border-color, transparent)}.nsh-button--tonal{--_btn-bg: var( --nsh-button-bg, color-mix(in srgb, var(--_btn-accent) 12%, var(--nsh-color-surface-1)) );--_btn-fg: var(--nsh-button-fg, var(--nsh-color-text));--_btn-border: var(--nsh-button-border-color, transparent)}.nsh-button--outlined{--_btn-bg: var(--nsh-button-bg, transparent);--_btn-fg: var(--nsh-button-fg, var(--_btn-accent));--_btn-border: var(--nsh-button-border-color, color-mix(in srgb, var(--_btn-accent) 55%, transparent))}.nsh-button--text{--_btn-bg: var(--nsh-button-bg, transparent);--_btn-fg: var(--nsh-button-fg, var(--_btn-accent));--_btn-border: var(--nsh-button-border-color, transparent)}.nsh-button:hover:not(:disabled):not(.nsh-button--loading){background:color-mix(in srgb,var(--_btn-bg) 92%,var(--nsh-color-surface))}.nsh-button:active:not(:disabled):not(.nsh-button--loading){background:color-mix(in srgb,var(--_btn-bg) 86%,var(--nsh-color-surface))}.nsh-button:disabled,.nsh-button.nsh-button--loading{cursor:not-allowed;opacity:.72}.nsh-button.nsh-focus-visible{box-shadow:0 0 0 .1875rem var(--_btn-focus-ring)}\n"], dependencies: [{ kind: "component", type: NshIconComponent, selector: "nsh-icon", inputs: ["name", "size", "ariaLabel"] }, { kind: "directive", type: NshFocusVisibleDirective, selector: "[nshFocusVisible]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.2", ngImport: i0, type: NshButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'nsh-button', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [NshIconComponent, NshFocusVisibleDirective], template: `
    <button
      nshFocusVisible
      class="nsh-button"
      type="button"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.aria-busy]="loading() ? 'true' : null"
      [class.nsh-button--sm]="size() === 'sm'"
      [class.nsh-button--md]="size() === 'md'"
      [class.nsh-button--lg]="size() === 'lg'"
      [class.nsh-button--filled]="variant() === 'filled'"
      [class.nsh-button--tonal]="variant() === 'tonal'"
      [class.nsh-button--outlined]="variant() === 'outlined'"
      [class.nsh-button--text]="variant() === 'text'"
      [class.nsh-button--primary]="color() === 'primary'"
      [class.nsh-button--secondary]="color() === 'secondary'"
      [class.nsh-button--tertiary]="color() === 'tertiary'"
      [class.nsh-button--success]="color() === 'success'"
      [class.nsh-button--warn]="color() === 'warn'"
      [class.nsh-button--danger]="color() === 'danger'"
      [class.nsh-button--neutral]="color() === 'neutral'"
      [class.nsh-button--loading]="loading()"
    >
      <span class="nsh-button__content">
        @if (loading()) {
          <span class="nsh-button__spinner" aria-hidden="true"></span>
        }

        @if (leadingIcon(); as iconName) {
          <nsh-icon class="nsh-button__icon" [name]="iconName" [size]="iconSize()"></nsh-icon>
        }

        <span class="nsh-button__label"><ng-content /></span>

        @if (trailingIcon(); as iconName) {
          <nsh-icon class="nsh-button__icon" [name]="iconName" [size]="iconSize()"></nsh-icon>
        }
      </span>
    </button>
  `, styles: [":host{display:inline-flex;vertical-align:middle;--nsh-button-bg: var(--nsh-button-bg, unset);--nsh-button-fg: var(--nsh-button-fg, unset);--nsh-button-border-color: var(--nsh-button-border-color, unset);--nsh-button-focus-ring-color: var(--nsh-button-focus-ring-color, unset);--nsh-button-radius: var(--nsh-button-radius, var(--nsh-radius-md))}.nsh-button{--_btn-accent: var(--nsh-color-primary);--_btn-bg: var(--nsh-button-bg, var(--_btn-accent));--_btn-fg: var(--nsh-button-fg, var(--nsh-color-text));--_btn-border: var(--nsh-button-border-color, transparent);--_btn-height: var(--nsh-density-control-height);--_btn-pad-inline: var(--nsh-density-padding-inline);--_btn-pad-block: var(--nsh-density-padding-block);--_btn-gap: var(--nsh-space-sm);--_btn-font-size: var(--nsh-font-size-md);--_btn-font-weight: var(--nsh-font-weight-medium);--_btn-line-height: var(--nsh-line-height-tight);--_btn-icon-size: 1.125em;--_btn-focus-ring: var( --nsh-button-focus-ring-color, color-mix(in srgb, var(--nsh-color-outline) 60%, transparent) );appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:var(--_btn-gap);min-height:var(--_btn-height);padding:var(--_btn-pad-block) var(--_btn-pad-inline);border-radius:var(--nsh-button-radius);border:.0625rem solid var(--_btn-border);background:var(--_btn-bg);color:var(--_btn-fg);font-family:var(--nsh-font-family);font-size:var(--_btn-font-size);font-weight:var(--_btn-font-weight);line-height:var(--_btn-line-height);text-decoration:none;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;transition:background var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),border-color var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),box-shadow var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard),opacity var(--nsh-motion-duration-fast) var(--nsh-motion-easing-standard)}.nsh-button__content{display:inline-flex;align-items:center;justify-content:center;gap:var(--_btn-gap)}.nsh-button__label{display:inline-flex;align-items:center}.nsh-button__icon{display:inline-flex;color:currentColor}.nsh-button__spinner{width:var(--_btn-icon-size);height:var(--_btn-icon-size);border-radius:9999px;border:.125rem solid color-mix(in srgb,currentColor 25%,transparent);border-top-color:currentColor;animation:nsh-button-spin var(--nsh-motion-duration-slow) linear infinite}@keyframes nsh-button-spin{to{transform:rotate(360deg)}}.nsh-button--sm{--_btn-height: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));--_btn-font-size: var(--nsh-font-size-sm);--_btn-pad-inline: calc(var(--nsh-density-padding-inline) - var(--nsh-space-xs));--_btn-pad-block: calc(var(--nsh-density-padding-block) - var(--nsh-space-xs))}.nsh-button--md{--_btn-height: var(--nsh-density-control-height);--_btn-font-size: var(--nsh-font-size-md)}.nsh-button--lg{--_btn-height: calc(var(--nsh-density-control-height) + var(--nsh-space-sm));--_btn-font-size: var(--nsh-font-size-lg);--_btn-pad-inline: calc(var(--nsh-density-padding-inline) + var(--nsh-space-xs));--_btn-pad-block: calc(var(--nsh-density-padding-block) + var(--nsh-space-xs))}.nsh-button--primary{--_btn-accent: var(--nsh-color-primary)}.nsh-button--secondary{--_btn-accent: var(--nsh-color-secondary)}.nsh-button--tertiary{--_btn-accent: var(--nsh-color-tertiary)}.nsh-button--success{--_btn-accent: var(--nsh-color-success)}.nsh-button--warn{--_btn-accent: var(--nsh-color-warn)}.nsh-button--danger{--_btn-accent: var(--nsh-color-danger)}.nsh-button--neutral{--_btn-accent: var(--nsh-color-text)}.nsh-button--filled{--_btn-bg: var(--nsh-button-bg, var(--_btn-accent));--_btn-fg: var(--nsh-button-fg, var(--nsh-color-surface));--_btn-border: var(--nsh-button-border-color, transparent)}.nsh-button--tonal{--_btn-bg: var( --nsh-button-bg, color-mix(in srgb, var(--_btn-accent) 12%, var(--nsh-color-surface-1)) );--_btn-fg: var(--nsh-button-fg, var(--nsh-color-text));--_btn-border: var(--nsh-button-border-color, transparent)}.nsh-button--outlined{--_btn-bg: var(--nsh-button-bg, transparent);--_btn-fg: var(--nsh-button-fg, var(--_btn-accent));--_btn-border: var(--nsh-button-border-color, color-mix(in srgb, var(--_btn-accent) 55%, transparent))}.nsh-button--text{--_btn-bg: var(--nsh-button-bg, transparent);--_btn-fg: var(--nsh-button-fg, var(--_btn-accent));--_btn-border: var(--nsh-button-border-color, transparent)}.nsh-button:hover:not(:disabled):not(.nsh-button--loading){background:color-mix(in srgb,var(--_btn-bg) 92%,var(--nsh-color-surface))}.nsh-button:active:not(:disabled):not(.nsh-button--loading){background:color-mix(in srgb,var(--_btn-bg) 86%,var(--nsh-color-surface))}.nsh-button:disabled,.nsh-button.nsh-button--loading{cursor:not-allowed;opacity:.72}.nsh-button.nsh-focus-visible{box-shadow:0 0 0 .1875rem var(--_btn-focus-ring)}\n"] }]
        }], propDecorators: { disabled: [{ type: i0.Input, args: [{ isSignal: true, alias: "disabled", required: false }] }], loading: [{ type: i0.Input, args: [{ isSignal: true, alias: "loading", required: false }] }], size: [{ type: i0.Input, args: [{ isSignal: true, alias: "size", required: false }] }], variant: [{ type: i0.Input, args: [{ isSignal: true, alias: "variant", required: false }] }], color: [{ type: i0.Input, args: [{ isSignal: true, alias: "color", required: false }] }], ariaLabel: [{ type: i0.Input, args: [{ isSignal: true, alias: "ariaLabel", required: false }] }], leadingIcon: [{ type: i0.Input, args: [{ isSignal: true, alias: "leadingIcon", required: false }] }], trailingIcon: [{ type: i0.Input, args: [{ isSignal: true, alias: "trailingIcon", required: false }] }] } });

/*
 * Public API Surface of nsh-kit-ui
 */
// A11y

/**
 * Generated bundle index. Do not edit.
 */

export { NSH_DEFAULT_COLORS_DARK, NSH_DEFAULT_COLORS_LIGHT, NSH_DEFAULT_DENSITY_COMFORTABLE, NSH_DEFAULT_DENSITY_COMPACT, NSH_DEFAULT_ELEVATION, NSH_DEFAULT_MOTION, NSH_DEFAULT_RADIUS, NSH_DEFAULT_SPACING, NSH_DEFAULT_TYPOGRAPHY, NSH_DEFAULT_Z_INDEX, NSH_THEME_DEFAULTS, NshButtonComponent, NshFocusVisibleDirective, NshIconComponent, NshIconRegistry, NshThemeDirective, NshThemeService, createNshDefaultTokens, mergeDeep, provideNshIcons, provideNshTheme, tokensToCssVars };
//# sourceMappingURL=nsh-kit-ui.mjs.map
