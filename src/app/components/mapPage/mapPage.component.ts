import { Component, OnInit, ViewChild } from '@angular/core';

import { MapDisplayComponent } from '../map/mapDisplay/mapDisplay.component';
import { MapNavigatorComponent } from '../map/mapNavigator/mapNavigator.component';

@Component({
  selector: 'app-map-page',
  templateUrl: './mapPage.component.html',
  styleUrls: ['./mapPage.component.css']
})

export class MapPageComponent implements OnInit {


  @ViewChild(MapDisplayComponent) displayComponent: MapDisplayComponent;

  constructor() {}

  ngOnInit() {
    console.log('ONINIT on mapPage called');
    this.displayComponent.refreshMap();
  }

}
