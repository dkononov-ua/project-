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
import { LookingComponent } from './account-edit/user/looking/looking.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { AboutProjectComponent } from './pages/about-project/about-project.component';
import { AboutRatingComponent } from './pages/about-rating/about-rating.component';
import { OpportunitiesComponent } from './pages/opportunities/opportunities.component';
import { AccessibleAllComponent } from './pages/accessible-all/accessible-all.component';

const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'user-licence', component: UserLicenceComponent, },
  { path: 'our-team', component: OurTeamComponent},
  { path: 'about-project', component: AboutProjectComponent },
  { path: 'information-user', component: InformationUserComponent, canActivate: [CanActivateGuard] },
  { path: 'looking', component: LookingComponent, canActivate: [CanActivateGuard] },
  { path: 'user-payment', component: UserPaymentComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-services', component: HousingServicesComponent, canActivate: [CanActivateGuard] },
  { path: 'comun-page', component: ComunPageComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-parameters', component: HousingParametersComponent, canActivate: [CanActivateGuard] },
  { path: 'discussio', loadChildren: () => import('./discussi/discussio-user/discussio.module').then(m => m.DiscussioModule), canActivate: [CanActivateGuard] },
  { path: 'discussio-house', loadChildren: () => import('./discussi/discussio-house/discussio-house.module').then(m => m.DiscussioHouseModule), canActivate: [CanActivateGuard] },
  { path: 'user', loadChildren: () => import('./account/user/user.module').then(m => m.UserModule), canActivate: [CanActivateGuard] },
  { path: 'house', loadChildren: () => import('./account/house/house.module').then(m => m.HouseModule), canActivate: [CanActivateGuard] },
  // { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule), canActivate: [CanActivateGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [CanActivateGuard] },
  { path: 'rating', component: AboutRatingComponent, canActivate: [CanActivateGuard] },
  { path: 'opportunities', component: OpportunitiesComponent, canActivate: [CanActivateGuard] },
  { path: 'accessible', component: AccessibleAllComponent }, // Інформація для всіх по функціоналу
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
