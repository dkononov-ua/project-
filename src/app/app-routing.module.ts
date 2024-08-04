import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './services/auth.guard';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { HousingParametersComponent } from './account-edit/house/housing-parameters.component';
import { LookingComponent } from './account-edit/user/looking/looking.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { RentalAgreementComponent } from './agreements/rental-agreement/rental-agreement.component';
import { ActTransferComponent } from './agreements/act-transfer/act-transfer.component';
import { ActCreateComponent } from './account/house/agree-h/act-create/act-create.component';
import { PostsComponent } from './pages/posts/posts.component';
import { SupportUsComponent } from './pages/support-us/support-us.component';
import { AboutProjectComponent } from './pages/about-project/about-project.component';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { HomeComponent } from './pages/home/home.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  { path: 'auth', loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule) },
  {
    path: 'looking',
    component: LookingComponent,
  },
  {
    path: 'housing-services',
    component: HousingServicesComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'housing-parameters',
    component: HousingParametersComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'discussio-house',
    loadChildren: () => import('./discussi/discussio-house/discussio-house.module').then(m => m.DiscussioHouseModule),
    canActivate: [CanActivateGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/host-user/user.module').then(m => m.UserModule),
  },
  {
    path: 'house',
    loadChildren: () => import('./account/house/house.module').then(m => m.HouseModule),
    canActivate: [CanActivateGuard]
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'rental-agree',
    component: RentalAgreementComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'act-transfer',
    component: ActTransferComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'act-create/:selectedFlatAgree',
    component: ActCreateComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'blog',
    component: PostsComponent
  },
  {
    path: 'support-us',
    component: SupportUsComponent
  },
  {
    path: 'about-project',
    component: AboutProjectComponent
  },
  {
    path: 'about-project',
    component: AboutProjectComponent
  },
  {
    path: 'our-team',
    component: OurTeamComponent
  },
  {
    path: 'user-licence',
    component: UserLicenceComponent
  },
  {
    path: 'blog/:title',
    component: PostDetailComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
