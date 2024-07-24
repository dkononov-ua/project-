import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTenantComponent } from './search-tenant/search-tenant.component';
import { SearchHousingComponent } from './search-housing/search-housing.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'search-tenants', component: SearchTenantComponent, data: { title: 'Пошук орендарів, сусідів', description: 'Знайти орендаря обо сусіда легко з Discussio.'} },
  { path: 'search-house', component: SearchHousingComponent, data: { title: 'Пошук осель, квартир, будинків, кімнат', description: 'Знайдіть собі нове житло за вашими вподобаннями.'} },
  { path: 'discussio-search', component: SearchComponent, data: { title: 'Пошук житла. Оренда осель. Пошук орендарів. Пошук квартири', description: 'Знайти оселю вам допоможе Discussio пошук. Знайти орендарів для своєї оселі яку здаєте.'} },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
