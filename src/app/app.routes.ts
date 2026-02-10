import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'forms',
	},
	{
		path: 'forms',
		loadComponent: () => import('./pages/forms/forms-page.component').then((m) => m.FormsPageComponent),
	},
	{
		path: 'menu',
		loadComponent: () => import('./pages/menu/menu-page.component').then((m) => m.MenuPageComponent),
	},
	{
		path: 'toolbar',
		loadComponent: () =>
			import('./pages/toolbar/toolbar-page.component').then((m) => m.ToolbarPageComponent),
	},
	{
		path: 'tabs',
		loadComponent: () => import('./pages/tabs/tabs-page.component').then((m) => m.TabsPageComponent),
	},
	{
		path: 'stepper',
		loadComponent: () =>
			import('./pages/stepper/stepper-page.component').then((m) => m.StepperPageComponent),
	},
	{
		path: 'tooltip',
		loadComponent: () =>
			import('./pages/tooltip/tooltip-page.component').then((m) => m.TooltipPageComponent),
	},
	{
		path: 'snackbar',
		loadComponent: () =>
			import('./pages/snackbar/snackbar-page.component').then((m) => m.SnackbarPageComponent),
	},
	{
		path: 'dialog',
		loadComponent: () =>
			import('./pages/dialog/dialog-page.component').then((m) => m.DialogPageComponent),
	},
];
