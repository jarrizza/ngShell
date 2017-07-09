import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './common/components/home/home.component';

// UNPROPS Components
import { FilterPageComponent } from './UNPROPS/components/filterPage/filterPage.component';
import { ProjectPageComponent } from './UNPROPS/components/projectPage/projectPage.component';


const appRoutes: Routes = [
  { path: '', component: FilterPageComponent },

  // UNPROPS Routes
  { path: 'filter', component: FilterPageComponent },
  { path: 'project', component: ProjectPageComponent },


  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
