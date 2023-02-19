import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAccountComponent } from './payments/home-account/home-account.component';
import { PaymentsComponent } from './payments/payments.component';
import { RegistrationComponent } from './registration/registration.component';
import { CleaningComponent } from './services/cleaning/cleaning.component';
import { EnergyComponent } from './services/energy/energy.component';
import { GasComponent } from './services/gas/gas.component';
import { InternetComponent } from './services/internet/internet.component';
import { ServicesComponent } from './services/services.component';
import { WaterComponent } from './services/water/water.component';

const routes: Routes = [
  {path: 'registration' , component: RegistrationComponent},
  {path: '' , redirectTo: 'payments' , pathMatch: 'full' },
  {path: 'payments' , component: PaymentsComponent},
  {path: 'services' , component: ServicesComponent},
  {path: 'energy' , component: EnergyComponent},
  {path: 'water' , component: WaterComponent},
  {path: 'cleaning' , component: CleaningComponent},
  {path: 'gas' , component: GasComponent},
  {path: 'internet' , component: InternetComponent},
  {path: 'home-account' , component: HomeAccountComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
