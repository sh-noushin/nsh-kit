import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NSH_FORM_FIELD_CONTEXT, type NshFormFieldControlContext } from './form-field.context';
import { NshFormFieldComponent } from './form-field.component';

@Component({
  selector: 'nsh-context-probe',
  standalone: true,
  template: `
    <span class="probe" [attr.data-control-id]="ctx.controlId()" [attr.data-describedby]="ctx.describedByIds()"></span>
  `,
})
class ContextProbeComponent {
  readonly ctx = inject<NshFormFieldControlContext>(NSH_FORM_FIELD_CONTEXT);
}

@Component({
  standalone: true,
  imports: [NshFormFieldComponent, ContextProbeComponent],
  template: `
    <nsh-form-field
      [label]="label"
      [hint]="hint"
      [error]="error"
      [required]="required"
      [disabled]="disabled"
    >
      <input class="inner" />
      <nsh-context-probe />
    </nsh-form-field>
  `,
})
class HostComponent {
  label: string | null = 'Name';
  hint: string | null = 'Helpful hint';
  error: string | null = null;
  required = false;
  disabled = false;
}

describe('NshFormFieldComponent', () => {
  it('renders label/hint/error correctly', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.nsh-ff__label') as HTMLLabelElement;
    expect(label).toBeTruthy();
    expect((label.textContent ?? '').trim()).toBe('Name');

    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    expect(hint).toBeTruthy();
    expect(hint.hasAttribute('hidden')).toBe(false);
    expect((hint.textContent ?? '').trim()).toContain('Helpful hint');

    const error = fixture.nativeElement.querySelector('.nsh-ff__error') as HTMLElement;
    expect(error).toBeTruthy();
    expect(error.hasAttribute('hidden')).toBe(true);
  });

  it('describedBy contains correct ids (error precedence)', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.error = 'Bad value';
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.nsh-ff__hint') as HTMLElement;
    const error = fixture.nativeElement.querySelector('.nsh-ff__error') as HTMLElement;

    const probe = fixture.nativeElement.querySelector('.probe') as HTMLElement;
    const describedBy = probe.getAttribute('data-describedby');

    expect(describedBy).toBe(`${error.id} ${hint.id}`);
  });

  it('provides context for child controls', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const probe = fixture.nativeElement.querySelector('.probe') as HTMLElement;
    const controlId = probe.getAttribute('data-control-id');
    expect(controlId).toContain('nsh-ff-');
    expect(controlId).toContain('-control');
  });
});
