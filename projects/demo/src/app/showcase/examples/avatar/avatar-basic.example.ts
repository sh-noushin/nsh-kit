import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshAvatarComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-avatar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshAvatarComponent],
  template: `
    <div class="example-row">
      <nsh-avatar name="Ada Lovelace" status="online"></nsh-avatar>
      <nsh-avatar name="Grace Hopper" size="lg" status="busy"></nsh-avatar>
      <nsh-avatar name="Alan Turing" size="sm"></nsh-avatar>
    </div>
  `,
  styles: [
    `
      .example-row {
        display: flex;
        align-items: center;
        gap: var(--nsh-space-md);
      }
    `,
  ],
})
export class AvatarBasicExampleComponent {}

export const avatarBasicHtml = `<div class="example-row">
  <nsh-avatar name="Ada Lovelace" status="online"></nsh-avatar>
  <nsh-avatar name="Grace Hopper" size="lg" status="busy"></nsh-avatar>
  <nsh-avatar name="Alan Turing" size="sm"></nsh-avatar>
</div>`;

export const avatarBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshAvatarComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-avatar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshAvatarComponent],
  templateUrl: './avatar-basic.example.html'
})
export class AvatarBasicExampleComponent {}`;
