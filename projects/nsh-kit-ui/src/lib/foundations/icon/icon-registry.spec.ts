import { TestBed } from '@angular/core/testing';

import { NshIconRegistry } from './icon-registry';

describe('NshIconRegistry', () => {
  it('registers and returns icons', () => {
    const registry = TestBed.inject(NshIconRegistry);
    registry.register('check', '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>');
    expect(registry.get('check')).toContain('<svg');
  });

  it('returns null for missing icons', () => {
    const registry = TestBed.inject(NshIconRegistry);
    expect(registry.get('missing')).toBeNull();
  });
});
