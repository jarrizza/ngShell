import 'leaflet';
import 'leaflet.vectorgrid';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'reflect-metadata';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

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

import { CollapsePanelComponent } from './common/components/controls/collapsePanel/collapsePanel.component';
import { ModalConfirmComponent } from './common/components/controls/modalConfirm/modalConfirm.component';
import { MultiSelectFilterComponent } from './common/components/controls/multiSelectFilter/multiSelectFilter.component';
import { RangeSliderComponent } from './common/components/controls/rangeSlider/rangeSlider.component';

import { C3PieChartComponent } from './common/components/controls/charts/c3piechart/c3piechart.component';

import { StdGridComponent } from './common/components/controls/grid/stdGrid/stdGrid.component';
import { DateEditorComponent } from './common/components/controls/grid/cellEditors/dateEditor.component';
import { DeleteEditorComponent } from './common/components/controls/grid/cellEditors/deleteEditor.component';
import { ToggleEditorComponent } from './common/components/controls/grid/cellEditors/toggleEditor.component';
import { YNButtonEditorComponent } from './common/components/controls/grid/cellEditors/ynbuttonEditor.component';

import { MapDisplayComponent } from './common/components/controls/map/mapDisplay/mapDisplay.component';
import { MapNavigatorComponent } from './common/components/controls/map/mapNavigator/mapNavigator.component';
import { MapToolsComponent } from './common/components/controls/map/mapTools/mapTools.component';

import { AppComponent } from './app.component';
import { APIStateComponent } from './common/components/apiState/apiState.component';
import { HeaderComponent } from './common/components/header/header.component';
import { NavBarComponent } from './common/components/navbar/navbar.component';
import { HomeComponent } from './common/components/home/home.component';

import { routing, appRoutingProviders } from './app.routes';

import { ApiService } from './common/services/api/api.service';
import { GridService } from './common/services/grid/grid.service';
import { LocalStorageService } from './common/services/localStorage.service';
import { MapService } from './common/services/map/map.service';
import { GeocodingService } from './common/services/map/geocoding.service';

/****** UNPROPS-specific */
import { FilterPageComponent } from './UNPROPS/components/filterPage/filterPage.component';
import { ProjectPageComponent } from './UNPROPS/components/projectPage/projectPage.component';

export class CustomOption extends ToastOptions {
  positionClass: 'toast-bottom-right';
  toastLife: 4500;
  animate: 'fade';
}

@NgModule({
  declarations: [

    // C3 components
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

    // map components
    MapDisplayComponent,
    MapNavigatorComponent,
    MapToolsComponent,

    //UNPROPS-Specific Pages/Components
    FilterPageComponent,
    ProjectPageComponent

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
    appRoutingProviders,
    { provide: ToastOptions, useClass: CustomOption },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
