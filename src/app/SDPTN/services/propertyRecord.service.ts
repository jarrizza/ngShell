import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { ApiService } from '../../common/services/api/api.service';
import { GridService } from '../../common/services/grid/grid.service';

import { FilterRecord } from '../../common/interfaces/filterRecord.interface';
import { RecordControlService } from '../../common/interfaces/recordControlService.interface';
import { PropertyRecord } from '../models/propertyRecord.model';


@Injectable()
export class PropertyRecordService implements RecordControlService {
  public recordType: string = 'PropertyRecords';
  public loadUrl: string = 'getPropertyRecords';
  public saveUrl: string = 'UpdatePropertyRecords';
  public addUrl: string = 'AddPropertyRecord';
  public deleteUrl: string = 'DeletePropertyRecord';


  public filterRecord: FilterRecord;
  public recordStructure: Array<any> = [
    { headerName: 'Parcel Number',      type: 'number',    prec: 8,   field: 'parcelNumber',    width: 100,  pinned: 'left', align: 'left',   reg: 1, dev: 1},
    { headerName: 'Primary Owner',      type: 'string',    prec: 100, field: 'primaryOwner',    width: 150,  pinned: false,  align: 'left',   reg: 1, dev: 1},
    { headerName: 'Description',        type: 'string',    prec: 100, field: 'description',     width: 150,  pinned: false,  align: 'left',   reg: 1, dev: 1},
    { headerName: 'Situs Address',      type: 'string',    prec: 100, field: 'situsAddress',    width: 150,  pinned: false,  align: 'left',   reg: 1, dev: 1},
    { headerName: 'Mailing Address',    type: 'string',    prec: 100, field: 'mailingAddress',  width: 150,  pinned: false,  align: 'left',   reg: 1, dev: 1},
    { headerName: 'Document',           type: 'string',    prec: 100, field: 'document',        width: 150,  pinned: false,  align: 'left',   reg: 1, dev: 1},
  ];

  public tableData: Array<any>;
  public tableTotals = null;

  private loadTableSource = new Subject<any>();
  public loadTable$ = this.loadTableSource.asObservable();

  private saveTableSource = new Subject<any>();
  public saveTable$ = this.saveTableSource.asObservable();
  private addRecordSource = new Subject<any>();
  public addRecord$ = this.addRecordSource.asObservable();
  private deleteRecordSource = new Subject<any>();
  public deleteRecord$ = this.deleteRecordSource.asObservable();

  private formatTableSource = new Subject<any>();
  public formatTable$ = this.formatTableSource.asObservable();

  constructor(private apiService: ApiService,
              private gridService: GridService
  ) {
    this.updateRecordStructureCustomProps();
  }

  public countRecordsWithErrors(records: Array<any>): number {
    return 0;
  }

  public countRecordsWithWarnings(records: Array<any>): number {
    return 0;
  }

  public updateRecordStructureCustomProps() {
    this.recordStructure.forEach((record) => {
      this.setDefaultSort(record);
      this.setChangeFunctions(record);
    });
  }

  public setDefaultSort(record) {
    if (record.field === 'parcelNumber') {
      record.sort = 'asc';
    }
  }

  private setChangeFunctions(record): void {
    record.changeFuncs = [];
  }

  /*
   ** Loading data
   */

  public loadData() {
    this.gridService.emitLoadSaveObservable(this.loadTableSource, 'start');

    this.apiService.loadRecords(this.loadUrl, {}).toPromise().then(

      response => {
        let copyResponse = _.cloneDeep(response);
       // let canAddRecord: boolean = (this.userService.ROLE === 'sysAdmin' || this.userService.ROLE === 'developer');
        this.gridService.emitTableOptionsObservable(this.formatTableSource, 'showResizeButtons', false);
        this.gridService.emitTableOptionsObservable(this.formatTableSource, 'sizeToFitColumnsOnInit', true);
        this.gridService.emitTableOptionsObservable(this.formatTableSource, 'showLayoutButtons', false);
        this.gridService.emitTableOptionsObservable(this.formatTableSource, 'allowAddRecord', false);

        // Get the table data, transform data as needed, table totals is updated here
        let updatedRecords = this.updateLoadedRecords(copyResponse);
        this.setTableData(updatedRecords);

        // 'false' argument lets listeners know that loading has ENDED
        this.gridService.emitLoadSaveObservable(this.loadTableSource, 'end');
      },
      // Message provides listener context for error handling
      error => this.gridService.emitLoadSaveObservable(this.loadTableSource, 'end', 'Server is not responding')
    );
  }

  public updateLoadedRecords(results: Array<any>) {
    return results.map(
      record => {
         record.recordStatus = 'U';
        record.modified = false;

        record['deleteRecord'] = false;
        return record;
      }
    );
  }

  public updateTableTotals(): void {
  }

  /*
   ** Saving data
   */

  public saveRecords(records: Array<any>, url = this.saveUrl) {
    if (records.length === 0) {
      return;
    }
    console.log('SAVE records - first record:', records[0]);

    this.gridService.emitLoadSaveObservable(this.saveTableSource, 'start');

    let recordsToSave = this.prepareRecordsForSave(records);

    this.apiService.updateRecords(url, recordsToSave, null).toPromise().then(
      success => {
        this.tableData.forEach(record => record['modified'] = false);
        this.gridService.emitLoadSaveObservable(this.saveTableSource, 'end', 'success');
      },
      error => {
        console.log('CIHB ERROR: Failed to Save Employee Record: ' + this.saveUrl + 'Error:' + error);
        this.gridService.emitLoadSaveObservable(this.saveTableSource, 'end', 'error');
      }
    );
  }

  private prepareRecordsForSave(records: Array<any>) {

    return records.map((property) => {
      let copy = _.cloneDeep(property);
      copy['completedFlag'] = property.completedFlag === true ? 'Y' : 'N';
      delete copy.modified;

      return copy;
    });
  }


  /*
   ** Getters/setters
   */

  public getRecordStructure(): Array<any> {
    return this.recordStructure;
  }

  public getTableData(): Array<any> {
    return this.tableData || [];
  }

  public setTableData(records) {
    this.tableData = records;
  }

  public getTableTotalsArray(): Array<any> {
    return null;
  }

  public setFilterRecord(rec: FilterRecord) {
    this.filterRecord = rec;
  }

  public getFilterRecord(): FilterRecord {
    return this.filterRecord;
  }

  public addRecord(url = this.addUrl): void {
    let today = new Date();
    let timestampNow = this.gridService.convertDateObjToTimestamp(today);

    let newProperty = new PropertyRecord({});

    this.apiService.addRecord(url, newProperty).toPromise().then(
      success => {
        let record = newProperty;
        this.tableData.unshift(record);

        // Get the table data, transform data as needed, table totals is updated here
        let updatedRecords = this.updateLoadedRecords(this.tableData);
        this.setTableData(updatedRecords);

        this.gridService.emitAddDeleteObservable(this.addRecordSource, 'add', 'requestDate', record);
      },
      error => {
        this.gridService.emitAddDeleteObservable(this.addRecordSource, 'add', 'error', null);
      }
    );
  }


}
