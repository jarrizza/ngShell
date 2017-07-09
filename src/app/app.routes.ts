import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './common/components/home/home.component';

// SAMPLE Components
import { ChartPageComponent } from './SAMPLE/components/chartPage/chartPage.component';
import { MapPageComponent } from './SAMPLE/components/mapPage/mapPage.component';
import { GridPageComponent } from './SAMPLE/components/gridPage/gridPage.component';

// SDPTN Components
import { PropertyDetailsPageComponent } from './SDPTN/components/propertyDetailsPage/propertyDetailsPage.component';
import { PropertySearchPageComponent } from './SDPTN/components/propertySearchPage/propertySearchPage.component';

// UNPROPS Components


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

  // SAMPLE Routes
  { path: 'map', component: MapPageComponent },
  { path: 'chart', component: ChartPageComponent },
  { path: 'table', component: GridPageComponent },

  // SDPTN Routes
  { path: 'search', component: PropertySearchPageComponent },
  { path: 'details', component: PropertyDetailsPageComponent },

  // UNPROPS Routes

  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
