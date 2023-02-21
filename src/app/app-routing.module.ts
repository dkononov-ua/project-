import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurTeamComponent } from './our-team/our-team.component';
import { HomeAccountComponent } from './payments/home-account/home-account.component';
import { PaymentsComponent } from './payments/payments.component';
import { InformationHousingComponent } from './registration/information-housing/information-housing.component';
import { RegistrationComponent } from './registration/registration.component';
import { CleaningComponent } from './services/cleaning/cleaning.component';
import { EnergyComponent } from './services/energy/energy.component';
import { GasComponent } from './services/gas/gas.component';
import { InternetComponent } from './services/internet/internet.component';
import { ServicesComponent } from './services/services.component';
import { WaterComponent } from './services/water/water.component';
import { TestComponent } from './style/test/test.component';

const routes: Routes = [
  {path: '' , redirectTo: 'registration' , pathMatch: 'full' },
  {path: 'registration' , component: RegistrationComponent},
  {path: 'payments' , component: PaymentsComponent},
  {path: 'services' , component: ServicesComponent},
  {path: 'energy' , component: EnergyComponent},
  {path: 'water' , component: WaterComponent},
  {path: 'cleaning' , component: CleaningComponent},
  {path: 'gas' , component: GasComponent},
  {path: 'internet' , component: InternetComponent},
  {path: 'home-account' , component: HomeAccountComponent},
  {path: 'our-team' , component: OurTeamComponent},
  {path: 'information-housing' , component: InformationHousingComponent},
  {path: 'test' , component: TestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
