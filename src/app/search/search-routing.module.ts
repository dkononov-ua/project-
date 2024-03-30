import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from '../services/auth.guard';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';
import { HouseComponent } from './search-housing/house/house.component';
import { AllCardsComponent } from './search-housing/all-cards/all-cards.component';
import { SearchTermHouseComponent } from './search-housing/search-term-house/search-term-house.component';

const routes: Routes = [
  { path: 'search-tenants', component: SearchTenantComponent, canActivate: [CanActivateGuard] },
  {
    path: 'search-house', component: SearchHousingComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'filter', pathMatch: 'full' },
      { path: 'house', component: HouseComponent, canActivate: [CanActivateGuard] },
      { path: 'all-cards', component: AllCardsComponent, canActivate: [CanActivateGuard] },
      { path: 'filter', component: SearchTermHouseComponent, canActivate: [CanActivateGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
