import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { SubscribersHouseComponent } from './subscribers/subscribers-house.component';
import { SubscriptionsHouseComponent } from './subscriptions/subscriptions-house.component';
import { AgreeCreateComponent } from 'src/app/account/house/agree-h/agree-create/agree-create.component';
import { SubscribersDiscusComponent } from './discus/subscribers-discus.component';
import { NotFoundComponent } from 'src/app/pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'agree-create', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-create/:selectedSubscriber?.user_id', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'subscribers-house', component: SubscribersHouseComponent, canActivate: [CanActivateGuard] },
  { path: 'subscribers-discus', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
  { path: 'subscriptions-house', component: SubscriptionsHouseComponent, canActivate: [CanActivateGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioHouseRoutingModule { }
