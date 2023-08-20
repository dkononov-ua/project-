import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FilesComponent } from './user/files/files.component';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { ResidentsComponent } from './house/residents/residents.component';
import { InfoComponent } from './user/info/info.component';
import { RouterModule, Routes } from '@angular/router';
import { HouseResidentsComponent } from './house/house-residents/house-residents.component';
import { AgreementsComponent } from './user/agree/agreements/agreements.component';
import { AgreementsHComponent } from './house/agree-house/agreements-h/agreements-h.component';
import { AgreeUComponent } from './user/agree/agree-u/agree-u.component';
import { AgreeHouseComponent } from './house/agree-house/agree-house.component';
import { DealsComponent } from './user/agree/deals/deals.component';
import { ConcludedAgreeComponent } from './user/agree/concluded-agree/concluded-agree.component';
import { ConcludedComponent } from './house/agree-house/concluded/concluded.component';
import { DownloadAgreeComponent } from './user/agree/download-agree/download-agree.component';
import { SubscribeToMeComponent } from './user/subscribe-to-me/subscribe-to-me.component';
import { FillingComponent } from './house/filling/filling.component';
import { HouseInfoComponent } from './house/house-info/house-info.component';
import { AgreementComponent } from './house/agreement/agreement.component';
import { DownloadAgreeHComponent } from './house/agree-house/download-agree-h/download-agree-h.component';
import { AgreeHComponent } from './house/agree-house/agree-h/agree-h.component';
import { DeleteAgreeHComponent } from './house/agree-house/delete-agree-h/delete-agree-h.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'residents', component: ResidentsComponent, canActivate: [CanActivateGuard] },
      { path: 'house-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-u/:selectedFlatAgree', component: AgreeUComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-h/:selectedFlatAgree', component: AgreeHComponent, canActivate: [CanActivateGuard] },
      { path: 'download/:selectedFlatAgree', component: DownloadAgreeComponent, canActivate: [CanActivateGuard] },
      { path: 'download-h/:selectedFlatAgree', component: DownloadAgreeHComponent, canActivate: [CanActivateGuard] },
      { path: 'delete-h/:selectedFlatAgree', component: DeleteAgreeHComponent, canActivate: [CanActivateGuard] },
      {
        path: 'house', component: HouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'parameters', pathMatch: 'full' },
          { path: 'agree-house', component: AgreeHouseComponent, canActivate: [CanActivateGuard] },
          { path: 'order-services', component: OrderServicesComponent, canActivate: [CanActivateGuard] },
          { path: 'house-info', component: HouseInfoComponent, canActivate: [CanActivateGuard] },
          { path: 'filling', component: FillingComponent, canActivate: [CanActivateGuard] },
          { path: 'agreement', component: AgreementComponent, canActivate: [CanActivateGuard] },
          { path: 'concluded', component: ConcludedComponent, canActivate: [CanActivateGuard] },
          { path: 'agreements-h', component: AgreementsHComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'user', component: UserComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: InfoComponent, canActivate: [CanActivateGuard] },
          { path: 'files', component: FilesComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [CanActivateGuard] },
          { path: 'agreements', component: AgreementsComponent, canActivate: [CanActivateGuard] },
          { path: 'deals', component: DealsComponent, canActivate: [CanActivateGuard] },
          { path: 'concluded-agree', component: ConcludedAgreeComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribe', component: SubscribeToMeComponent, canActivate: [CanActivateGuard] },
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
