import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-overview-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  template: `
    <div class="button-overview">
      <div class="button-overview__row">
        <div class="button-overview__label">Text</div>
        <div class="button-overview__actions">
          <nsh-button variant="text" class="btn btn--text">Basic</nsh-button>
          <nsh-button variant="text" class="btn btn--text btn--state-disabled" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="text" class="btn btn--text btn--link">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Elevated</div>
        <div class="button-overview__actions">
          <nsh-button variant="tonal" class="btn btn--elevated btn--raised">Basic</nsh-button>
          <nsh-button variant="tonal" class="btn btn--elevated btn--state-disabled" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="tonal" class="btn btn--elevated btn--raised btn--link">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Outlined</div>
        <div class="button-overview__actions">
          <nsh-button variant="outlined" class="btn btn--outlined">Basic</nsh-button>
          <nsh-button variant="outlined" class="btn btn--outlined btn--state-disabled" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="outlined" class="btn btn--outlined btn--link">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Filled</div>
        <div class="button-overview__actions">
          <nsh-button variant="filled" class="btn btn--filled">Basic</nsh-button>
          <nsh-button variant="filled" class="btn btn--filled btn--state-disabled" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="filled" class="btn btn--filled">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Tonal</div>
        <div class="button-overview__actions">
          <nsh-button variant="tonal" class="btn btn--tonal">Basic</nsh-button>
          <nsh-button variant="tonal" class="btn btn--tonal btn--state-disabled" [disabled]="true">
            Disabled
          </nsh-button>
          <nsh-button variant="tonal" class="btn btn--tonal btn--link">Link</nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Icon</div>
        <div class="button-overview__actions">
          <nsh-button
            variant="text"
            class="btn btn--icon btn--icon-only"
            ariaLabel="More options"
            leadingIcon="more-vert"
          ></nsh-button>
          <nsh-button
            variant="text"
            class="btn btn--icon btn--icon-only"
            ariaLabel="Open in new"
            leadingIcon="open-in-new"
          ></nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Floating Action Button (FAB)</div>
        <div class="button-overview__actions">
          <nsh-button
            variant="tonal"
            class="btn fab fab--default btn--icon-only"
            ariaLabel="Delete"
            leadingIcon="delete"
          ></nsh-button>
          <nsh-button
            variant="tonal"
            class="btn fab fab--default btn--icon-only btn--state-disabled"
            ariaLabel="Favorite disabled"
            leadingIcon="favorite"
            [disabled]="true"
          ></nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Mini FAB</div>
        <div class="button-overview__actions">
          <nsh-button
            variant="tonal"
            class="btn fab fab--mini btn--icon-only"
            ariaLabel="Menu"
            leadingIcon="menu"
          ></nsh-button>
          <nsh-button
            variant="tonal"
            class="btn fab fab--mini btn--icon-only btn--state-disabled"
            ariaLabel="Home disabled"
            leadingIcon="home"
            [disabled]="true"
          ></nsh-button>
        </div>
      </div>

      <div class="button-overview__row">
        <div class="button-overview__label">Extended FAB</div>
        <div class="button-overview__actions">
          <nsh-button variant="tonal" class="btn fab fab--extended btn--link" leadingIcon="favorite">
            Basic
          </nsh-button>
          <nsh-button
            variant="tonal"
            class="btn fab fab--extended btn--state-disabled"
            leadingIcon="favorite"
            [disabled]="true"
          >
            Disabled
          </nsh-button>
          <nsh-button variant="tonal" class="btn fab fab--extended btn--link" leadingIcon="favorite">
            Link
          </nsh-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .button-overview {
        border-radius: 12px;
        border: 1px solid #cfd5e1;
        background: #f2f4f8;
        overflow: hidden;
      }

      .button-overview__row {
        display: grid;
        grid-template-columns: minmax(150px, 205px) 1fr;
        gap: 12px;
        align-items: center;
        padding: 8px 10px;
        border-top: 1px solid #cfd5e1;
      }

      .button-overview__row:first-child {
        border-top: none;
      }

      .button-overview__label {
        font-size: 1.04rem;
        color: #2a303d;
      }

      .button-overview__actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .btn {
        --nsh-button-radius: 999px;
        --nsh-density-control-height: 44px;
        --nsh-density-padding-inline: 26px;
        --nsh-density-padding-block: 10px;
      }

      .btn--text {
        --nsh-density-control-height: 40px;
        --nsh-density-padding-inline: 10px;
        --nsh-button-bg: transparent;
        --nsh-button-fg: #0b5db7;
      }

      .btn--elevated {
        --nsh-button-bg: #ebedf2;
        --nsh-button-fg: #0b5db7;
      }

      .btn--outlined {
        --nsh-button-fg: #0b5db7;
        --nsh-button-border-color: #7f8899;
      }

      .btn--filled {
        --nsh-button-bg: #0b5db7;
        --nsh-button-fg: #fff;
      }

      .btn--tonal {
        --nsh-button-bg: #c1cde8;
        --nsh-button-fg: #49556f;
      }

      .btn--link {
        --nsh-button-fg: #0b5db7;
      }

      .btn--state-disabled {
        --nsh-button-bg: #d2d5dc;
        --nsh-button-fg: #8b9099;
        --nsh-button-border-color: #c7ccd6;
      }

      .btn--raised {
        filter: drop-shadow(0 1px 1px rgb(17 29 52 / 0.24)) drop-shadow(0 2px 8px rgb(17 29 52 / 0.1));
      }

      .btn--icon {
        --nsh-density-control-height: 38px;
        --nsh-density-padding-inline: 8px;
        --nsh-density-padding-block: 8px;
        --nsh-button-bg: transparent;
        --nsh-button-fg: #4c5565;
      }

      .btn--icon-only {
        --nsh-space-sm: 0px;
      }

      .fab {
        --nsh-button-radius: 18px;
        --nsh-button-bg: #c2d0ea;
        --nsh-button-fg: #0b5aa9;
      }

      .fab--default {
        --nsh-density-control-height: 62px;
        --nsh-density-padding-inline: 18px;
        --nsh-density-padding-block: 14px;
        filter: drop-shadow(0 1px 1px rgb(17 29 52 / 0.24)) drop-shadow(0 2px 8px rgb(17 29 52 / 0.12));
      }

      .fab--mini {
        --nsh-density-control-height: 44px;
        --nsh-density-padding-inline: 12px;
        --nsh-density-padding-block: 8px;
      }

      .fab--extended {
        --nsh-density-control-height: 56px;
        --nsh-density-padding-inline: 22px;
        --nsh-density-padding-block: 12px;
        --nsh-space-sm: 10px;
      }

      @media (max-width: 860px) {
        .button-overview__row {
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }
    `,
  ],
})
export class ButtonOverviewExampleComponent {}

export const buttonOverviewHtml = `<div class="button-overview">
  <div class="button-overview__row">
    <div class="button-overview__label">Text</div>
    <div class="button-overview__actions">
      <nsh-button variant="text" class="btn btn--text">Basic</nsh-button>
      <nsh-button variant="text" class="btn btn--text btn--state-disabled" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="text" class="btn btn--text btn--link">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Elevated</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn btn--elevated btn--raised">Basic</nsh-button>
      <nsh-button variant="tonal" class="btn btn--elevated btn--state-disabled" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="tonal" class="btn btn--elevated btn--raised btn--link">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Outlined</div>
    <div class="button-overview__actions">
      <nsh-button variant="outlined" class="btn btn--outlined">Basic</nsh-button>
      <nsh-button variant="outlined" class="btn btn--outlined btn--state-disabled" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="outlined" class="btn btn--outlined btn--link">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Filled</div>
    <div class="button-overview__actions">
      <nsh-button variant="filled" class="btn btn--filled">Basic</nsh-button>
      <nsh-button variant="filled" class="btn btn--filled btn--state-disabled" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="filled" class="btn btn--filled">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Tonal</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn btn--tonal">Basic</nsh-button>
      <nsh-button variant="tonal" class="btn btn--tonal btn--state-disabled" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="tonal" class="btn btn--tonal btn--link">Link</nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Icon</div>
    <div class="button-overview__actions">
      <nsh-button variant="text" class="btn btn--icon btn--icon-only" ariaLabel="More options" leadingIcon="more-vert"></nsh-button>
      <nsh-button variant="text" class="btn btn--icon btn--icon-only" ariaLabel="Open in new" leadingIcon="open-in-new"></nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Floating Action Button (FAB)</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn fab fab--default btn--icon-only" ariaLabel="Delete" leadingIcon="delete"></nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--default btn--icon-only btn--state-disabled" ariaLabel="Favorite disabled" leadingIcon="favorite" [disabled]="true"></nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Mini FAB</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn fab fab--mini btn--icon-only" ariaLabel="Menu" leadingIcon="menu"></nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--mini btn--icon-only btn--state-disabled" ariaLabel="Home disabled" leadingIcon="home" [disabled]="true"></nsh-button>
    </div>
  </div>

  <div class="button-overview__row">
    <div class="button-overview__label">Extended FAB</div>
    <div class="button-overview__actions">
      <nsh-button variant="tonal" class="btn fab fab--extended btn--link" leadingIcon="favorite">Basic</nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--extended btn--state-disabled" leadingIcon="favorite" [disabled]="true">Disabled</nsh-button>
      <nsh-button variant="tonal" class="btn fab fab--extended btn--link" leadingIcon="favorite">Link</nsh-button>
    </div>
  </div>
</div>`;

export const buttonOverviewTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshButtonComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-button-overview-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent],
  templateUrl: './button-overview.example.html'
})
export class ButtonOverviewExampleComponent {}`;
