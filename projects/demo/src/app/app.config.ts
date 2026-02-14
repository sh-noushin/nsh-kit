import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NshIconRegistry } from 'nsh-kit-ui';

import { routes } from './app.routes';

const DEMO_ICON_ASSETS = {
  home: '/icons/material/home.svg',
  folder: '/icons/material/folder.svg',
  sparkles: '/icons/material/sparkles.svg',
  user: '/icons/material/user.svg',
  settings: '/icons/material/settings.svg',
  news: '/icons/material/news.svg',
  'fork-knife': '/icons/material/fork-knife.svg',
  'ice-cream': '/icons/material/ice-cream.svg',
  'shopping-cart': '/icons/material/shopping-cart.svg',
  'credit-card': '/icons/material/credit-card.svg',
  truck: '/icons/material/truck.svg',
  check: '/icons/material/check.svg',
  delete: '/icons/material/delete.svg',
  favorite: '/icons/material/favorite.svg',
  menu: '/icons/material/menu.svg',
  'more-vert': '/icons/material/more-vert.svg',
  'open-in-new': '/icons/material/open-in-new.svg',
  'chevron-right': '/icons/material/chevron-right.svg',
} as const;

function provideDemoAssetIcons() {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => {
      const iconRegistry = inject(NshIconRegistry);

      return async () => {
        const entries = Object.entries(DEMO_ICON_ASSETS);

        await Promise.all(
          entries.map(async ([name, path]) => {
            try {
              const response = await fetch(path);
              if (!response.ok) {
                return;
              }
              const svg = await response.text();
              if (svg.trim()) {
                iconRegistry.register(name, svg);
              }
            } catch {
            }
          }),
        );
      };
    },
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideDemoAssetIcons(),
  ]
};
