import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTenantComponent } from './host-search-tenant/search-tenant.component';
import { SearchHousingComponent } from './host-search-house/search-housing.component';

const routes: Routes = [
  {
    path: 'tenant', component: SearchTenantComponent,
  },
  {
    path: 'house', component: SearchHousingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
