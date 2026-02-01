import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NshKitUi } from './nsh-kit-ui';

describe('NshKitUi', () => {
  let component: NshKitUi;
  let fixture: ComponentFixture<NshKitUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NshKitUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NshKitUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
