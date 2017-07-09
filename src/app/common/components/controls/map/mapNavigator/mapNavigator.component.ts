import {Component, OnInit} from '@angular/core';
import {GeocodingService} from '../../../../services/map/geocoding.service';
import {MapService} from '../../../../services/map/map.service';
// import {Location} from '../../../../location.class';
import {Map} from 'leaflet';

@Component({
  selector: 'map-navigator',
  templateUrl: './mapNavigator.component.html',
  styleUrls: ['./mapNavigator.component.css'],
  providers: []
})
export class MapNavigatorComponent implements OnInit {
  address: string;

  private map: Map;

  constructor(private geocoder: GeocodingService, private mapService: MapService) {
    this.address = '';
  }

  ngOnInit() {
   // this.mapService.disableMouseEvent('goto');
    this.mapService.disableMouseEvent('place-input');
    this.map = this.mapService.map;
  }

  goto() {
    if (!this.address) { return; }

    this.geocoder.geocode(this.address)
      .subscribe(location => {
        this.map.fitBounds(location.viewBounds, {});
        this.address = location.address;
      }, error => console.error(error));
  }
}

