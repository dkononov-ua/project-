import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './services/auth.guard';
import { AboutProjectComponent } from './pages/host/about-project/about-project.component';
import { AppComponent } from './app.component';
import { FeedbackComponent } from './pages/host/feedback/feedback.component';
import { OurTeamComponent } from './pages/host/our-team/our-team.component';
import { SupportUsComponent } from './pages/host/support-us/support-us.component';
import { UserLicenceComponent } from './pages/host/user-licence/user-licence.component';
import { PostDetailComponent } from './pages/host/blog/post-detail/post-detail.component';
import { PostsComponent } from './pages/host/blog/posts/posts.component';
import { RentalAgreementComponent } from './components/agreements/rental-agreement/rental-agreement.component';
import { ActTransferComponent } from './components/agreements/act-transfer/act-transfer.component';
import { HomeComponent } from './pages/host/home/home.component';
import { NotFoundComponent } from './pages/host/not-found/not-found.component';
import { ProjectContactsComponent } from './pages/host/project-contacts/project-contacts.component';
import { FaqComponent } from './pages/host/faq/faq.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'home', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./pages/host-auth/auth-routing.module').then(m => m.AuthRoutingModule) },
  { path: 'user', loadChildren: () => import('./pages/host-user/user-routing.module').then(m => m.UserRoutingModule), },
  { path: 'house', loadChildren: () => import('./pages/host-house/house-routing.module').then(m => m.HouseRoutingModule), },
  { path: 'search', loadChildren: () => import('./pages/host-search/search-routing.module').then(m => m.SearchRoutingModule), },
  { path: 'feedback', component: FeedbackComponent, canActivate: [CanActivateGuard] },
  { path: 'rental-agree', component: RentalAgreementComponent, canActivate: [CanActivateGuard] },
  { path: 'act-transfer', component: ActTransferComponent, canActivate: [CanActivateGuard] },
  { path: 'blog', component: PostsComponent },
  { path: 'contacts', component: ProjectContactsComponent },
  { path: 'support-us', component: SupportUsComponent },
  { path: 'about-project', component: AboutProjectComponent },
  { path: 'our-team', component: OurTeamComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'user-licence', component: UserLicenceComponent },
  { path: 'blog/:title', component: PostDetailComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
