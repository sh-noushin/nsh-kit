import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  NshCellDefDirective,
  NshColumnDefDirective,
  NshHeaderCellDefDirective,
  NshTableComponent,
} from 'nsh-kit-ui';

interface TableRow {
  name: string;
  status: string;
  updated: string;
}

@Component({
  selector: 'demo-table-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshCellDefDirective,
    NshColumnDefDirective,
    NshHeaderCellDefDirective,
    NshTableComponent,
  ],
  template: `
    <nsh-table [data]="rows()" ariaLabel="Projects table">
      <ng-container nshColumnDef [name]="'name'">
        <ng-template nshHeaderCell>Project</ng-template>
        <ng-template nshCell let-row>{{ row.name }}</ng-template>
      </ng-container>

      <ng-container nshColumnDef [name]="'status'">
        <ng-template nshHeaderCell>Status</ng-template>
        <ng-template nshCell let-row>{{ row.status }}</ng-template>
      </ng-container>

      <ng-container nshColumnDef [name]="'updated'">
        <ng-template nshHeaderCell>Updated</ng-template>
        <ng-template nshCell let-row>{{ row.updated }}</ng-template>
      </ng-container>
    </nsh-table>
  `,
})
export class TableBasicExampleComponent {
  readonly rows = signal<TableRow[]>([
    { name: 'Design system', status: 'Active', updated: 'Today' },
    { name: 'Mobile UI', status: 'Review', updated: 'Yesterday' },
    { name: 'Website', status: 'Draft', updated: '2 days ago' },
  ]);
}

export const tableBasicHtml = `<nsh-table [data]="rows" ariaLabel="Projects table">
  <ng-container nshColumnDef [name]="'name'">
    <ng-template nshHeaderCell>Project</ng-template>
    <ng-template nshCell let-row>{{ row.name }}</ng-template>
  </ng-container>

  <ng-container nshColumnDef [name]="'status'">
    <ng-template nshHeaderCell>Status</ng-template>
    <ng-template nshCell let-row>{{ row.status }}</ng-template>
  </ng-container>

  <ng-container nshColumnDef [name]="'updated'">
    <ng-template nshHeaderCell>Updated</ng-template>
    <ng-template nshCell let-row>{{ row.updated }}</ng-template>
  </ng-container>
</nsh-table>`;

export const tableBasicTs = `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NshCellDefDirective, NshColumnDefDirective, NshHeaderCellDefDirective, NshTableComponent } from 'nsh-kit-ui';

@Component({
  selector: 'demo-table-basic-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshCellDefDirective, NshColumnDefDirective, NshHeaderCellDefDirective, NshTableComponent],
  templateUrl: './table-basic.example.html'
})
export class TableBasicExampleComponent {
  rows = [
    { name: 'Design system', status: 'Active', updated: 'Today' },
    { name: 'Mobile UI', status: 'Review', updated: 'Yesterday' },
    { name: 'Website', status: 'Draft', updated: '2 days ago' }
  ];
}`;
