import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportUsComponent } from '../pages/support-us/support-us.component';
import { HomeComponent } from './home.component';
import { AboutProjectComponent } from '../pages/about-project/about-project.component';
import { OpportunitiesComponent } from '../pages/opportunities/opportunities.component';
import { OurTeamComponent } from '../pages/our-team/our-team.component';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { UserLicenceComponent } from '../pages/user-licence/user-licence.component';
import { RegistrationComponent } from '../pages/registration/registration.component';
import { FeedbackComponent } from '../pages/feedback/feedback.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'about-project', pathMatch: 'full' },
      { path: 'home-page', component: HomePageComponent },
      { path: 'support-us', component: SupportUsComponent },
      { path: 'home', component: HomeComponent },
      { path: 'about-project', component: AboutProjectComponent },
      { path: 'opportunities', component: OpportunitiesComponent},
      { path: 'our-team', component: OurTeamComponent },
      { path: 'user-licence', component: UserLicenceComponent, },
      { path: 'registration', component: RegistrationComponent },
      { path: 'feedback', component: FeedbackComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
