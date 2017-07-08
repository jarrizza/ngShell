import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import * as _ from 'lodash';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid/main';

import { DeleteEditorComponent } from '../../../components/grid/cellEditors/deleteEditor.component';
import { DateEditorComponent } from '../../../components/grid/cellEditors/dateEditor.component';
import { ToggleEditorComponent } from '../../../components/grid/cellEditors/toggleEditor.component';
import { YNButtonEditorComponent } from '../../../components/grid/cellEditors/ynbuttonEditor.component';

@Injectable()
export class GridService {

  public calendarDate = new Date();
  public tableId: string = '';
  public tableColumnState: any = {};
  public tableSortState: Array<any> = [];

  constructor() {
  }

  public getStandardGridOptions(): GridOptions {
    return {
      overlayLoadingTemplate: '<span style="padding: 10px; border: none; background: transparent;">' +
      '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>`' +
      '</span>',
      overlayNoRowsTemplate: '<span style="padding: 10px; border: none; background: transparent;">' +
      'No Records' +
      '</span>',
      enableCellExpressions: true,
      singleClickEdit: true,
      enableSorting: true,
      enableColResize: true,
      rowHeight: 34,
      headerHeight: 42,
      rowSelection: 'none',
      suppressRowClickSelection: true,
      suppressScrollLag: true,
      // stopEditingWhenGridLosesFocus: true,
      sortingOrder: ['asc', 'desc']
    };
  }

  public setTableColumns(columnDefs, tableId) {
    let selectedColumns = [];
    let typeField = tableId.slice(0, 3).toLowerCase();
    if (tableId && tableId.length > 0) {
      this.setTableId(tableId);
      let columns = columnDefs.filter(item => item[typeField] > 0);
      selectedColumns = this.addCommonColumnProperties(columns, typeField);
    }

    return selectedColumns;
  }

  private setTableId(tableId: string): void {
    this.tableId = tableId;
  }

  public setTableReadOnly(selectedColumns) {
    return selectedColumns.map((column) => {
      this.setDisplayFieldOptions(column);
      return column;
    });
  }

  public updateTableColumnState(columnDefs, tableView) {
    let itemMap = {};
    columnDefs.forEach(item => {
      let key = item.field;
      itemMap[key] = _.cloneDeep(item);
    });

    let savedColumnState = this.tableColumnState[tableView];
    if (savedColumnState) {
      let result = [];
      for (let i = 0; i < savedColumnState.length; i++) {
        let item = savedColumnState[i];
        let record = itemMap[item.colId];
        if (record) {
          record.hide = item.hide;
          record.pinned = item.pinned;
          record.width = item.width;
          result.push(record);
        }
      }
      return result;
    }
    return columnDefs;
  }

  public updateTableSortState(columnDefs) {
    let sortState = this.tableSortState[0];
    if (sortState) {
      let index = columnDefs.map(item => item.field).indexOf(sortState.colId);
      if (index > -1) {
        this.removeSortState(columnDefs);
        columnDefs[index].sort = sortState.sort;
      }
    }
    return columnDefs;
  }

  public removeSortState(columnDefs) {
    return columnDefs.map(item => {
      if (item.sort) {
        delete item.sort;
      }
    });
  }

  /************************************* Data Input validation
   * The params sent to the newValueHandler (and its precursors) are as follows
   * node: The grid node in question.
   * data: The row data in question.
   * oldValue: If 'field' is in the column definition, contains the value in the data before the edit.
   * newValue: The string value entered into the default editor.
   * rowIndex: The index of the virtualized row.
   * colDef: The column definition.
   * context: The context as set in the gridOptions.
   * api: A reference to the ag-Grid API.
   *****************************************/


  /* This function updates column properties for the table based on common rules */
  public addCommonColumnProperties(selectedColumns, typeField) {
    return selectedColumns.map((column) => {

      // We're giving every column a 'volatile' tag so when we do a soft refresh, all cells will get refreshed (cell styling).
      // This is to solve an issue where a hard refresh will cause you to lose context or state (cell editing) during the refresh.
      // https://www.ag-grid.com/javascript-grid-refresh/#gsc.tab=0
      column.volatile = true;

      // We'll now apply 'row' styles at the cell level, since we don't have the luxury of re-drawing all rows
      column.cellStyle = this.addCommonCellStyles;

      switch (column.type) {
        case 'currency':
          column.cellRenderer = this.renderCurrency;
          break;
        case 'percent':
          column.cellRenderer = this.renderPercent;
          break;
        case 'percentHideZero':
          column.cellRenderer = this.renderPercentHideZero;
          break;
        case 'yesno':
          column.cellRenderer = this.renderYesNo;
          break;
        case 'ynbutton':
          column.cellRenderer =  this.renderYNState;
          column.floatingCellRenderer = this.renderBlank;
          break;
        case 'deletebutton':
          column.cellRenderer = this.renderDeleteButton;
          column.floatingCellRenderer = this.renderBlank;
          break;
        case 'date':
          column.cellRenderer = this.renderDate;
          break;
        case 'calendar':
          column.cellRenderer = this.renderCalendar;
          break;
        default: ;
      }

      // preserve the original field access type (1=read, 2=input, 3=calculate)
      column['originalAccessState'] = column[typeField];

      if (column['originalAccessState'] === 2) {
        this.setInputFieldOptions(column);
      } else if (column['originalAccessState'] === 3) {
        this.setCalculatedFieldOptions(column);
      } else {
        this.setDisplayFieldOptions(column); // case 1: (read only) handler
      }

      return column;
    });
  }

  /***** This function sets up new value handlers for the various types of input fields.
   *     There is a handler for every type of field to allow for input conversions the internal format of the data
   *     is saved to the data structure for push rto the backend.
   *****/
  public setInputFieldOptions(column) {
    // Use a function to return dynamic boolean value based on row data
    column.editable = this.setEditable;


    // The newValueHandler does the conversions for internal storage
    switch (column.type) {
      case 'currency':
        column.newValueHandler = this.newValueHandlerCurrency;
        break;
      case 'percent':
      case 'percentHideZero':
        column.newValueHandler = this.newValueHandlerPercent;
        break;
      case 'date':
        column.cellRenderer = this.renderDate;
        column.floatingCellRenderer = this.renderBlank;
        column.cellEditorFramework = DateEditorComponent;
        break;
        /*
      case 'calendar':
        column.editOnFocus = true;
        column.cellRenderer = this.renderCalendar;
        column.floatingCellRenderer = this.renderBlank;
        column.cellEditorFramework = CalendarEditorComponent;
        break;
        */
      case 'yesno':
        column.editOnFocus = true;
        column.cellRenderer = this.renderYesNoInput;
        column.floatingCellRenderer = this.renderBlank;
        column.cellEditorFramework = ToggleEditorComponent;
        break;
      case 'deletebutton':
        column.editOnFocus = true;
        column.cellRenderer = this.renderDeleteButton;
        column.floatingCellRenderer = this.renderBlank;
        column.cellEditorFramework = DeleteEditorComponent;
        break;
      case 'ynbutton':
        column.editOnFocus = true;
        column.cellRenderer = this.renderYNButton;
        column.floatingCellRenderer = this.renderBlank;
        column.cellEditorFramework = YNButtonEditorComponent;
        break;

      default: column.newValueHandler = this.newValueHandler;
    }

    column.headerClass = this.setInputFieldHeaderClass;
    column.cellClass = this.setInputFieldCellClass;
  }

  public setDisplayFieldOptions(column) {
    column.editable = false;
    column.template = null;
    column.newValueHandler = null;
    if (column.type === 'ynbutton') {
      column.cellRenderer = this.renderYNState;
    } else if (column.type === 'yesno') {
      column.cellRenderer = this.renderYesNo;
    } else if (column.type === 'deletebutton') {
      column.cellRenderer = this.renderDeleteButton;
      column.floatingCellRenderer = this.renderBlank;
      column.editable = false;
    } else if (column.type === 'link') {
      column.cellRenderer = this.renderLink;
      column.floatingCellRenderer = this.renderBlank;
      column.editable = false;
    }
    column.headerClass = ['display-true', this.getHeaderAlignClass(column.align)];
    column.cellClass = ['display-true', this.getCellAlignClass(column.align)];
  }

  public setCalculatedFieldOptions(column) {
    column.volatile = true;
    column.headerClass = ['calculated-true', this.getHeaderAlignClass(column.align)];
    column.cellClass = ['calculated-true', this.getCellAlignClass(column.align)];
  }

  // Manage styling
  private addCommonCellStyles(params) {
    if (
      params.data.inputError === true ) {
      return { 'color': '#b52d2a' };  // burgundy
    }
    if (params.data.disable === true) {
      return { 'color': '#999' };  // light grey
    }
    return { 'color': 'black' };
  }

  private setEditable(params): boolean {
    let row = params.node;
    if (row) {
      // If rowNode is 'floating' (totals), set editable to false
      if (row.floating) {
        return false;
      }
      // If rowData includes these attributes, make the row read only
      if (row.data && row.data.adisable === true) {
        return false;
      }
    }
    return true;
  }

  // The purpose of the originalAccessState is to restore original state to a column when records are 'disabled'

  public setOriginalAccessState(column) {
    if (column['originalAccessState'] === 2) {
      this.setInputFieldOptions(column);
    } else if (column['originalAccessState'] === 3) {
      this.setCalculatedFieldOptions(column);
    } else {
      this.setDisplayFieldOptions(column); // case 1: (read only) handler
    }
    return column;
  }

  /** Column properties for display, input and calculated field types in grid **/
  private getCellAlignClass(colAlign): string {
    if (colAlign === 'center' || colAlign === 'right') {
      return 'align-' + colAlign;
    }
    return 'padding-left';
  }

  private getHeaderAlignClass(colAlign): string {
    if (colAlign === 'center' || colAlign === 'right') {
      return 'header-align-' + colAlign;
    }
    return 'header-padding-left';
  }

  private setInputFieldCellClass(params) {
    const getAlign = (colAlign) => {
      if (colAlign === 'center' || colAlign === 'right') {
        return 'align-' + colAlign;
      }
      return 'padding-left';
    };

    let column = params.colDef;
    let row = params.node;

    // Default input field cell class
    return ['input-true', getAlign(column.align)];
  }

  private setInputFieldHeaderClass(params) {
    let column = params.colDef;
    // Default input field cell class
    return ['input-true', 'align-center'];
  }

  public showLoadingOverlay(gridAPI: GridApi) {
    if (gridAPI) {
      gridAPI.showLoadingOverlay();
    }
  }

  public hideOverlay(gridAPI: GridApi) {
    if (gridAPI) {
      gridAPI.hideOverlay();
    }
  }

  public showNoRowsOverlay(gridAPI: GridApi) {
    if (gridAPI) {
      gridAPI.showNoRowsOverlay();
    }
  }

  /* called whenever loading process is complete */
  public finishedLoadingData(gridAPI: GridApi, numberOfRecordsFound: number, columnAPI: ColumnApi, columnDefs: Array<any>) {
    if (gridAPI) {
      if (numberOfRecordsFound === 0) {
        gridAPI.showNoRowsOverlay();
      } else {
        gridAPI.hideOverlay();
      }
    }
  }

  public exportTableData(gridAPI: GridApi, fileName = 'export.csv') {
    // console.log("Export has been clicked - use ag-grid export to: "+filepath);
    if (gridAPI) {
      let params = {
        fileName,
        skipHeader: false,
      };
      gridAPI.exportDataAsCsv(params);
    }
  }

  public importTableData(gridAPI: GridApi, filepath: String) {
    // console.log("Import has been clicked - not yet implemented");
  }

  public approveTable(gridAPI: GridApi, func) {
    if (func) {
      func();
    }
    // console.log("Approve has been clicked");
  }

  public sizeColumnsToFit(gridAPI: GridApi) {
    if (gridAPI) {
      // setTimeout(() => gridAPI.sizeColumnsToFit(), 0);
      // setTimeout(() => gridAPI.sizeColumnsToFit(), 500, true);
      setTimeout(() => gridAPI.sizeColumnsToFit(), 0, true);
    }
  }

  public stopCellEditing(gridAPI: GridApi) {
    if (gridAPI) {
      gridAPI.stopEditing();
    }
  }

  public autoSizeAllColumns(columnAPI: ColumnApi, columnDefs) {
    let allColumnIds = [];
    columnDefs.forEach( function(columnDef) {
      allColumnIds.push(columnDef.field);
    });
    if (columnAPI) {
      setTimeout(() => columnAPI.autoSizeColumns(allColumnIds), 0);
    }
  }

  public getColumnState(columnAPI: ColumnApi): any {
    if (columnAPI) {
      return columnAPI.getColumnState();
    }
  }

  public setColumnState(columnAPI: ColumnApi, columnState) {
    if (columnAPI) {
      columnAPI.setColumnState(columnState);
    }
  }

  public resetColumnState(columnAPI: ColumnApi) {
    if (columnAPI) {
      columnAPI.resetColumnState();
    }
  }

  public getSortModel(gridAPI: GridApi): any {
    if (gridAPI) {
      return gridAPI.getSortModel();
    }
  }

  public setSortModel(gridAPI: GridApi, sortModel) {
    if (gridAPI) {
      gridAPI.setSortModel(sortModel);
    }
  }

  public getRoundedPercent(value) {
    value = parseFloat(value.toFixed(2));
    if ( value > 100.00 ) { value = 100.00; }
    if ( value < 0.00 ) { value = 0.00; }
    return value;
  }

  /* Passed a list of column options saves them */
  public getSelectedColumns(tableType, recordStructure) {
    let selectedColumns: Array<any>;
    let typeField = tableType.slice(0, 3).toLowerCase();
    selectedColumns = recordStructure.filter((item) => {
      return (item[typeField] > 0);
    });
    selectedColumns = this.addCommonColumnProperties(selectedColumns, typeField);
    return selectedColumns;
  }

  /** These functions are used for field rendering in the grid.
   *  These are standard grid treatments for display of the various field types **/


  public renderCurrency(params) {
    if (params.value === '' || params.value == null) {
      return '';
    }
    let value = +params.value;
    if (isNaN(value)) {
      return params.value;
    }

    let comma = value.toLocaleString('US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return '$' + comma;
  }

  public renderYesNo(params) {
    if (params.value === true || params.value === 'Y') {
      return 'Yes';
    }
    if (params.value === false || params.value === 'N') {
      return '';
    }
    return params.value || '';
  }

  public renderBlank(params) {
    return '';
  }

  public renderYNState(params) {
    if (params.value) {
      return 'Y';
    } else {
      return 'N';
    }
  }

  public renderYNButton(params) {
    if (params.value === true || params.value === false) {
      let element = document.createElement('input');
      element.setAttribute('style', 'height: 24px; margin: 1px; padding-top: 0;');
      element.type = 'button';
      if (params.value) {
        element.value = 'Y';
      } else {
        element.value = 'N';
      }
      return element;
    } else if (params.value) {
      return params.value.toString();
    } else {
      return '';
    }
  }

  public renderDate(params) {
    let dateDisplay = '';
    let paramDate = Date.parse(params.value);

    // If its a valid date format it as: Mon dd, yyyy (otherwise it will be blank
    if ( params.value && params.value !== '' && isNaN(paramDate) === false) {
      dateDisplay = moment(paramDate).format('MMM DD, YYYY');
    }

    let element = document.createElement('span');
    element.innerText = dateDisplay;
    return element;
  }

  public renderCalendar(params) {
    let dateDisplay = '';
    let paramDate = Date.parse(params.value);

    // If its a valid date format it as: Mon dd, yyyy (otherwise it will be blank
    if ( params.value && params.value !== '' && isNaN(paramDate) === false) {
      dateDisplay = moment(paramDate).format('MMM DD, YYYY') + ' ';
    } else {
      dateDisplay = 'Not selected ';
    }

    let element = document.createElement('span');
    let dateStr = document.createElement('span');
    dateStr.innerText = dateDisplay;
    let icon = document.createElement('i');
    icon.className = 'fa fa-calendar fa-fw';
    element.appendChild(dateStr);
    element.appendChild(icon);
    return element;
  }

  public renderYesNoInput(params) {
    // Check for special read only instances
    let row = params.node;
    if (row && row.data) {
      if (row.data.asrStatus === 'I' || row.data.payDecisionApprovalFlag === 'Y') {
        if (params.value === true || params.value === 'Y') {
          return 'Yes';
        }
        if (params.value === false || params.value === 'N') {
          return '';
        }
      }
    }
    if (params.value === true || params.value === false) {
      let element = document.createElement('span');
      let icon = document.createElement('i');
      icon.className = params.value === true ? 'fa fa-check-square-o fa-fw fa-lg' : 'fa fa-square-o fa-fw';
      element.appendChild(icon);
      return element;
    }

    return params.value || '';
  }

  public renderLink(params) {
    let element = document.createElement('a');
    element.setAttribute('href', params.value);
    element.setAttribute('target', '_blank');
    element.innerHTML = params.value;
    return element;
  }

  public renderDeleteButton(params) {
    let icon = document.createElement('i');
    icon.setAttribute('tabindex', '0');
    icon.className = 'fa fa-trash-o fa-lg';
    return icon;
  }

  public renderCheck(params) {
    if (params.value) {
      return '<i class="fa fa-check" aria-hidden="true"></i>';
    } else {
      return '';
    }
  }

  public renderPercent(params) {
    let value = +params.value;
    // params has value property and 'isNumeric'
    if (params.hasOwnProperty('value') && (!isNaN(value) && isFinite(value))) {
      let prec = params.colDef.prec;
      let rounded = value.toFixed(prec);
      return rounded + '%';
    }
    return '';
  }

  public renderPercentHideZero(params) {
    let value = +params.value;
    // params has value property and 'isNumeric'
    if (params.hasOwnProperty('value') && (!isNaN(value) && isFinite(value))) {
      let prec = params.colDef.prec;
      let rounded = value.toFixed(prec);
      return value === 0 ? '' : rounded + '%';
    }
    return '';
  }

  /* These functions parse and validate input using percision and data type and setting the modified flag as needed */

  public newValueHandler(params) {
    // console.log('STRING - oldValue: '  +  params.oldValue  +  ' newValue: ' + params.newValue + ' field: ' + params.colDef.field);
    // Remove whitespace at beginning and end
    let newValue = params.newValue.trim();
    if (!params || params.oldValue === newValue) {
      return;
    }
    // this is where the data is actually placed in the data field
    let field = params.colDef.field; // colDef is the column definition
    let record = params.data; // row data for the record
    record[field] = newValue;
  }

  public newValueHandlerPercent(params) {
    let newValue = params.newValue.trim();
    // Check if empty string/etc. === empty string/etc.
    if (!params || params.oldValue === newValue) {
      return;
    }
    // Convert string to number
    let value = +newValue;
    if (isNaN(value) || params.oldValue === value) {
      return;
    }
    let field = params.colDef.field;
    let record = params.data;
    record[field] = +value.toFixed(2);
  }

  public newValueHandlerCurrency(params) {
    // console.log('CURRENCY - oldValue: ' + params.oldValue + ' newValue: ' + params.newValue + ' type:  ' + params.colDef.prec);
    let newValue = params.newValue.trim();
    if (!params || params.oldValue === newValue) {
      return;
    }
    let value = +newValue;
    if (isNaN(value) || params.oldValue === value) {
      return;
    }
    let field = params.colDef.field;
    let record = params.data;
    record[field] = +value.toFixed(2);
  }

  /* Observable handlers */

  public emitTableOptionsObservable(subject: Subject<any>, type: string, flag: boolean) {
    subject.next({
      flag: flag,
      type: type
    });
  }

  public emitAddDeleteObservable(subject: Subject<any>, type: string, key: string, record: any) {
    subject.next({
      type: type,
      key: key,
      record: record
    });
  }

  public emitLoadSaveObservable(subject: Subject<any>, status: string, message = '') {
    subject.next({
      status: status,
      message: message
    });
  }

  public emitUpdateTableSummaryObservable(subject: Subject<any>, approvedFlag: boolean, type = '') {
    subject.next({
      approved: approvedFlag,
      type: type
    });
  }

  public emitApprovalStatusObservable(subject: Subject<any>, approved: boolean, type = '') {
    subject.next({
      approved: approved,
      type: type
    });
  }

  public emitResizeContainerObservable(subject: Subject<any>, resize: boolean) {
    subject.next({
      resize: resize
    });
  }

  // converts from Date object to internal string (YYYY-MM-DD HH:MM:SS)
  public convertDateObjToTimestamp(dt: Date): string {
    let month = (dt.getMonth() + 1).toString();
    let day = dt.getDate().toString();
    let hh = dt.getHours().toString();
    let mm = dt.getMinutes().toString();
    let ss = dt.getSeconds().toString();
    let timestamp = dt.getFullYear() + '-' + (month.length === 1 ? '0' : '') + month + '-' + (day.length === 1 ? '0' : '') + day +
      ' ' + (hh.length === 1 ? '0' : '') + hh + ':' + (mm.length === 1 ? '0' : '') + mm + ':' + (ss.length === 1 ? '0' : '') + ss;
    return timestamp;
  }


}
