import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshButtonComponent,
  NshListComponent,
  NshListItemComponent,
  NshSidenavComponent,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-sidenav-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshListComponent, NshListItemComponent, NshSidenavComponent],
  template: `
    <div class="example-stack">
      <nsh-button variant="outlined" size="sm" (click)="toggle()">
        Toggle sidenav
      </nsh-button>

      <nsh-sidenav [open]="open()" mode="side" position="start">
        <div nshSidenavPanel class="example-panel">
          <nsh-list role="navigation">
            <nsh-list-item leadingIcon="home">Overview</nsh-list-item>
            <nsh-list-item leadingIcon="layers">Sections</nsh-list-item>
            <nsh-list-item leadingIcon="settings">Settings</nsh-list-item>
          </nsh-list>
        </div>

        <div nshSidenavContent class="example-content">
          <div class="example-content__text">Content area</div>
        </div>
      </nsh-sidenav>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-md);
      }

      .example-panel {
        padding: var(--nsh-space-md);
      }

      .example-content {
        padding: var(--nsh-space-md);
      }

      .example-content__text {
        color: var(--nsh-color-text-muted);
      }
    `,
  ],
})
export class SidenavBasicExampleComponent {
  readonly open = signal(true);

  toggle(): void {
    this.open.set(!this.open());
  }
}

export const sidenavBasicHtml = `<nsh-sidenav [open]="open" mode="side" position="start">
  <div nshSidenavPanel>
    <nsh-list role="navigation">
      <nsh-list-item leadingIcon="home">Overview</nsh-list-item>
      <nsh-list-item leadingIcon="layers">Sections</nsh-list-item>
      <nsh-list-item leadingIcon="settings">Settings</nsh-list-item>
    </nsh-list>
  </div>

  <div nshSidenavContent>
    Content area
  </div>
</nsh-sidenav>`;

export const sidenavBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshListComponent, NshListItemComponent, NshSidenavComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-sidenav-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshListComponent, NshListItemComponent, NshSidenavComponent],
  templateUrl: './sidenav-basic.example.html'
})
export class SidenavBasicExampleComponent {}`;
