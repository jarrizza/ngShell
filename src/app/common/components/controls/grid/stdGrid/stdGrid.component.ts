import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { GridOptions, GridApi, ColumnApi, Column, GridCell } from 'ag-grid/main';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LocalStorageService } from '../../../../services/localStorage.service';
import { GridService } from '../../../../services/grid/grid.service';
import { RecordControlService } from '../../../../interfaces/recordControlService.interface';

@Component({
  selector: 'std-grid',
  templateUrl: './stdGrid.component.html',
  styleUrls: ['./stdGrid.component.css']
})

export class StdGridComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('TABLE') elementView: ElementRef;
  @Input() recordService: RecordControlService;
  @Input() LIMITHEIGHT: boolean = true; // if the page can scroll this is false, if not this is true

  public tableId: string = '';
  public hideTable = false;
  public tableMessage = 'Table not available';

  private currentRow: number = 0;
  private currentColumn: Column = null;
  private currentColumnKey: string = null;
  public rowData: Array<any> = null;
  public floatingBottomRowData: Array<any>;
  public tableTotals: Array<any> = null;
  public gridAPI: GridApi = null;
  public columnAPI: ColumnApi = null;
  public lastResult: string = '';

  // These are counters for dataset state totals
  private recordsFound: number = 0;
  private recordsModified: number = 0;
  private recordsDeleted: number = 0;
  private recordsAdded: number = 0;
  private recordsWithErrors: number = 0;
  private recordsWithWarnings: number = 0;
  private columnDefs: Array<any> = []; // use setColumnDefs to set this

  // Approval stuff
  public recordApproved = false;
  public allowSave = false; //true
  public allowExport = false; // true;
  public allowApproval = false;
  public allowDisapproval = false;
  public allowAddRecord = false;
  public allowDeleteRecord = false;
  public onApproveFunc = null;
  public recordApproveFieldName = '';

  // Table appearance stuff
  private tableHasScroll: boolean;
  public tableHeight: number;

  public showResizeButtons = true;
  public showLayoutButtons = true;
  public autoSizeColumnsOnInit = false;
  public sizeToFitColumnsOnInit = false;

  public customLayoutName: string = '';
  public customLayoutDesc: string = '';
  public customLayoutList: Array<any>;

  // Save access control
  private messageNoChange: string = 'There are no modifications to data since last saved to the server. ';
  private messageHasError: string = 'All error conditions must be resolved to save the modified records. ';
  private messageSaveAllowed: string = 'Click here to persist the data changes to the server. ';
  private messageExportAllowed: string = 'Click here to export the table data to a CSV file. ';

  private saveTooltip: string = this.messageNoChange;
  private exportTooltip: string = this.messageExportAllowed;
  private gridOptions: GridOptions;
  private backOutOfTable: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private gridService: GridService,
              private localStorage: LocalStorageService,
              private toastr: ToastsManager
  ) {
 //   this.gridOptions = gridService.getStandardGridOptions();
  }

  ngOnInit() {
    console.log('THE Record service is:');
    console.log(this.recordService);
    this.gridOptions = this.gridService.getStandardGridOptions();
    console.log('THE GRID OPTIONS ARE THESE');
    console.log(this.gridOptions);


    Observable.fromEvent(window, 'resize')
      .takeUntil(this.ngUnsubscribe)
      .debounceTime(100)
      .subscribe((event) => {
        this.onResizeContainer();
      });
    Observable.fromEvent(window, 'scroll')
      .takeUntil(this.ngUnsubscribe)
      .debounceTime(100)
      .subscribe((event) => {
        this.onResizeContainer();
      });
    if (this.recordService.addRecord$) {
      this.recordService.addRecord$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleAddingRecord(e));
    }
    if (this.recordService.deleteRecord$) {
      this.recordService.deleteRecord$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleDeletingRecord(e));
    }
    if (this.recordService.loadTable$) {
      this.recordService.loadTable$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleLoadingTable(e));
    }
    if (this.recordService.saveTable$) {
      this.recordService.saveTable$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleSavingTable(e));
    }
    if (this.recordService.approvalStatus$) {
      this.recordService.approvalStatus$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleApproval(e));
    }
    if (this.recordService.formatTable$) {
      this.recordService.formatTable$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleFormattingTable(e));
    }
    if (this.recordService.resizeContainer$) {
      this.recordService.resizeContainer$.takeUntil(this.ngUnsubscribe).subscribe(e => this.handleResizingContainer(e));
    }
    this.updateCustomLayoutList();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    // Initialize common table container height in order to see table (i.e. column headers/loading overlay) before data is loaded.
    setTimeout(() => {
      if (this.elementView) {
        let rect = this.elementView.nativeElement.getBoundingClientRect();
        let BOTTOMMARGIN = 48;
        this.tableHeight = window.innerHeight - rect.top - BOTTOMMARGIN;
      } else {
        this.tableHeight = 137;
      }
    }, 0);
  }


  /*
   ** agGrid table level event handlers
   */

  public onGridReady(e) {
    this.gridAPI = this.gridOptions.api;
    this.columnAPI = this.gridOptions.columnApi;
  }


  /*
   ** agGrid cell level event handlers
   */

  public onCellFocused(e) {
    this.currentRow = e.rowIndex;
    this.currentColumn = e.column;
    if (e.column) {
      this.currentColumnKey = e.column.colId;
    }

    // if an attempt is made to focus on a cell in a deleted row then ignore it - Todo find the nearest cell to focus
    if (
      this.rowData &&
      this.currentRow !== undefined &&
      this.currentRow !== null &&
      this.currentRow < this.rowData.length &&
      this.currentColumn !== undefined &&
      this.currentColumn !== null
    ) {
      // the editOnFocus is added for custom cell editors to start editing (if editable = false and default editor don't use this)
      if (e.column.colDef.hasOwnProperty('editOnFocus') && e.column.colDef['editOnFocus'] === true) {
        let params = {
          rowIndex: this.currentRow,
          colKey: this.currentColumnKey,
          keyPress: null
        };
        this.gridAPI.startEditingCell(params);
      }
    }
  }


  public onCellClicked(obj) {

    if (!obj ||
      !obj.colDef ||
      !obj.colDef['editOnFocus'] === true ||
      !obj.colDef.cellEditorFramework ||
      !obj.colDef.cellEditorFramework.component ||
      !obj.colDef.cellEditorFramework.component.prototype ||
      !obj.colDef.cellEditorFramework.component.prototype.clickHandler) {
      return;
    }
    // Pass the click event on to custom clickhandler
    if (obj.colDef['type'] === 'yesno') {
      obj.colDef.cellEditorFramework.component.prototype.clickHandler(obj.event);
    }

  }

  public onTableFocus(e) {
    if (this.backOutOfTable === true) {
      this.gridAPI.stopEditing();
      // this.gridAPI.clearFocusedCell();
      this.backOutOfTable = false;
    } else {
      this.goToFirstVisibleCell();
    }
  }

  private goToFirstVisibleCell() {
    if (this.gridAPI) {
      let nodes = this.gridAPI.getRenderedNodes();
      let firstVisibleRow = nodes[0].childIndex;
      let firstColId = nodes[0].columnController.allDisplayedColumns[0].colId;
      if (firstVisibleRow >= 0 && firstColId) {
        this.gridAPI.setFocusedCell(firstVisibleRow, firstColId);
      }
    }
  }

  /** Intercept keypress on the component to interpret enter as a down arrow and space asa a checkbox toggle **/

  public onKeydown(e: KeyboardEvent) {

    // Tab
    if (e.keyCode === 9 && this.gridAPI) {
      let focusedCell: GridCell = this.gridAPI.getFocusedCell();
      if (e.shiftKey === true) {
        if (focusedCell.column.getLeft() === 0 && focusedCell.rowIndex === 0) {
          this.backOutOfTable = true;
        }
      }
    }

    // 'Enter' processing - go down to the next row
    if (e.which === 13) {
      if (this.gridAPI && (this.currentRow >= 0) && (this.currentRow < this.recordsFound - 1) && this.currentColumn) {
        this.gridAPI.setFocusedCell((this.currentRow + 1), this.currentColumn.getId(), null);
      }
    }
  }

  /** Size calculations for a grid **/

  // Height Sizing

  private getMaxHeightAvailable() {
    if (!this.elementView) {
      return 0;
    }
    let rect = this.elementView.nativeElement.getBoundingClientRect();
    let top = rect.top; //  + window.scrollY;
    const BOTTOMMARGIN = 48; // 180; // footer size
    let height = window.innerHeight - top - BOTTOMMARGIN;
    return height;
  }

  private getFullTableRowHeight(): number {
    let rows = 1;
    if (this.rowData && this.rowData.length > 1) {
      rows = this.rowData.length;
    }
    // Row heights + header height
    let height = (rows * 34) + 67;
    let totals = this.recordService.getTableTotalsArray();
    if (totals && totals.length > 0) {
      height += 34;
    }
    return height;
  }

  public onResizeContainer() {
    let height = this.getFullTableRowHeight();
    // We keep track of tableHasScroll so we can sizeToFit when the default column width is equal to table width but the scrollbar is visible (and potentially covering up data in the cell)
    this.tableHasScroll = false;

    if (this.LIMITHEIGHT) {
      let maxAvailable = this.getMaxHeightAvailable();
      if (maxAvailable < height) {
        height = maxAvailable;
        this.tableHasScroll = true;
      }
    }
    if (height < 137) {
      height = 137;
    }
    this.tableHeight = height;
    this.adjustColumnSizes();
  }


  // Width Sizing

  public getTableWidthByDefaultColumnWidth(): number {
    let columns = this.getColumnState();
    return columns.reduce((a, b) => {
      let width = 0;
      if (b.hide === false) {
        width = b.width;
      }
      return a + width;
    }, 0);
  }

  public adjustColumnSizes() {
    if (!this.elementView) {
      return;
    }
    let defaultTableWidth = this.getTableWidthByDefaultColumnWidth();
    let rect = this.elementView.nativeElement.getBoundingClientRect();
    if (
      (defaultTableWidth < rect.width) ||
      (defaultTableWidth === rect.width && this.tableHasScroll)
    ) {
      this.sizeToFit();
    }
  }

  public sizeToFit() {
    this.gridService.stopCellEditing(this.gridAPI);
    this.gridService.sizeColumnsToFit(this.gridAPI);
  }

  public autoSizeAll() {
    this.gridService.stopCellEditing(this.gridAPI);
    this.gridService.autoSizeAllColumns(this.columnAPI, this.columnDefs);
  }

  /*
   ** Approval stuff
   */

  public showRecordApproved() {
    this.recordApproved = true;
    this.allowSave = false;
    this.setColumnDefs(this.gridService.setTableReadOnly(this.columnDefs));
  }

  public showRecordDisapproved() {
    this.recordApproved = false;
    this.allowApproval = true;

    let newColumnDefs = this.columnDefs.map((column) => this.gridService.setOriginalAccessState(column));
    this.setColumnDefs(newColumnDefs);
  }

  public onCellValueChanged(e) {
    let record = e.data;
    let column = e.colDef;
    let changeFuncs = column.changeFuncs;

    // Because onCellValueChanged() is invoked everytime user blurs from editing cell
    if (!record || e.hasOwnProperty('oldValue') && e.oldValue === e.newValue) {
      return;
    }


    if (changeFuncs && changeFuncs.length) {
      changeFuncs.forEach(fn => fn(record, this.rowData, this.recordService ));
    }

    record.modified = true;
    this.recordService.updateTableTotals();
    this.updateTableHeaderInfo();
    this.gridAPI.refreshView();

    setTimeout(() => {
      if (this.currentRow >= 0 && this.currentColumnKey) {
        this.gridAPI.startEditingCell({
          rowIndex: this.currentRow,
          colKey: this.currentColumnKey
        });
      }
    }, 0);
  }

  /*
   ** Table icon button handlers
   */

  public onSave() {
    this.gridService.stopCellEditing(this.gridAPI);
    if (this.recordsWithErrors > 0) {
      this.toastr.error('Your data did not save correctly.  Please check for errors.', 'Oops.');
      return;
    }
    if (this.recordService && this.rowData) {
      let modifiedRecords = this.rowData.filter(item => item.modified);
      this.recordService.saveRecords(modifiedRecords);
      this.recordsAdded = this.recordsDeleted = 0;
    }
  }

  public onExport() {
    this.gridService.stopCellEditing(this.gridAPI);
    this.gridService.exportTableData(this.gridAPI);
  }


  public onAddRecord() {
    this.gridService.stopCellEditing(this.gridAPI);
    this.recordService.addRecord();
  }

  public onApprove(selectedOption: boolean) {
    this.gridService.stopCellEditing(this.gridAPI);
    if (selectedOption) {
      this.recordService.approveAllRecords();
      this.recordService.saveRecords(this.rowData);
      this.adjustColumnSizes();
    }
  }

  public onDisapprove(selectedOption: boolean) {
    this.gridService.stopCellEditing(this.gridAPI);
    if (selectedOption) {
      this.recordService.disapprove();
      this.recordService.saveRecords(this.rowData);
      this.showRecordDisapproved();
      this.adjustColumnSizes();
    }
  }

  public onSaveLayout(selectedOption: boolean) {
    this.gridService.stopCellEditing(this.gridAPI);
    if (selectedOption) {
      if (!this.customLayoutName) {
        this.toastr.error('Did you provide a name?', 'Filter Not Saved', { dismiss: 'click' });
        return;
      }
      let layoutRecord = this.getColumnState();
      this.setCustomLayoutDesc(this.recordService.recordType + this.gridService.tableId + 'Table');
      this.localStorage.setItemInLocalStorage(this.customLayoutName, layoutRecord, this.customLayoutDesc);
      this.setCustomLayoutList(this.localStorage.getFilteredListOfKeysInLocalStorage(this.customLayoutDesc));
      this.toastr.success('Filter Saved');
    }
    this.resetCustomLayoutName();
  }

  public onLoadLayout(selectedOption: boolean): void {
    this.gridService.stopCellEditing(this.gridAPI);
    if (selectedOption && this.customLayoutName) {
      if (this.customLayoutName === 'Default') {
        let records = this.gridService.setTableColumns(this.recordService.getRecordStructure(), this.recordService.currentTableView);
        records.forEach(record => {
          this.recordService.setDefaultSort(record);
        });
        this.setColumnDefs(records);
      } else {
        let layoutRecord = this.localStorage.getItemInLocalStorage(this.customLayoutName, this.customLayoutDesc);
        this.setColumnState(layoutRecord);
      }
      this.toastr.success('Layout Loaded');
      // We reset the current row and column key because we cannot manually start editing a row/column that doesn't exist on cell value changed.
      let columnState: Array<any> = this.getColumnState();
      let firstVisibleColumn = columnState.filter(columns => !columns.hide)[0];
      this.currentColumnKey = firstVisibleColumn ? firstVisibleColumn.colId : null;
      this.currentRow = 0;
    }
    this.resetCustomLayoutName();
  }


  /*
   ** Loading data handlers
   */

  private resetFlags() {
    this.recordsFound = 0;
    this.recordsModified = 0;
    this.recordsWithErrors = 0;
    this.recordsWithWarnings = 0;
    this.recordApproved = false;
    this.allowSave = false; //true;
    this.allowExport = false; //true;
    this.allowApproval = false;
    this.allowDisapproval = false;
    this.allowAddRecord = false;
    this.showResizeButtons = true;
    this.showLayoutButtons = true;
    this.autoSizeColumnsOnInit = false;
    this.sizeToFitColumnsOnInit = false;
  }

  private onLoadStart() {
    this.resetFlags();
    this.recordsFound = 0;
    this.recordsModified = 0;
    this.recordsDeleted = 0;
    this.recordsAdded = 0;
    this.recordsWithErrors = 0;
    this.recordsWithWarnings = 0;
    if (!this.hideTable) {
      this.gridService.showLoadingOverlay(this.gridAPI);
    }
  }

  private checkRecordsFound() {
    if (this.rowData.length > 0) {
      this.gridService.hideOverlay(this.gridAPI);
    }
    if (this.rowData.length === 0) {
      this.gridService.showNoRowsOverlay(this.gridAPI);
    }
  }

  private onLoadEnd() {
    if (this.hideTable) {
      this.rowData = [];
      return;
    }
    this.rowData = this.recordService.getTableData();
    this.floatingBottomRowData = this.recordService.getTableTotalsArray();
    this.checkRecordsFound();
    this.updateTableHeaderInfo();

    setTimeout(() => {
      this.onResizeContainer();
      this.gridAPI.doLayout();
      if (this.gridAPI) {
        // Ensure data scrolls back to the top (Will not be needed in the newest ag-grid)
        setTimeout(() => this.gridAPI.ensureIndexVisible(0), 0);
      }
    }, 0);
  }

  private onNumberOfRecordsChanged() {
    let rowData = this.recordService.getTableData();

    // Adjusts the height of the grid
    this.onResizeContainer();

    this.rowData = rowData;
    this.floatingBottomRowData = this.recordService.getTableTotalsArray();

    this.checkRecordsFound();

    this.recordService.updateTableTotals();

    this.updateTableHeaderInfo();

    if (this.gridAPI) {
      this.gridAPI.refreshView();
    }
  }

  /*
   ** Saving data handlers
   */

  public onSaveStart() {
    this.gridService.showLoadingOverlay(this.gridAPI);
  }

  public onSaveSuccess() {
    this.updateTableHeaderInfo();
    // Is refreshView necessary?
    this.gridAPI.refreshView();
    this.gridService.hideOverlay(this.gridAPI);
    this.toastr.success('Data successfully saved.', 'Success!');
  }

  public onSaveError() {
    this.gridService.hideOverlay(this.gridAPI);
    this.toastr.error('Your data did not save correctly, please try again.', 'Oops.');
  }


  /*
   ** Container related stuff
   */


  public updateTableHeaderInfo(): void {
    this.recordsFound = this.rowData.length;
    this.recordsModified = this.rowData.filter(item => (item.modified && item.recordStatus !== 'A')).length;
    this.recordsAdded = this.rowData.filter(item => item.recordStatus === 'A').length;
    if (this.recordService.deletedRecords) {
      this.recordsDeleted = this.recordService.deletedRecords.length;
    }
    this.recordsWithErrors = this.recordService.countRecordsWithErrors(this.rowData);
    this.recordsWithWarnings = this.recordService.countRecordsWithWarnings(this.rowData);

    this.updateTooltips();
  }

  public updateTooltips() {
    if (this.recordsWithErrors > 0) {
      this.exportTooltip = this.saveTooltip = this.messageHasError;
    } else {
      this.saveTooltip = this.messageSaveAllowed + this.recordsModified + ' records will be saved.';
      this.exportTooltip = this.messageExportAllowed + this.rowData.length + ' records will be exported.';
    }
  }

  /*
   ** Custom table layout handlers
   */

  public deleteCustomLayout() {
    this.localStorage.removeItemInLocalStorage(this.customLayoutName, this.customLayoutDesc);
    this.setCustomLayoutList(this.localStorage.getFilteredListOfKeysInLocalStorage(this.customLayoutDesc));
    this.toastr.success('Layout Deleted');
    this.resetCustomLayoutName();
  }

  public updateCustomLayoutList(): void {
    this.setCustomLayoutDesc(this.recordService.recordType + this.gridService.tableId + 'Table');
    this.setCustomLayoutList(this.localStorage.getFilteredListOfKeysInLocalStorage(this.customLayoutDesc));
  }

  private setCustomLayoutDesc(desc: string): void {
    this.customLayoutDesc = desc;
  }

  private setCustomLayoutList(list): void {
    this.customLayoutList = list;
  }

  private resetCustomLayoutName(): void {
    this.customLayoutName = '';
  }

  public onSortChanged(e) {
    let sortState = this.getSortModel();
    this.gridService.tableSortState = sortState;
  }

  public getSortModel() {
    return this.gridService.getSortModel(this.gridAPI);
  }

  public setSortModel(sortState) {
    this.gridService.setSortModel(this.gridAPI, sortState);
  }

  public getColumnState() {
    return this.gridService.getColumnState(this.columnAPI);
  }

  public setColumnState(columnState) {
    this.gridService.setColumnState(this.columnAPI, columnState);
  }

  /*
   ** Getters/setters
   */

  public setColumnDefs(columnDefs) {
    this.columnDefs = columnDefs;
  }

  /*
   ** Subscription handlers
   */
  private handleAddingRecord(e) {
    this.onNumberOfRecordsChanged();
  }

  private handleDeletingRecord(e) {
    this.onNumberOfRecordsChanged();
  }

  private handleLoadingTable(e) {
    if (e.status === 'start') {
      this.onLoadStart();
    }
    if (e.status === 'end') {
      this.onLoadEnd();
      this.updateTooltips();
    }
    this.lastResult = e.message;
  }

  private handleSavingTable(e) {
    if (e.status === 'start') {
      this.onSaveStart();
    }
    if (e.status === 'end' && e.message === 'success') {
      this.onSaveSuccess();
    }
    if (e.status === 'end' && e.message === 'error') {
      this.onSaveError();
    }
  }

  private handleApproval(e) {
    if (e.type === 'allowApproval' || e.type === 'showTable' || e.type === 'allowSave' || e.type === 'recordApproved') {
      this[e.type] = e.approved;
    }
    if (e.type === 'recordApproved') {
      if (e.approved === true) {
        // Set table read only
        this.showRecordApproved();
      } else {
        this.showRecordDisapproved();
      }
    }
  }

  private handleFormattingTable(e) {
    if (this.hasOwnProperty(e.type)) {
      this[e.type] = e.flag;
    }
  }

  private handleResizingContainer(e) {
    setTimeout(() => this.onResizeContainer(), 0);
  }

}
