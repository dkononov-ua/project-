import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { ChatHouseComponent } from './chat-house/chat-house.component';
import { SubscribersHouseComponent } from './subscribers-house/subscribers-house.component';
import { SubscriptionsHouseComponent } from './subscriptions-house/subscriptions-house.component';
import { AgreeCreateComponent } from 'src/app/account/house/agree-h/agree-create/agree-create.component';
import { SubscribersMenuComponent } from './subscribers-menu/subscribers-menu.component';
import { SubscribersDiscusComponent } from './subscribers-discus/subscribers-discus.component';
import { ChatMenuComponent } from './chat-menu/chat-menu.component';

const routes: Routes = [
  { path: 'agree-create', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-create/:selectedSubscriber?.user_id', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'chat-house', component: ChatHouseComponent, canActivate: [CanActivateGuard] },
  { path: 'chat', component: ChatMenuComponent, canActivate: [CanActivateGuard] },
  {
    path: 'subscribers-menu', component: SubscribersMenuComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'subscribers-house', pathMatch: 'full' },
      { path: 'subscribers-house', component: SubscribersHouseComponent, canActivate: [CanActivateGuard] },
      { path: 'subscribers-discus', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
      { path: 'subscriptions-house', component: SubscriptionsHouseComponent, canActivate: [CanActivateGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioHouseRoutingModule { }
