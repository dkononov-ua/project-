import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { SubscribersComponent } from './house/subscribers/subscribers.component';
import { DocumentsComponent } from './house/documents/documents.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FurnitureComponent } from './house/furniture/furniture.component';
import { FilesComponent } from './user/files/files.component';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { ResidentsComponent } from './house/residents/residents.component';
import { InfoComponent } from './user/info/info.component';
import { RouterModule, Routes } from '@angular/router';
import { HouseResidentsComponent } from './house/house-residents/house-residents.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'subscribers', component: SubscribersComponent, canActivate: [CanActivateGuard] },
      { path: 'residents', component: ResidentsComponent, canActivate: [CanActivateGuard] },
      { path: 'house-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
      {
        path: 'house', component: HouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'parameters', pathMatch: 'full' },
          { path: 'parameters', component: ParametersComponent, canActivate: [CanActivateGuard] },
          { path: 'documents', component: DocumentsComponent, canActivate: [CanActivateGuard] },
          { path: 'order-services', component: OrderServicesComponent, canActivate: [CanActivateGuard] },
          { path: 'furniture', component: FurnitureComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'user', component: UserComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: InfoComponent, canActivate: [CanActivateGuard] },
          { path: 'files', component: FilesComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [CanActivateGuard] },
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
