import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshSortDirective,
  NshSortHeaderDirective,
  type NshSortChange,
  type NshSortDirection,
} from 'nsh-kit-ui';

@Component({
  selector: 'demo-sort-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSortDirective, NshSortHeaderDirective],
  template: `
    <div class="example-stack">
      <table
        class="example-table"
        nshSort
        [active]="active()"
        [direction]="direction()"
        (sortChange)="onSort($event)"
      >
        <thead>
          <tr>
            <th nshSortHeader id="name">Name</th>
            <th nshSortHeader id="role">Role</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alex</td>
            <td>Design</td>
            <td>Remote</td>
          </tr>
          <tr>
            <td>Jordan</td>
            <td>Engineering</td>
            <td>Berlin</td>
          </tr>
        </tbody>
      </table>
      <div class="example-meta">Active: {{ active() }} ({{ direction() || 'none' }})</div>
    </div>
  `,
  styles: [
    `
      .example-stack {
        display: grid;
        gap: var(--nsh-space-sm);
      }

      .example-table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--nsh-font-family);
      }

      th,
      td {
        padding: var(--nsh-space-sm);
        text-align: left;
        border-bottom: 1px solid var(--nsh-color-outline);
      }

      th[nshSortHeader] {
        cursor: pointer;
      }

      .example-meta {
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }
    `,
  ],
})
export class SortBasicExampleComponent {
  readonly active = signal('name');
  readonly direction = signal<NshSortDirection>('asc');

  onSort(change: NshSortChange): void {
    this.active.set(change.active);
    this.direction.set(change.direction);
  }
}

export const sortBasicHtml = `<table nshSort [active]="active" [direction]="direction" (sortChange)="onSort($event)">
  <thead>
    <tr>
      <th nshSortHeader id="name">Name</th>
      <th nshSortHeader id="role">Role</th>
      <th>Location</th>
    </tr>
  </thead>
</table>`;

export const sortBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshSortDirective, NshSortHeaderDirective, type NshSortChange, type NshSortDirection } from 'nsh-kit-ui';

@Component({
  selector: 'demo-sort-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshSortDirective, NshSortHeaderDirective],
  templateUrl: './sort-basic.example.html'
})
export class SortBasicExampleComponent {
  active: string | null = 'name';
  direction: NshSortDirection = 'asc';

  onSort(change: NshSortChange): void {
    this.active = change.active;
    this.direction = change.direction;
  }
}`;
