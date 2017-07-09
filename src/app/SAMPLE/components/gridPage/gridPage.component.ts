import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { StdGridComponent } from '../../../common/components/controls/grid/stdGrid/stdGrid.component';
import { GridService } from '../../../common/services/grid/grid.service';

import { GridRecordService } from '../../services/gridRecord.service';

@Component({
  selector: 'app-grid-page',
  templateUrl: './gridPage.component.html',
  styleUrls: ['./gridPage.component.css']
})

export class GridPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(StdGridComponent) stdGridComponent: StdGridComponent;

  constructor(private gridRecordService: GridRecordService,
              private gridService: GridService) {
  }

  ngOnInit() {
    let role = 'dev';
    this.stdGridComponent.setColumnDefs(this.gridService.setTableColumns(this.gridRecordService.getRecordStructure(), role));
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.gridRecordService.loadData();
  }


}
