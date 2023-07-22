import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HousingSearchComponent } from './house/housing-search/housing-search.component';
import { TenantsSearchComponent } from './tenant/tenants-search/tenants-search.component';
import { HostHouseComponent } from './house/host-house/host-house.component';
import { HostTenantComponent } from './tenant/host-tenant/host-tenant.component';

const routes: Routes = [
  {
    path: 'search', component: SearchComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'host-house', pathMatch: 'full' },
      {
        path: 'host-house', component: HostHouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'housingSearch', pathMatch: 'full' },
          { path: 'housingSearch', component: HousingSearchComponent, canActivate: [CanActivateGuard] },
        ]
      },
      {
        path: 'host-tenant', component: HostTenantComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'tenantsSearch', pathMatch: 'full' },
          { path: 'tenantsSearch', component: TenantsSearchComponent, canActivate: [CanActivateGuard] },
        ]
      },
    ],

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
