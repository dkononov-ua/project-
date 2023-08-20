import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedHComponent } from './approved-h/approved-h.component';
import { HostDiscussioHComponent } from './host-discussio-h/host-discussio-h.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { ChatHouseComponent } from './chat-house/chat-house.component';
import { ChatComponent } from './chat/chat.component';
import { HostHouseSubComponent } from './host-house-sub/host-house-sub.component';
import { SubscribersHouseComponent } from './subscribers-house/subscribers-house.component';
import { SubscriptionsHouseComponent } from './subscriptions-house/subscriptions-house.component';
import { AgreeCreateComponent } from 'src/app/account/house/agree-h/agree-create/agree-create.component';

const routes: Routes = [
  { path: 'agree-create', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-create/:selectedSubscriber?.user_id', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'chat-house', component: ChatHouseComponent, canActivate: [CanActivateGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [CanActivateGuard] },
  {
    path: 'host-house-sub', component: HostHouseSubComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'subscribers-house', pathMatch: 'full' },
      { path: 'subscribers-house', component: SubscribersHouseComponent, canActivate: [CanActivateGuard] },
      { path: 'subscriptions-house', component: SubscriptionsHouseComponent, canActivate: [CanActivateGuard] },
      { path: 'house-discussio', component: HouseDiscussioComponent, canActivate: [CanActivateGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioHouseRoutingModule { }
