import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChartPageComponent } from './components/chartPage/chartPage.component';
import { MapPageComponent } from './components/mapPage/mapPage.component'
import { PropertiesPageComponent } from './components/propertiesPage/propertiesPage.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapPageComponent },
  { path: 'chart', component: ChartPageComponent },
  { path: 'properties', component: PropertiesPageComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
