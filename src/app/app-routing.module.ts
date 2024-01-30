import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { CanActivateGuard } from './services/auth.guard';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { HousingParametersComponent } from './account-edit/house/housing-parameters.component';
import { LookingComponent } from './account-edit/user/looking/looking.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { AboutProjectComponent } from './pages/about-project/about-project.component';
import { OpportunitiesComponent } from './pages/opportunities/opportunities.component';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'user-licence', component: UserLicenceComponent, },
  { path: 'our-team', component: OurTeamComponent},
  { path: 'about-project', component: AboutProjectComponent },
  { path: 'information-user', component: InformationUserComponent, canActivate: [CanActivateGuard] },
  { path: 'looking', component: LookingComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-services', component: HousingServicesComponent, canActivate: [CanActivateGuard] },
  { path: 'housing-parameters', component: HousingParametersComponent, canActivate: [CanActivateGuard] },
  { path: 'discussio', loadChildren: () => import('./discussi/discussio-user/discussio.module').then(m => m.DiscussioModule), canActivate: [CanActivateGuard] },
  { path: 'discussio-house', loadChildren: () => import('./discussi/discussio-house/discussio-house.module').then(m => m.DiscussioHouseModule), canActivate: [CanActivateGuard] },
  { path: 'user', loadChildren: () => import('./account/user/user.module').then(m => m.UserModule), canActivate: [CanActivateGuard] },
  { path: 'house', loadChildren: () => import('./account/house/house.module').then(m => m.HouseModule), canActivate: [CanActivateGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [CanActivateGuard] },
  { path: 'opportunities', component: OpportunitiesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
