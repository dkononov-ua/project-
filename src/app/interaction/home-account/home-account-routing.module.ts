import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAccountComponent } from './home-account.component';
import { HostAccComponent } from './host-acc/host-acc.component';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { CanActivateGuard } from './../../services/auth.guard';
import { AgreementsComponent } from './house/agreements/agreements.component';
import { FillingComponent } from './house/filling/filling.component';
import { HouseParamComponent } from './house/house-param/house-param.component';
import { OrderingServicesComponent } from './house/ordering-services/ordering-services.component';
import { SubscribersComponent } from './house/subscribers/subscribers.component';
import { HouseNavComponent } from './nav/house-nav/house-nav.component';
import { HostComunComponent } from 'src/app/housing-services/host-comun/host-comun.component';

const routes: Routes = [
  {
    path: 'home-account',
    component: HomeAccountComponent, canActivate: [CanActivateGuard],
    children: [
      {
        path: 'host-acc',
        component: HostAccComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'user', pathMatch: 'full' },
          { path: 'user', component: UserComponent, canActivate: [CanActivateGuard] },
          {
            path: 'house', component: HouseComponent, canActivate: [CanActivateGuard],
            children: [
              { path: '', redirectTo: 'house-param', pathMatch: 'full' },
              { path: 'host-comun', component: HostComunComponent, canActivate: [CanActivateGuard] },
              { path: 'agreements', component: AgreementsComponent, canActivate: [CanActivateGuard] },
              { path: 'filling', component: FillingComponent, canActivate: [CanActivateGuard] },
              { path: 'house-param', component: HouseParamComponent, canActivate: [CanActivateGuard] },
              { path: 'ordering-services', component: OrderingServicesComponent, canActivate: [CanActivateGuard] },
              { path: 'subscribers', component: SubscribersComponent, canActivate: [CanActivateGuard] },
            ]
          },
        ]
      },
      { path: '', redirectTo: 'host-acc', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeAccountRoutingModule { }
