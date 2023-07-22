import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { UserPaymentComponent } from './pages/user-payment/user-payment.component';
import { CanActivateGuard } from './services/auth.guard';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';
import { HousingParametersComponent } from './account-edit/house/housing-parameters.component';
import { SearchComponent } from './search/search.component';
import { LookingComponent } from './account-edit/user/looking/looking.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'user-licence', component: UserLicenceComponent, },
  { path: 'our-team', component: OurTeamComponent, canActivate: [CanActivateGuard] },
  { path: 'information-user', component: InformationUserComponent, canActivate: [CanActivateGuard] },
  { path: 'looking', component: LookingComponent, canActivate: [CanActivateGuard] },
  { path: 'user-payment', component: UserPaymentComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-services', component: HousingServicesComponent, canActivate: [CanActivateGuard] },
  { path: 'comun-page', component: ComunPageComponent, canActivate: [CanActivateGuard] },
  { path: 'search-page', component: SearchPageComponent, canActivate: [CanActivateGuard] },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule), canActivate: [CanActivateGuard] },
  { path: 'housing-parameters', component: HousingParametersComponent, canActivate: [CanActivateGuard] },
  { path: 'search', component: SearchComponent, canActivate: [CanActivateGuard] },
  { path: 'discussio', loadChildren: () => import('./discussi/discussio-user/discussio.module').then(m => m.DiscussioModule), canActivate: [CanActivateGuard] },
  { path: 'discussio-house', loadChildren: () => import('./discussi/discussio-house/discussio-house.module').then(m => m.DiscussioHouseModule), canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
