import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments/payments.component';
import { LesseeComponent } from './registration/lessee/lessee.component';
import { LessorComponent } from './registration/lessor/lessor.component';
import { RegistrationComponent } from './registration/registration.component';
import { EnergyComponent } from './services/energy/energy.component';
import { ServicesComponent } from './services/services.component';
import { WaterComponent } from './services/water/water.component';

const routes: Routes = [
  {path: 'registration' , component: RegistrationComponent},
  {path: '' , redirectTo: 'home' , pathMatch: 'full' },
  {path: 'payments' , component: PaymentsComponent},
  {path: 'services' , component: ServicesComponent},
  {path: 'lessee' , component: LesseeComponent},
  {path: 'lessor' , component: LessorComponent},
  {path: 'energy' , component: EnergyComponent},
  {path: 'water' , component: WaterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
