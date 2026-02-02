import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { NshIconComponent, NshIconRegistry } from '../../foundations/icon';

export type NshAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type NshAvatarShape = 'circle' | 'rounded';
export type NshAvatarStatus = 'none' | 'online' | 'offline' | 'busy' | 'away';

function computeInitialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const firstTwo = parts.slice(0, 2);
  const letters = firstTwo
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part[0] ?? '')
    .join('');

  return letters.toLocaleUpperCase();
}

@Component({
  selector: 'nsh-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshIconComponent],
  host: {
    '[class.nsh-avatar]': 'true',
    '[class.nsh-avatar--xs]': "size() === 'xs'",
    '[class.nsh-avatar--sm]': "size() === 'sm'",
    '[class.nsh-avatar--md]': "size() === 'md'",
    '[class.nsh-avatar--lg]': "size() === 'lg'",
    '[class.nsh-avatar--xl]': "size() === 'xl'",

    '[class.nsh-avatar--circle]': "shape() === 'circle'",
    '[class.nsh-avatar--rounded]': "shape() === 'rounded'",

    '[class.nsh-avatar--status]': "status() !== 'none'",
    '[class.nsh-avatar--online]': "status() === 'online'",
    '[class.nsh-avatar--offline]': "status() === 'offline'",
    '[class.nsh-avatar--busy]': "status() === 'busy'",
    '[class.nsh-avatar--away]': "status() === 'away'",

    '[class.nsh-avatar--img-loaded]': 'imageLoaded()',
    '[class.nsh-avatar--img-error]': 'imageError()',

    '[attr.role]': "ariaLabel() ? 'img' : null",
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.aria-hidden]': "isDecorative() ? 'true' : null",
  },
  template: `
    <span class="nsh-avatar__content">
      @if (showImage()) {
        <img
          class="nsh-avatar__img"
          [src]="src()!"
          [attr.alt]="imgAlt()"
          [attr.aria-hidden]="ariaLabel() ? 'true' : null"
          (load)="onImgLoad()"
          (error)="onImgError()"
        />
      } @else {
        @if (displayInitials(); as letters) {
          <span class="nsh-avatar__initials" aria-hidden="true">{{ letters }}</span>
        } @else {
          @if (hasUserIcon()) {
            <nsh-icon class="nsh-avatar__placeholder" name="user" size="100%" ariaLabel=""></nsh-icon>
          } @else {
            <span class="nsh-avatar__fallback" aria-hidden="true">
              <span class="nsh-avatar__fallback-shape"></span>
            </span>
          }
        }
      }

      @if (status() !== 'none') {
        <span class="nsh-avatar__status" aria-hidden="true"></span>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;

      /* Override surface */
      --nsh-avatar-size: var(--nsh-avatar-size, unset);
      --nsh-avatar-radius: var(--nsh-avatar-radius, unset);
      --nsh-avatar-bg: var(--nsh-avatar-bg, unset);
      --nsh-avatar-fg: var(--nsh-avatar-fg, unset);
      --nsh-avatar-font-size: var(--nsh-avatar-font-size, unset);
      --nsh-avatar-status-size: var(--nsh-avatar-status-size, unset);
      --nsh-avatar-status-color: var(--nsh-avatar-status-color, unset);

      --_av-size: var(--nsh-density-control-height);
      --_av-radius: var(--nsh-radius-pill);
      --_av-bg: var(--nsh-avatar-bg, color-mix(in srgb, var(--nsh-color-surface-2) 75%, var(--nsh-color-surface)));
      --_av-fg: var(--nsh-avatar-fg, var(--nsh-color-text));
      --_av-font-size: var(--nsh-avatar-font-size, var(--nsh-font-size-md));
      --_av-status-size: var(--nsh-avatar-status-size, var(--nsh-space-sm));
      --_av-status-color: var(--nsh-avatar-status-color, var(--nsh-color-success));

      width: var(--nsh-avatar-size, var(--_av-size));
      height: var(--nsh-avatar-size, var(--_av-size));
      color: var(--_av-fg);
      font-family: var(--nsh-font-family);
      font-size: var(--_av-font-size);
      line-height: var(--nsh-line-height-tight);
    }

    :host(.nsh-avatar--xs) {
      --_av-size: calc(var(--nsh-density-control-height) - var(--nsh-space-md));
      --_av-font-size: var(--nsh-font-size-xs);
      --_av-status-size: var(--nsh-space-xs);
    }

    :host(.nsh-avatar--sm) {
      --_av-size: calc(var(--nsh-density-control-height) - var(--nsh-space-sm));
      --_av-font-size: var(--nsh-font-size-sm);
      --_av-status-size: var(--nsh-space-xs);
    }

    :host(.nsh-avatar--md) {
      --_av-size: var(--nsh-density-control-height);
      --_av-font-size: var(--nsh-font-size-md);
      --_av-status-size: var(--nsh-space-sm);
    }

    :host(.nsh-avatar--lg) {
      --_av-size: calc(var(--nsh-density-control-height) + var(--nsh-space-sm));
      --_av-font-size: var(--nsh-font-size-lg);
      --_av-status-size: var(--nsh-space-sm);
    }

    :host(.nsh-avatar--xl) {
      --_av-size: calc(var(--nsh-density-control-height) + var(--nsh-space-xl));
      --_av-font-size: var(--nsh-font-size-xl);
      --_av-status-size: var(--nsh-space-md);
    }

    :host(.nsh-avatar--circle) {
      --_av-radius: var(--nsh-avatar-radius, var(--nsh-radius-pill));
    }

    :host(.nsh-avatar--rounded) {
      --_av-radius: var(--nsh-avatar-radius, var(--nsh-radius-md));
    }

    /* Status colors */
    :host(.nsh-avatar--online) {
      --_av-status-color: var(--nsh-color-success);
    }

    :host(.nsh-avatar--busy) {
      --_av-status-color: var(--nsh-color-danger);
    }

    :host(.nsh-avatar--away) {
      --_av-status-color: var(--nsh-color-warn);
    }

    :host(.nsh-avatar--offline) {
      --_av-status-color: var(--nsh-color-text-muted);
    }

    .nsh-avatar__content {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: var(--nsh-avatar-radius, var(--_av-radius));
      background: var(--_av-bg);
      overflow: hidden;
      user-select: none;
    }

    .nsh-avatar__img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .nsh-avatar__initials {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-weight: var(--nsh-font-weight-semibold);
      letter-spacing: 0.06em;
    }

    .nsh-avatar__placeholder,
    .nsh-avatar__fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 55%;
      height: 55%;
      color: currentColor;
      opacity: 0.9;
    }

    .nsh-avatar__fallback-shape {
      width: 100%;
      height: 100%;
      border-radius: var(--nsh-radius-pill);
      background: color-mix(in srgb, currentColor 22%, transparent);
    }

    .nsh-avatar__status {
      position: absolute;
      right: 0;
      bottom: 0;
      width: var(--nsh-avatar-status-size, var(--_av-status-size));
      height: var(--nsh-avatar-status-size, var(--_av-status-size));
      border-radius: var(--nsh-radius-pill);
      background: var(--nsh-avatar-status-color, var(--_av-status-color));
      box-shadow: 0 0 0 var(--nsh-space-xs) var(--nsh-color-surface);
    }
  `,
})
export class NshAvatarComponent {
  private readonly iconRegistry = inject(NshIconRegistry);

  readonly src = input<string | null>(null);
  readonly alt = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly initials = input<string | null>(null);
  readonly size = input<NshAvatarSize>('md');
  readonly shape = input<NshAvatarShape>('circle');
  readonly status = input<NshAvatarStatus>('none');
  readonly ariaLabel = input<string | undefined>(undefined);

  private readonly _imageError = signal(false);
  private readonly _imageLoaded = signal(false);

  readonly imageError = this._imageError.asReadonly();
  readonly imageLoaded = this._imageLoaded.asReadonly();

  readonly hasUserIcon = computed(() => this.iconRegistry.get('user') !== null);

  readonly showImage = computed(() => {
    const src = this.src();
    if (!src) {
      return false;
    }
    return !this.imageError();
  });

  readonly displayInitials = computed(() => {
    const explicit = this.initials();
    if (explicit && explicit.trim().length > 0) {
      return explicit.trim().toLocaleUpperCase();
    }

    const name = this.name();
    if (name && name.trim().length > 0) {
      const computedInitials = computeInitialsFromName(name);
      return computedInitials.length > 0 ? computedInitials : null;
    }

    return null;
  });

  readonly imgAlt = computed(() => {
    if (this.ariaLabel()) {
      return '';
    }
    const alt = this.alt();
    return alt ?? '';
  });

  readonly isDecorative = computed(() => {
    if (this.ariaLabel()) {
      return false;
    }

    const alt = this.alt();
    if (alt && this.showImage()) {
      return false;
    }

    return true;
  });

  onImgLoad() {
    this._imageLoaded.set(true);
    this._imageError.set(false);
  }

  onImgError() {
    this._imageError.set(true);
  }
}
