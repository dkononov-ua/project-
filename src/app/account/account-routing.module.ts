import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { SubscribersComponent } from './house/subscribers/subscribers.component';
import { DocumentsComponent } from './house/documents/documents.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FurnitureComponent } from './house/furniture/furniture.component';
import { AccessComponent } from './house/access/access.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house', pathMatch: 'full' },
      {
        path: 'house', component: HouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'parameters', pathMatch: 'full' },
          { path: 'parameters', component: ParametersComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribers', component: SubscribersComponent, canActivate: [CanActivateGuard] },
          { path: 'documents', component: DocumentsComponent, canActivate: [CanActivateGuard] },
          { path: 'order-services', component: OrderServicesComponent, canActivate: [CanActivateGuard] },
          { path: 'furniture', component: FurnitureComponent, canActivate: [CanActivateGuard] },
          { path: 'access', component: AccessComponent, canActivate: [CanActivateGuard] },
        ],
      },
      { path: 'user', component: UserComponent, canActivate: [CanActivateGuard] },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
