import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurTeamComponent } from './our-team/our-team.component';
import { InformationUserComponent } from './registration/information-user/information-user.component';
import { RegistrationComponent } from './registration/registration.component';
import { TenantsSearchComponent } from './interaction/tenants-search/tenants-search.component';
import { HousingSearchComponent } from './interaction/housing-search/housing-search.component';
import { AgreementComponent } from './interaction/agreement/agreement.component';
import { HomeAccountComponent } from './interaction/home-account/home-account.component';
import { UserInteractionComponent } from './interaction/user-interaction/user-interaction.component';
import { UserPaymentComponent } from './registration/user-payment/user-payment.component';
import { CanActivateGuard } from './shared/auth.guard';
import { ModalComponent } from './pages/modal/modal.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'our-team', component: OurTeamComponent, canActivate: [CanActivateGuard] },
  { path: 'tenants-search', component: TenantsSearchComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-search', component: HousingSearchComponent, canActivate: [CanActivateGuard] },
  { path: 'agreement', component: AgreementComponent, canActivate: [CanActivateGuard] },
  { path: 'home-account', component: HomeAccountComponent, canActivate: [CanActivateGuard] },
  { path: 'user-interaction', component: UserInteractionComponent, canActivate: [CanActivateGuard] },
  { path: 'information-user', component: InformationUserComponent },
  { path: 'user-payment', component: UserPaymentComponent },
  { path: 'modal', component: ModalComponent },
  { path: 'user-licence', component: UserLicenceComponent },
  { path: 'housing-services', component: HousingServicesComponent },
  { path: 'comun-page', component: ComunPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
