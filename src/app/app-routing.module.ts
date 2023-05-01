import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { TenantsSearchComponent } from './search/tenants-search/tenants-search.component';
import { HousingSearchComponent } from './search/housing-search/housing-search.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { UserPaymentComponent } from './pages/user-payment/user-payment.component';
import { CanActivateGuard } from './services/auth.guard';
import { ModalComponent } from './pages/modal/modal.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';
import { TestComponent } from './pages/test/test.component';
import { HousingParametersComponent } from './account-edit/house/housing-parameters.component';

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'our-team', component: OurTeamComponent, canActivate: [CanActivateGuard] },
  { path: 'tenants-search', component: TenantsSearchComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-search', component: HousingSearchComponent, canActivate: [CanActivateGuard] },
  { path: 'agreement', component: AgreementComponent, canActivate: [CanActivateGuard] },
  { path: 'information-user', component: InformationUserComponent, canActivate: [CanActivateGuard] },
  { path: 'user-payment', component: UserPaymentComponent, canActivate: [CanActivateGuard] },
  { path: 'modal', component: ModalComponent, canActivate: [CanActivateGuard] },
  { path: 'user-licence', component: UserLicenceComponent, },
  { path: 'housing-services', component: HousingServicesComponent, canActivate: [CanActivateGuard] },
  { path: 'comun-page', component: ComunPageComponent, canActivate: [CanActivateGuard] },
  { path: 'test', component: TestComponent, canActivate: [CanActivateGuard] },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'housing-parameters', component: HousingParametersComponent, canActivate: [CanActivateGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
