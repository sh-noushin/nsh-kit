import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshAvatarComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-avatar-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshAvatarComponent],
  template: `
    <div class="avatar-grid">
      <div class="avatar-card">
        <div class="avatar-card__title">Presence</div>
        <div class="avatar-row">
          <div class="avatar-item">
            <nsh-avatar
              name="Ava Green"
              src="https://i.pravatar.cc/120?img=32"
              status="online"
              ariaLabel="Ava Green"
            ></nsh-avatar>
            <span class="avatar-item__label">Online</span>
          </div>
          <div class="avatar-item avatar-item--away">
            <nsh-avatar
              name="Leo Park"
              src="https://i.pravatar.cc/120?img=12"
              status="away"
              ariaLabel="Leo Park"
            ></nsh-avatar>
            <span class="avatar-item__label">Away</span>
          </div>
          <div class="avatar-item avatar-item--busy">
            <nsh-avatar
              name="Mia Chen"
              src="https://i.pravatar.cc/120?img=5"
              status="busy"
              ariaLabel="Mia Chen"
            ></nsh-avatar>
            <span class="avatar-item__label">Busy</span>
          </div>
          <div class="avatar-item avatar-item--offline">
            <nsh-avatar
              name="Noah Fox"
              src="https://i.pravatar.cc/120?img=50"
              status="offline"
              ariaLabel="Noah Fox"
            ></nsh-avatar>
            <span class="avatar-item__label">Offline</span>
          </div>
        </div>
      </div>

      <div class="avatar-card">
        <div class="avatar-card__title">Sizes and shapes</div>
        <div class="avatar-row">
          <div class="avatar-item">
            <nsh-avatar name="Ava Green" size="sm" ariaLabel="Ava Green"></nsh-avatar>
            <span class="avatar-item__label">Small</span>
          </div>
          <div class="avatar-item">
            <nsh-avatar name="Leo Park" size="md" ariaLabel="Leo Park"></nsh-avatar>
            <span class="avatar-item__label">Medium</span>
          </div>
          <div class="avatar-item">
            <nsh-avatar name="Mia Chen" size="lg" ariaLabel="Mia Chen"></nsh-avatar>
            <span class="avatar-item__label">Large</span>
          </div>
          <div class="avatar-item avatar-item--rounded">
            <nsh-avatar name="Noah Fox" size="xl" shape="rounded" ariaLabel="Noah Fox"></nsh-avatar>
            <span class="avatar-item__label">Rounded</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .avatar-grid {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .avatar-card {
        padding: var(--nsh-space-md);
        border-radius: var(--nsh-radius-lg);
        border: 1px solid color-mix(in srgb, var(--nsh-color-outline) 60%, transparent);
        background: linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%);
      }

      .avatar-card__title {
        font-size: var(--nsh-font-size-sm);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--nsh-color-text-muted);
        font-weight: var(--nsh-font-weight-semibold);
        margin-bottom: var(--nsh-space-md);
      }

      .avatar-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--nsh-space-lg);
      }

      .avatar-item {
        display: grid;
        justify-items: center;
        gap: var(--nsh-space-xs);
      }

      .avatar-item > nsh-avatar {
        border-radius: 999px;
        box-shadow: 0 0 0 4px #33cc33;
      }

      .avatar-item--rounded > nsh-avatar {
        border-radius: var(--nsh-radius-md);
      }

      .avatar-item--away > nsh-avatar {
        box-shadow: 0 0 0 4px #ffff00;
      }

      .avatar-item--busy > nsh-avatar {
        box-shadow: 0 0 0 4px #ff0000;
      }

      .avatar-item--offline > nsh-avatar {
        box-shadow: 0 0 0 4px rgba(51, 65, 85, 0.5);
      }

      .avatar-item__label {
        font-size: var(--nsh-font-size-xs);
        color: var(--nsh-color-text-muted);
      }
    `,
  ],
})
export class AvatarBasicExampleComponent {}

export const avatarBasicHtml = `<div class="avatar-grid">
  <div class="avatar-card">
    <div class="avatar-card__title">Presence</div>
    <div class="avatar-row">
      <div class="avatar-item">
        <nsh-avatar name="Ava Green" src="https://i.pravatar.cc/120?img=32" status="online"></nsh-avatar>
        <span class="avatar-item__label">Online</span>
      </div>
      <div class="avatar-item avatar-item--away">
        <nsh-avatar name="Leo Park" src="https://i.pravatar.cc/120?img=12" status="away"></nsh-avatar>
        <span class="avatar-item__label">Away</span>
      </div>
      <div class="avatar-item avatar-item--busy">
        <nsh-avatar name="Mia Chen" src="https://i.pravatar.cc/120?img=5" status="busy"></nsh-avatar>
        <span class="avatar-item__label">Busy</span>
      </div>
      <div class="avatar-item avatar-item--offline">
        <nsh-avatar name="Noah Fox" src="https://i.pravatar.cc/120?img=50" status="offline"></nsh-avatar>
        <span class="avatar-item__label">Offline</span>
      </div>
    </div>
  </div>

  <div class="avatar-card">
    <div class="avatar-card__title">Sizes and shapes</div>
    <div class="avatar-row">
      <div class="avatar-item">
        <nsh-avatar name="Ava Green" size="sm"></nsh-avatar>
        <span class="avatar-item__label">Small</span>
      </div>
      <div class="avatar-item">
        <nsh-avatar name="Leo Park" size="md"></nsh-avatar>
        <span class="avatar-item__label">Medium</span>
      </div>
      <div class="avatar-item">
        <nsh-avatar name="Mia Chen" size="lg"></nsh-avatar>
        <span class="avatar-item__label">Large</span>
      </div>
      <div class="avatar-item avatar-item--rounded">
        <nsh-avatar name="Noah Fox" size="xl" shape="rounded"></nsh-avatar>
        <span class="avatar-item__label">Rounded</span>
      </div>
    </div>
  </div>
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
