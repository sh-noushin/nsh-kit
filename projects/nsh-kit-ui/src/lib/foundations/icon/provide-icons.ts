import { ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders } from '@angular/core';

import { NshIconRegistry } from './icon-registry';

export function provideNshIcons(icons: Record<string, string>) {
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
