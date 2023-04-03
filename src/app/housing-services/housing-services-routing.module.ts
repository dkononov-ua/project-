import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CleaningComponent } from './cleaning/cleaning.component';
import { EnergyComponent } from './energy/energy.component';
import { GasComponent } from './gas/gas.component';
import { HostComunComponent } from './host-comun/host-comun.component';
import { HousingServicesComponent } from './housing-services.component';
import { InternetComponent } from './internet/internet.component';
import { WaterComponent } from './water/water.component';
import { CanActivateGuard } from './../services/auth.guard';
import { PaymentHistoryComponent } from './energy/payment-history/payment-history.component';
import { ServiceProfileComponent } from './energy/service-profile/service-profile.component';
import { DetailsComponent } from './energy/details/details.component';

const routes: Routes = [
  {
    path: 'housing-services',
    component: HousingServicesComponent, canActivate: [CanActivateGuard],
    children: [
      {
        path: 'host-comun',
        component: HostComunComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'energy', pathMatch: 'full' },
          { path: 'cleaning', component: CleaningComponent, canActivate: [CanActivateGuard] },
          { path: 'energy', component: EnergyComponent, canActivate: [CanActivateGuard] },
          { path: 'gas', component: GasComponent, canActivate: [CanActivateGuard] },
          { path: 'internet', component: InternetComponent, canActivate: [CanActivateGuard] },
          { path: 'water', component: WaterComponent, canActivate: [CanActivateGuard] },
          { path: 'payment-history', component: PaymentHistoryComponent, canActivate: [CanActivateGuard] },
          { path: 'service-profile', component: ServiceProfileComponent, canActivate: [CanActivateGuard] },
          { path: 'details', component: DetailsComponent, canActivate: [CanActivateGuard] },
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
