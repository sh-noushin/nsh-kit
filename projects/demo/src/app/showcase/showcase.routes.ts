import { Routes } from '@angular/router';

import { DocPageComponent } from './pages/doc-page.component';

export const showcaseRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'button' },
  { path: ':id', component: DocPageComponent },
];
