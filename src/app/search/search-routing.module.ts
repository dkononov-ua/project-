import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { CanActivateGuard } from '../services/auth.guard';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'search-tenants', component: SearchTenantComponent, canActivate: [CanActivateGuard] },
  { path: 'search-house', component: SearchHousingComponent, canActivate: [CanActivateGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
