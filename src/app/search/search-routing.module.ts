import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HousingSearchComponent } from './house/housing-search/housing-search.component';
import { HostHouseComponent } from './house/host-house/host-house.component';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';

const routes: Routes = [
  {
    path: 'search', component: SearchComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'host-house', pathMatch: 'full' },
      { path: 'tenants', component: SearchTenantComponent, canActivate: [CanActivateGuard] },
      {
        path: 'host-house', component: HostHouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'housing-search', pathMatch: 'full' },
          { path: 'housing-search', component: HousingSearchComponent, canActivate: [CanActivateGuard] },
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
