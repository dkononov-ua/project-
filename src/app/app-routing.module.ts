import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurTeamComponent } from './our-team/our-team.component';
import { PaymentsComponent } from './payments/payments.component';
import { InformationHousingComponent } from './registration/information-housing/information-housing.component';
import { InformationUserComponent } from './registration/information-user/information-user.component';
import { RegistrationComponent } from './registration/registration.component';
import { CleaningComponent } from './services/cleaning/cleaning.component';
import { EnergyComponent } from './services/energy/energy.component';
import { GasComponent } from './services/gas/gas.component';
import { InternetComponent } from './services/internet/internet.component';
import { ServicesComponent } from './services/services.component';
import { WaterComponent } from './services/water/water.component';
import { TenantsSearchComponent } from './interaction/tenants-search/tenants-search.component';
import { HousingSearchComponent } from './interaction/housing-search/housing-search.component';
import { AgreementComponent } from './interaction/agreement/agreement.component';
import { HomeAccountComponent } from './interaction/home-account/home-account.component';
import { UserInteractionComponent } from './interaction/user-interaction/user-interaction.component';
import { UserPaymentComponent } from './registration/user-payment/user-payment.component';
import { CanActivateGuard } from './shared/auth.guard';
import { RegistrationMobComponent } from './registration/registration-mob/registration-mob.component';
import { ModalComponent } from './modal/modal.component';

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent  },
  { path: 'payments', component: PaymentsComponent, canActivate: [CanActivateGuard]  },
  { path: 'services', component: ServicesComponent, canActivate: [CanActivateGuard] },
  { path: 'energy', component: EnergyComponent, canActivate: [CanActivateGuard] },
  { path: 'water', component: WaterComponent, canActivate: [CanActivateGuard] },
  { path: 'cleaning', component: CleaningComponent, canActivate: [CanActivateGuard] },
  { path: 'gas', component: GasComponent, canActivate: [CanActivateGuard] },
  { path: 'internet', component: InternetComponent, canActivate: [CanActivateGuard] },
  { path: 'our-team', component: OurTeamComponent, canActivate: [CanActivateGuard] },
  { path: 'information-housing', component: InformationHousingComponent, canActivate: [CanActivateGuard] },
  { path: 'tenants-search', component: TenantsSearchComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-search', component: HousingSearchComponent, canActivate: [CanActivateGuard] },
  { path: 'agreement', component: AgreementComponent, canActivate: [CanActivateGuard] },
  { path: 'home-account', component: HomeAccountComponent, canActivate: [CanActivateGuard] },
  { path: 'user-interaction', component: UserInteractionComponent, canActivate: [CanActivateGuard] },

  { path: 'information-user', component: InformationUserComponent },
  { path: 'user-payment', component: UserPaymentComponent },
  { path: 'modal', component: ModalComponent },
  { path: 'registration-mob', component: RegistrationMobComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
