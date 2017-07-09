import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './common/components/home/home.component';

// SDPTN Components
import { PropertyDetailsPageComponent } from './SDPTN/components/propertyDetailsPage/propertyDetailsPage.component';
import { PropertySearchPageComponent } from './SDPTN/components/propertySearchPage/propertySearchPage.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

  // SDPTN Routes
  { path: 'search', component: PropertySearchPageComponent },
  { path: 'details', component: PropertyDetailsPageComponent },

  // UNPROPS Routes

  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
