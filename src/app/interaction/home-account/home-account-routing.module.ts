import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAccountComponent } from './home-account.component';
import { HostAccComponent } from './host-acc/host-acc.component';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { CanActivateGuard } from './../../services/auth.guard';

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
          { path: 'house', component: HouseComponent, canActivate: [CanActivateGuard] },
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
