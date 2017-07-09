// Imports
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
/*
import { NavigatorComponent } from '../mapNavigator/mapNavigator.component';
import { ToolsComponent } from '../mapTools/mapTools.component';
*/
// import { ApiService } from '../../shared/services/api/api.service';
import { MapService } from '../../../../services/map/map.service';
import { GeocodingService } from '../../../../services/map/geocoding.service';

@Component({
  selector: 'map-display',
  templateUrl: './mapDisplay.component.html',
  styleUrls: ['./mapDisplay.component.css'],
  encapsulation: ViewEncapsulation.None
})

// Component class
export class MapDisplayComponent {

  private map;
  private lastLocation;

  constructor(
    // private apiService: ApiService,
    private mapService: MapService,
    private geocoder: GeocodingService,
  ){}


  public refreshMap() {
    console.log('-> REFRESH Map called');
    if (this.mapService.map) {
      this.setCurrentLocation(this, this.lastLocation);
    }
  }

  public setCurrentLocation(self, location) {
      if (self && location) {
        self.lastLocation = location;
        self.map.panTo([location.latitude, location.longitude]);
      }
  }

  ngOnInit() {
    this.map = L.map('map', {
      zoomControl: false,
      center: L.latLng(10, 0),
      zoom: 12,
      minZoom: 2,
      maxZoom: 22,
      layers: [this.mapService.baseMaps.Esri] // [this.mapService.baseMaps.CartoDB] // [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.layers(this.mapService.baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.mapService.map = this.map;

    let self = this;
    this.geocoder.getCurrentLocation()
      .subscribe(
        location => self.setCurrentLocation(self, location), //this.map.panTo([location.latitude, location.longitude]),
        err => console.error(err)
      );
    //    this.toolsComponent.Initialize();

  }

}

/*
 this.geocoder.getCurrentLocation()
 .subscribe(
 location => this.map.panTo([location.latitude, location.longitude]),
 err => console.error(err)
 );
 */
