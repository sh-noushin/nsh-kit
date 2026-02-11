import { Routes } from '@angular/router';

import { showcaseRoutes } from './showcase/showcase.routes';
import { ShowcaseShellComponent } from './showcase/showcase-shell/showcase-shell.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'showcase/button' },
	{
		path: 'showcase',
		component: ShowcaseShellComponent,
		children: showcaseRoutes,
	},
	{ path: '**', redirectTo: 'showcase/button' },
];
