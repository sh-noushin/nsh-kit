import { ENVIRONMENT_INITIALIZER, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';

import type { NshThemeConfig } from './theme.model';
import { NshThemeService } from './theme.service';

export const NSH_THEME_DEFAULTS = new InjectionToken<NshThemeConfig>('NSH_THEME_DEFAULTS');

export function provideNshTheme(config: NshThemeConfig) {
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
