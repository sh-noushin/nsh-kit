# NSH Kit

NSH Kit is an Angular component library and demo app built with standalone components, signals, and design tokens.

## Installation / Local build

```bash
npm ci
npm run build:lib
```

The build output is generated under `dist/nsh-kit-ui/`.

## Using the library in another Angular app

Local linking (for development):

```bash
npm run build:lib
npm link ./dist/nsh-kit-ui
```

Then in the consuming app:

```bash
npm link nsh-kit-ui
```

In code, import from the package root only:

```ts
import { NshButtonComponent, NshThemeDirective } from 'nsh-kit-ui';
```

## Styles and theming

The library uses CSS variables (`--nsh-*`) for all styling. You can include the optional SCSS helpers from the built package:

```scss
@use 'nsh-kit-ui/lib/styles/base.scss';
@use 'nsh-kit-ui/lib/styles/theme.scss';
@use 'nsh-kit-ui/lib/styles/typography.scss';
```

Apply the theme directive to a container to provide tokens:

```html
<div [nshTheme]="{ mode: 'light', density: 'comfortable' }">
	<!-- app content -->
</div>
```

## Zoneless readiness

Components avoid `NgZone` and use signals, computed state, and effects. The library is designed to work in zoneless Angular apps.

## Accessibility

All interactive components use keyboard navigation and ARIA roles. Use `nshFocusVisible` for consistent focus treatment when needed.

## Useful scripts

```bash
npm run build:lib
npm run test:lib
npm run test
npm run serve:demo
```
