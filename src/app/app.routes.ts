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
];
