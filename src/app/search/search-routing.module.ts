import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'search-tenants', component: SearchTenantComponent,
  },
  {
    path: 'search-house', component: SearchHousingComponent,
  },
  {
    path: 'discussio-search', component: SearchComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
