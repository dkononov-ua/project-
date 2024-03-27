import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatHostComponent } from './chat-host/chat-host.component';
import { SubscribersDiscusComponent } from './subscribers-discus/subscribers-discus.component';
import { SubscribersUserComponent } from './subscribers-user/subscribers-user.component';
import { SubscriptionsUserComponent } from './subscriptions-user/subscriptions-user.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';

const routes: Routes = [
  { path: 'chat-host', component: ChatHostComponent, canActivate: [CanActivateGuard]  },
  { path: 'subscribers-discuss', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
  { path: 'subscribers-user', component: SubscribersUserComponent, canActivate: [CanActivateGuard] },
  { path: 'subscriptions-user', component: SubscriptionsUserComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioRoutingModule { }
