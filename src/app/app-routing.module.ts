import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './services/auth.guard';
import { HousingServicesComponent } from './housing-services/housing-services.component';
import { LookingComponent } from './pages/host-user/host-user-edit/looking/looking.component';
import { ActCreateComponent } from './pages/host-house/host-house-agree/act-create/act-create.component';
import { AboutProjectComponent } from './pages/host/about-project/about-project.component';
import { AppComponent } from './app.component';
import { FeedbackComponent } from './pages/host/feedback/feedback.component';
import { OurTeamComponent } from './pages/host/our-team/our-team.component';
import { SupportUsComponent } from './pages/host/support-us/support-us.component';
import { UserLicenceComponent } from './pages/host/user-licence/user-licence.component';
import { PostDetailComponent } from './pages/blog/post-detail/post-detail.component';
import { PostsComponent } from './pages/blog/posts/posts.component';
import { RentalAgreementComponent } from './components/agreements/rental-agreement/rental-agreement.component';
import { ActTransferComponent } from './components/agreements/act-transfer/act-transfer.component';
import { HomeComponent } from './pages/host/home/home.component';
import { NotFoundComponent } from './pages/host/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/host-auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/host-user/user-routing.module').then(m => m.UserRoutingModule),
  },
  {
    path: 'house',
    loadChildren: () => import('./pages/host-house/house-routing.module').then(m => m.HouseRoutingModule),
    canActivate: [CanActivateGuard]
  },
  {
    path: 'housing-services',
    loadChildren: () => import('./housing-services/housing-services-routing.module').then(m => m.HousingServicesRoutingModule),
    canActivate: [CanActivateGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search-routing.module').then(m => m.SearchRoutingModule),
  },
  {
    path: 'looking',
    component: LookingComponent,
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
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
