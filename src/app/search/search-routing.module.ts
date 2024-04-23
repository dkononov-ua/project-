import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from '../services/auth.guard';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';
import { HouseComponent } from './search-housing/house/house.component';
import { AllCardsComponent } from './search-housing/all-cards/all-cards.component';
import { SearchTermHouseComponent } from './search-housing/search-term-house/search-term-house.component';
import { SearchTermTenantsComponent } from './search-tenant/search-term-tenants/search-term-tenants.component';
import { AllCardsTenantsComponent } from './search-tenant/all-cards-tenants/all-cards-tenants.component';
import { ProfileComponent } from './search-tenant/profile/profile.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'search-tenants', component: SearchTenantComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'filter', pathMatch: 'full' },
      { path: 'tenants', component: ProfileComponent, canActivate: [CanActivateGuard] },
      { path: 'all-cards', component: AllCardsTenantsComponent, canActivate: [CanActivateGuard] },
      { path: 'filter', component: SearchTermTenantsComponent, canActivate: [CanActivateGuard] },
    ]
  },
  {
    path: 'search-house', component: SearchHousingComponent,
    children: [
      { path: '', redirectTo: 'filter', pathMatch: 'full' },
      { path: 'house', component: HouseComponent },
      { path: 'all-cards', component: AllCardsComponent },
      { path: 'filter', component: SearchTermHouseComponent },
    ]
  },
  { path: 'discussio-search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
