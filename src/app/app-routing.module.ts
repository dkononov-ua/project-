import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { CanActivateGuard } from './services/auth.guard';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';
import { HousingParametersComponent } from './account-edit/house/housing-parameters.component';
import { LookingComponent } from './account-edit/user/looking/looking.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { RentalAgreementComponent } from './agreements/rental-agreement/rental-agreement.component';
import { ActTransferComponent } from './agreements/act-transfer/act-transfer.component';
import { ActCreateComponent } from './account/house/agree-h/act-create/act-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'home/update', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home-routing.module').then(m => m.HomeRoutingModule) },
  { path: 'user-licence', component: UserLicenceComponent, },
  { path: 'information-user', component: InformationUserComponent, canActivate: [CanActivateGuard] },
  { path: 'looking', component: LookingComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-services', component: HousingServicesComponent, canActivate: [CanActivateGuard] },
  { path: 'comun-page', component: ComunPageComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-parameters', component: HousingParametersComponent, canActivate: [CanActivateGuard] },
  { path: 'discus', loadChildren: () => import('./discussi/discussio-user/discussio.module').then(m => m.DiscussioModule), canActivate: [CanActivateGuard] },
  { path: 'discussio-house', loadChildren: () => import('./discussi/discussio-house/discussio-house.module').then(m => m.DiscussioHouseModule), canActivate: [CanActivateGuard] },
  { path: 'user', loadChildren: () => import('./account/user/user.module').then(m => m.UserModule), canActivate: [CanActivateGuard] },
  { path: 'house', loadChildren: () => import('./account/house/house.module').then(m => m.HouseModule), canActivate: [CanActivateGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [CanActivateGuard] },
  { path: 'rental-agree', component: RentalAgreementComponent, canActivate: [CanActivateGuard]},
  { path: 'act-transfer', component: ActTransferComponent, canActivate: [CanActivateGuard]},
  { path: 'act-create/:selectedFlatAgree', component: ActCreateComponent, canActivate: [CanActivateGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
