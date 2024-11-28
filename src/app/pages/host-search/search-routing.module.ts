import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTenantComponent } from './host-search-tenant/search-tenant.component';
import { SearchHousingComponent } from './host-search-house/search-housing.component';
import { KyivComponent } from '../host-city/kyiv/kyiv/kyiv.component';
import { HostCityComponent } from '../host-city/host-city.component';

const routes: Routes = [
  {
    path: 'tenant', component: SearchTenantComponent,
  },
  {
    path: 'tenant/:city', component: SearchTenantComponent,
  },
  {
    path: 'page', component: HostCityComponent,
    children: [
      { path: '', redirectTo: 'kyiv', pathMatch: 'full' },
      { path: ':city', component: HostCityComponent },
      { path: 'kyiv', component: KyivComponent },
    ],
  },
  {
    path: 'house', component: SearchHousingComponent,
  },
  {
    path: 'house/:city', component: SearchHousingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
