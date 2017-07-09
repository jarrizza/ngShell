import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';

import { MapDisplayComponent } from '../../../common/components/controls/map/mapDisplay/mapDisplay.component';
// import { MapNavigatorComponent } from '../map/mapNavigator/mapNavigator.component';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filterPage.component.html',
  styleUrls: ['./filterPage.component.css']
})

export class FilterPageComponent implements OnInit, AfterViewChecked {

  @ViewChild(MapDisplayComponent) displayComponent: MapDisplayComponent;

  constructor() {}

  ngOnInit() {
    console.log('ONINIT on mapPage called');
    this.displayComponent.refreshMap();
  }

  ngAfterViewChecked() {
  }

}
