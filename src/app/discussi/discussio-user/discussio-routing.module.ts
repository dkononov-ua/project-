import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscribersDiscusComponent } from './discus/subscribers-discus.component';
import { SubscribersUserComponent } from './subscribers/subscribers-user.component';
import { SubscriptionsUserComponent } from './subscriptions/subscriptions-user.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { SubscriberHostComponent } from './host/subscriber-host.component';

const routes: Routes = [
  {
    path: 'subscribers-host-user',
    component: SubscriberHostComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'subscribers-user', pathMatch: 'full' },
      { path: 'subscribers-user', component: SubscribersUserComponent, canActivate: [CanActivateGuard] },
      { path: 'subscribers-discuss', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
      { path: 'subscriptions-user', component: SubscriptionsUserComponent, canActivate: [CanActivateGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioRoutingModule { }
