import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostComunComponent } from './host-comun/host-comun.component';
import { HousingServicesComponent } from './housing-services.component';
import { CanActivateGuard } from './../services/auth.guard';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ComunCompanyComponent } from './comun-company/comun-company.component';
import { ComunStatisticsComponent } from './comun-statistics/comun-statistics.component';
import { ComunStatAllComponent } from './comun-stat-all/comun-stat-all.component';

const routes: Routes = [
  {
    path: 'housing-services',
    component: HousingServicesComponent, canActivate: [CanActivateGuard],
    children: [
      {
        path: 'host-comun',
        component: HostComunComponent, canActivate: [CanActivateGuard],

        children: [
          { path: '', redirectTo: 'comun-company', pathMatch: 'full' },
          { path: 'payment-history', component: PaymentHistoryComponent, data: { animation: 'payment-history' }, canActivate: [CanActivateGuard] },
          { path: 'comun-statistics', component: ComunStatisticsComponent, data: { animation: 'comun-statistics' }, canActivate: [CanActivateGuard] },
          { path: 'comun-statistics-all', component: ComunStatAllComponent, data: { animation: 'comun-statistics-all' }, canActivate: [CanActivateGuard] },
          {
            path: 'comun-company', component: ComunCompanyComponent, canActivate: [CanActivateGuard],
            children: [
              { path: '', redirectTo: 'eng-cabinet', pathMatch: 'full' },
            ]
          },
        ]
      },
      { path: '', redirectTo: 'host-comun', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingServicesRoutingModule { }
