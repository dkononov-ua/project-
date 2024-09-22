import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { UserComponent } from './user.component';
import { UserContactsComponent } from 'src/app/pages/host-user/host-user-edit/user-contacts/user-contacts.component';
import { UserPersonComponent } from 'src/app/pages/host-user/host-user-edit/user-person/user-person.component';
import { UserStatusComponent } from 'src/app/pages/host-user/host-user-edit/user-status/user-status.component';
import { UserLookingComponent } from 'src/app/pages/host-user/host-user-edit/user-looking/user-looking.component';
import { UserDeleteComponent } from 'src/app/pages/host-user/host-user-edit/user-delete/user-delete.component';
import { UserTenantComponent } from './host-user-tenants-profile/user-tenant/user-tenant.component';
import { SearchHousePageComponent } from 'src/app/pages/host-user/host-user-serach/search-house-page/search-house-page.component';
import { AgreeUserPageComponent } from 'src/app/pages/host-user/host-user-agree/agree-user-page/agree-user-page.component';
import { HostUserDiscusComponent } from 'src/app/pages/host-user/host-user-discus/host-user-discus.component';
import { UserTenantStepComponent } from 'src/app/pages/host-user/host-user-tenants-profile/user-tenant-step/user-tenant-step.component';
import { AgreeUserConcludedComponent } from 'src/app/pages/host-user/host-user-agree/agree-user-concluded/agree-user-concluded.component';
import { AgreeUserReviewComponent } from 'src/app/pages/host-user/host-user-agree/agree-user-review/agree-user-review.component';
import { AgreeUserStepComponent } from 'src/app/pages/host-user/host-user-agree/agree-user-step/agree-user-step.component';
import { UserDiscussPageComponent } from './host-user-discus/user-discuss-page/user-discuss-page.component';
import { SearchUserHostComponent } from './host-user-serach/search-user-host.component';
import { HostUserAgreeComponent } from './host-user-agree/host-user-agree.component';
import { HostUserPageComponent } from './host-user-page/host-user-page.component';
import { HostUserTenantsProfileComponent } from './host-user-tenants-profile/host-user-tenants-profile.component';
import { NotFoundComponent } from '../host/not-found/not-found.component';
import { SubscribersDiscusComponent } from './host-user-discus/discus/subscribers-discus.component';
import { SubscribersUserComponent } from './host-user-discus/subscribers/subscribers-user.component';
import { SubscriptionsUserComponent } from './host-user-discus/subscriptions/subscriptions-user.component';
import { ChatHostComponent } from './host-user-chat/chat-host.component';
import { UserParametersComponent } from './host-user-edit/user-parameters.component';
import { UserTenantProfileComponent } from './host-user-edit/user-tenant-profile/user-tenant-profile.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: HostUserPageComponent, data: { title: 'Профіль користувача', description: 'Профіль користувача' } },
      { path: 'chat', component: ChatHostComponent, canActivate: [CanActivateGuard] },
      {
        path: 'tenant', component: HostUserTenantsProfileComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: UserTenantComponent },
          { path: 'step', component: UserTenantStepComponent },
          { path: 'profile', component: UserTenantProfileComponent },
        ],
      },
      {
        path: 'discus', component: HostUserDiscusComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: UserDiscussPageComponent },
          { path: 'discussion', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribers', component: SubscribersUserComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsUserComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'search', component: SearchUserHostComponent,
        children: [
          { path: '', redirectTo: 'house', pathMatch: 'full' },
          { path: 'house', component: SearchHousePageComponent },
        ],
      },
      {
        path: 'agree', component: HostUserAgreeComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: AgreeUserPageComponent },
          { path: 'step', component: AgreeUserStepComponent },
          { path: 'review', component: AgreeUserReviewComponent, canActivate: [CanActivateGuard] },
          { path: 'concluded', component: AgreeUserConcludedComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'edit',
        component: UserParametersComponent,
        children: [
          { path: '', redirectTo: 'person', pathMatch: 'full' },
          { path: 'contacts', component: UserContactsComponent, canActivate: [CanActivateGuard] },
          { path: 'person', component: UserPersonComponent, canActivate: [CanActivateGuard] },
          { path: 'status', component: UserStatusComponent, canActivate: [CanActivateGuard] },
          { path: 'looking', component: UserLookingComponent },
          { path: 'delete', component: UserDeleteComponent, canActivate: [CanActivateGuard] },
        ],
      },
    ],
  },
  { path: '404', component: NotFoundComponent },
  // { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
