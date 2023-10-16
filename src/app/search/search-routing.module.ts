import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { CanActivateGuard } from '../services/auth.guard';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';

const routes: Routes = [
  {
    path: 'search', component: SearchComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house', pathMatch: 'full' },
      { path: 'tenants', component: SearchTenantComponent, canActivate: [CanActivateGuard] },
      { path: 'house', component: SearchHousingComponent, canActivate: [CanActivateGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
