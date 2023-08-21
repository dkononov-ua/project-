import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { ResidentsComponent } from './house/residents/residents.component';
import { InfoComponent } from './user/info/info.component';
import { RouterModule, Routes } from '@angular/router';
import { HouseResidentsComponent } from './house/house-residents/house-residents.component';
import { SubscribeToMeComponent } from './user/subscribe-to-me/subscribe-to-me.component';
import { FillingComponent } from './house/filling/filling.component';
import { HouseInfoComponent } from './house/house-info/house-info.component';
import { AgreeConcludedComponent } from './house/agree-h/agree-concluded/agree-concluded.component';
import { AgreeDeleteComponent } from './house/agree-h/agree-delete/agree-delete.component';
import { AgreeDownloadComponent } from './house/agree-h/agree-download/agree-download.component';
import { AgreeMenuComponent } from './house/agree-h/agree-menu/agree-menu.component';
import { AgreeReviewComponent } from './house/agree-h/agree-review/agree-review.component';
import { AgreeDetailsComponent } from './house/agree-h/agree-details/agree-details.component';
import { UagreeConcludedComponent } from './user/agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeDeleteComponent } from './user/agree-u/uagree-delete/uagree-delete.component';
import { UagreeMenuComponent } from './user/agree-u/uagree-menu/uagree-menu.component';
import { UagreeReviewComponent } from './user/agree-u/uagree-review/uagree-review.component';
import { UagreeDownloadComponent } from './user/agree-u/uagree-download/uagree-download.component';
import { UagreeDetailsComponent } from './user/agree-u/uagree-details/uagree-details.component';
import { DownloadFillingComponent } from './house/filling/download-filling/download-filling.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'residents', component: ResidentsComponent, canActivate: [CanActivateGuard] },
      { path: 'house-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
      { path: 'download-filling', component: DownloadFillingComponent, canActivate: [CanActivateGuard] },

      { path: 'agree-download/:selectedFlatAgree', component: AgreeDownloadComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-details/:selectedFlatAgree', component: AgreeDetailsComponent, canActivate: [CanActivateGuard] },
      { path: 'uagree-download/:selectedFlatAgree', component: UagreeDownloadComponent, canActivate: [CanActivateGuard] },
      { path: 'uagree-details/:selectedFlatAgree', component: UagreeDetailsComponent, canActivate: [CanActivateGuard] },
      {
        path: 'house', component: HouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'parameters', pathMatch: 'full' },
          { path: 'house-info', component: HouseInfoComponent, canActivate: [CanActivateGuard] },
          { path: 'filling', component: FillingComponent, canActivate: [CanActivateGuard] },
          { path: 'agree-concluded', component: AgreeConcludedComponent, canActivate: [CanActivateGuard] },
          { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
          { path: 'agree-menu', component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
          { path: 'agree-review', component: AgreeReviewComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'user', component: UserComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: InfoComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribe', component: SubscribeToMeComponent, canActivate: [CanActivateGuard] },

          { path: 'uagree-concluded', component: UagreeConcludedComponent, canActivate: [CanActivateGuard] },
          { path: 'uagree-delete', component: UagreeDeleteComponent, canActivate: [CanActivateGuard] },
          { path: 'uagree-menu', component: UagreeMenuComponent, canActivate: [CanActivateGuard] },
          { path: 'uagree-review', component: UagreeReviewComponent, canActivate: [CanActivateGuard] },
        ],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
