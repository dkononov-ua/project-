import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HousingSearchComponent } from './housing-search/housing-search.component';
import { TenantsSearchComponent } from './tenants-search/tenants-search.component';

const routes: Routes = [
  {
    path: 'search',  component: SearchComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'housingSearch', pathMatch: 'full' },
      { path: 'housingSearch', component: HousingSearchComponent, canActivate: [CanActivateGuard] },
      { path: 'tenantsSearch', component: TenantsSearchComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: '', redirectTo: 'housingSearch', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
