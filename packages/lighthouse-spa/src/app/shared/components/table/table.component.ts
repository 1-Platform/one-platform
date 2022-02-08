import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

export type Column = {
  title: string;
  isSortable?: boolean;
  sortDir?: 'ASC' | 'DESC';
};

export type Cell = {
  title: string | number;
  chipTitle?: string | number;
  chipColor?: string;
  cellClassName?: string;
};

export type Row = {
  rowClassName?: string;
  cells: Cell[];
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columns: Column[] = [];
  @Input() rows: Row[] = [];
  @Input() loadingText = '';
  @Output('onSort') onSearchInputChangeEvent = new EventEmitter<{
    column: string;
    sortDir: Column['sortDir'];
  }>();
  @Input() isLoading = false;

  constructor() {}

  ngOnInit(): void {}

  onSort(column: string, sortDir: 'ASC' | 'DESC') {
    this.onSearchInputChangeEvent.emit({ column, sortDir });
  }
}
