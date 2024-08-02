import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { UagreeMenuComponent } from './agree-u/uagree-menu/uagree-menu.component';
import { LookingComponent } from 'src/app/account-edit/user/looking/looking.component';
import { UagreeConcludedComponent } from './agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeReviewComponent } from './agree-u/uagree-review/uagree-review.component';
import { UagreeHostComponent } from './agree-u/uagree-host/uagree-host.component';
import { UagreeStepComponent } from './agree-u/uagree-step/uagree-step.component';
import { PreviewInfoComponent } from './preview-info/preview-info.component';
import { UserComponent } from './user.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserParametersComponent } from 'src/app/account-edit/user/user-parameterscomponent';
import { UserContactsComponent } from 'src/app/account-edit/user/user-contacts/user-contacts.component';
import { UserPersonComponent } from 'src/app/account-edit/user/user-person/user-person.component';
import { UserStatusComponent } from 'src/app/account-edit/user/user-status/user-status.component';
import { UserLookingComponent } from 'src/app/account-edit/user/user-looking/user-looking.component';
import { UserDeleteComponent } from 'src/app/account-edit/user/user-delete/user-delete.component';
import { UserTenantComponent } from './tenant/user-tenant/user-tenant.component';
import { UserTenantStepComponent } from './tenant/user-tenant-step/user-tenant-step.component';
import { UserDiscussPageComponent } from 'src/app/pages/user-discuss-page/user-discuss-page.component';
import { SubscribersUserComponent } from 'src/app/discussi/discussio-user/subscribers/subscribers-user.component';
import { SubscriptionsUserComponent } from 'src/app/discussi/discussio-user/subscriptions/subscriptions-user.component';
import { SubscribersDiscusComponent } from 'src/app/discussi/discussio-user/discus/subscribers-discus.component';
import { SearchHousePageComponent } from 'src/app/pages/search-user-host/search-house-page/search-house-page.component';
import { SearchUserHostComponent } from 'src/app/pages/search-user-host/search-user-host.component';
import { SearchNeighborPageComponent } from 'src/app/pages/search-user-host/search-neighbor-page/search-neighbor-page.component';
import { SearchTenantPageComponent } from 'src/app/pages/search-user-host/search-tenant-page/search-tenant-page.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: UserPageComponent, data: { title: 'Профіль користувача', description: 'Профіль користувача' }, canActivate: [CanActivateGuard] },
      { path: 'preview', component: PreviewInfoComponent, canActivate: [CanActivateGuard] },
      { path: 'tenant', component: UserTenantComponent },
      { path: 'tenant-step', component: UserTenantStepComponent },
      {
        path: 'discus', component: UagreeHostComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: UserDiscussPageComponent },
          { path: 'discussion', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribers', component: SubscribersUserComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsUserComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'search', component: SearchUserHostComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'house', pathMatch: 'full' },
          { path: 'house', component: SearchHousePageComponent },
          { path: 'tenant', component: SearchTenantPageComponent },
          { path: 'neighbor', component: SearchNeighborPageComponent },
        ],
      },
      {
        path: 'agree', component: UagreeHostComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'menu', pathMatch: 'full' },
          { path: 'menu', component: UagreeMenuComponent, data: { title: 'Угоди орендаря', description: 'Переглянути угоди оренди' }, canActivate: [CanActivateGuard] },
          { path: 'concluded', component: UagreeConcludedComponent, canActivate: [CanActivateGuard] },
          { path: 'rewiew', component: UagreeReviewComponent, canActivate: [CanActivateGuard] },
          { path: 'step', component: UagreeStepComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'edit',
        component: UserParametersComponent,
        canActivate: [CanActivateGuard],
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
