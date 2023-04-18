import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostComunComponent } from './host-comun/host-comun.component';
import { HousingServicesComponent } from './housing-services.component';
import { CanActivateGuard } from './../services/auth.guard';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ServiceProfileComponent } from './service-profile/service-profile.component';
import { DetailsComponent } from './details/details.component';
import { EngCabinetComponent } from './eng-cabinet/eng-cabinet.component';
import { ComunCompanyComponent } from './comun-company/comun-company.component';

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
          {
            path: 'comun-company', component: ComunCompanyComponent, canActivate: [CanActivateGuard],
            children: [
              { path: '', redirectTo: 'eng-cabinet', pathMatch: 'full' },
              { path: 'service-profile', component: ServiceProfileComponent, data: { animation: 'service-profile' }, canActivate: [CanActivateGuard] },
              { path: 'details', component: DetailsComponent, data: { animation: 'details' }, canActivate: [CanActivateGuard] },
              { path: 'eng-cabinet', component: EngCabinetComponent, data: { animation: 'eng-cabinet' }, canActivate: [CanActivateGuard] },
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
