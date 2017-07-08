import 'leaflet';
import 'leaflet.vectorgrid';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'reflect-metadata';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
// import 'leaflet/dist/leaflet.css';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { AgGridModule } from 'ag-grid-angular/main';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { CollapsePanelComponent } from './components/controls/collapsePanel/collapsePanel.component';
import { ModalConfirmComponent } from './components/controls/modalConfirm/modalConfirm.component';
import { MultiSelectFilterComponent } from './components/controls/multiSelectFilter/multiSelectFilter.component';
import { RangeSliderComponent } from './components/controls/rangeSlider/rangeSlider.component';

import { EventLineComponent } from './components/eventLine/eventLine.component';
import { OwnerPiesComponent } from './components/ownerPies/ownerPies.component';
import { C3PieChartComponent } from './components/charts/c3/c3piechart/c3piechart.component';

import { StdGridComponent } from './components/grid/stdGrid/stdGrid.component';
import { DateEditorComponent } from './components/grid/cellEditors/dateEditor.component';
import { DeleteEditorComponent } from './components/grid/cellEditors/deleteEditor.component';
import { ToggleEditorComponent } from './components/grid/cellEditors/toggleEditor.component';
import { YNButtonEditorComponent } from './components/grid/cellEditors/ynbuttonEditor.component';

import { MapPageComponent } from './components/mapPage/mapPage.component';
import { MapDisplayComponent } from './components/map/mapDisplay/mapDisplay.component';
import { MapNavigatorComponent } from './components/map/mapNavigator/mapNavigator.component';
import { MapToolsComponent } from './components/map/mapTools/mapTools.component';

import { AppComponent } from './app.component';
import { APIStateComponent } from './components/apiState/apiState.component';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';

import { ChartPageComponent } from './components/chartPage/chartPage.component';
import { PropertiesPageComponent } from './components/propertiesPage/propertiesPage.component';

import { routing, appRoutingProviders } from './app.routes';

import { ApiService } from './shared/services/api/api.service';
import { GridService } from './shared/services/grid/grid.service';
import { LocalStorageService } from './shared/services/common/localStorage.service';
import { MapService } from './shared/services/map/map.service';
import { GeocodingService } from './shared/services/map/geocoding.service';

import { PropertyRecordService } from './shared/services/appRecords/propertyRecord.service';

export class CustomOption extends ToastOptions {
  positionClass: 'toast-bottom-right';
  toastLife: 4500;
  animate: 'fade';
}

@NgModule({
  declarations: [
    // Special app controls
    EventLineComponent,
    OwnerPiesComponent,

    // C3 custom components
    C3PieChartComponent,

    // Ag Grid Custom Components
    StdGridComponent,
    DateEditorComponent,
    DeleteEditorComponent,
    ToggleEditorComponent,
    YNButtonEditorComponent,

    // Common Controls
    CollapsePanelComponent,
    ModalConfirmComponent,
    MultiSelectFilterComponent,
    RangeSliderComponent,

    // Standard App Parts
    AppComponent,
    APIStateComponent,
    HeaderComponent,
    NavBarComponent,
    HomeComponent,

    // App-Specific Pages/Components
    ChartPageComponent,
    PropertiesPageComponent,

    // map components
    MapPageComponent,
    MapDisplayComponent,
    MapNavigatorComponent,
    MapToolsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AgGridModule.withComponents([
      DateEditorComponent,
      DeleteEditorComponent,
      ToggleEditorComponent,
      YNButtonEditorComponent
    ]),
    BsDropdownModule.forRoot(),
    ToastModule.forRoot(),
    CollapseModule.forRoot(),
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    routing
  ],
  providers: [
    ApiService,
    MapService,
    GeocodingService,
    GridService,
    LocalStorageService,
    PropertyRecordService,
    appRoutingProviders,
    { provide: ToastOptions, useClass: CustomOption }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
