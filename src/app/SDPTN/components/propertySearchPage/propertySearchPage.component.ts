import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { StdGridComponent } from '../../../common/components/controls/grid/stdGrid/stdGrid.component';
import { GridService } from '../../../common/services/grid/grid.service';


import { PropertyRecordService } from '../../services/propertyRecord.service';

@Component({
  selector: 'app-properties-page',
  templateUrl: './propertySearchPage.component.html',
  styleUrls: ['./propertySearchPage.component.css']
})

export class PropertySearchPageComponent implements OnInit, OnDestroy, AfterViewInit {
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
