import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { StdGridComponent } from '../grid/stdGrid/stdGrid.component';

import { PropertyRecordService } from '../../shared/services/appRecords/propertyRecord.service';
import { GridService } from '../../shared/services/grid/grid.service';

@Component({
  selector: 'app-properties-page',
  templateUrl: './propertiesPage.component.html',
  styleUrls: ['./propertiesPage.component.css']
})

export class PropertiesPageComponent implements OnInit, OnDestroy, AfterViewInit {
 @ViewChild(StdGridComponent) stdGridComponent: StdGridComponent;

  constructor(private propertyRecordService: PropertyRecordService,
              private gridService: GridService) {

  }

  ngOnInit() {
    let role = 'dev';
   this.stdGridComponent.setColumnDefs(this.gridService.setTableColumns(this.propertyRecordService.getRecordStructure(), role));
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.propertyRecordService.loadData();
  }


}
