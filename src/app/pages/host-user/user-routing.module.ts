import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { LookingComponent } from 'src/app/account-edit/user/looking/looking.component';
import { UserComponent } from './user.component';
import { UserParametersComponent } from 'src/app/account-edit/user/user-parameterscomponent';
import { UserContactsComponent } from 'src/app/account-edit/user/user-contacts/user-contacts.component';
import { UserPersonComponent } from 'src/app/account-edit/user/user-person/user-person.component';
import { UserStatusComponent } from 'src/app/account-edit/user/user-status/user-status.component';
import { UserLookingComponent } from 'src/app/account-edit/user/user-looking/user-looking.component';
import { UserDeleteComponent } from 'src/app/account-edit/user/user-delete/user-delete.component';
import { UserTenantComponent } from './host-user-tenants-profile/user-tenant/user-tenant.component';
import { SubscribersUserComponent } from 'src/app/discussi/discussio-user/subscribers/subscribers-user.component';
import { SubscriptionsUserComponent } from 'src/app/discussi/discussio-user/subscriptions/subscriptions-user.component';
import { SubscribersDiscusComponent } from 'src/app/discussi/discussio-user/discus/subscribers-discus.component';
import { SearchHousePageComponent } from 'src/app/pages/host-user/host-user-serach/search-house-page/search-house-page.component';
import { SearchNeighborPageComponent } from 'src/app/pages/host-user/host-user-serach/search-neighbor-page/search-neighbor-page.component';
import { SearchTenantPageComponent } from 'src/app/pages/host-user/host-user-serach/search-tenant-page/search-tenant-page.component';
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
import { ChatHostComponent } from 'src/app/chat/user/chat-host/chat-host.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: HostUserPageComponent, data: { title: 'Профіль користувача', description: 'Профіль користувача' } },
      { path: 'tenant', component: UserTenantComponent },
      { path: 'tenant-step', component: UserTenantStepComponent },
      { path: 'chat', component: ChatHostComponent, canActivate: [CanActivateGuard] },
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
          { path: 'tenant', component: SearchTenantPageComponent },
          { path: 'neighbor', component: SearchNeighborPageComponent },
        ],
      },
      {
        path: 'agree', component: HostUserAgreeComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: AgreeUserPageComponent },
          { path: 'step', component: AgreeUserStepComponent },
          { path: 'rewiew', component: AgreeUserReviewComponent, canActivate: [CanActivateGuard] },
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
          { path: 'looking', component: UserLookingComponent, canActivate: [CanActivateGuard] },
          { path: 'delete', component: UserDeleteComponent, canActivate: [CanActivateGuard] },
        ],
      },
    ],
  },

  { path: 'looking', component: LookingComponent, data: { title: 'Профіль орендаря', description: 'Розмістити оголошення про пошук оселі' }, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
