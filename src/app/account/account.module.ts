import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { SubscribersComponent } from './house/subscribers/subscribers.component';
import { DocumentsComponent } from './house/documents/documents.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FurnitureComponent } from './house/furniture/furniture.component';

@NgModule({
  declarations: [
    AccountComponent,
    HouseComponent,
    UserComponent,
    ParametersComponent,
    SubscribersComponent,
    DocumentsComponent,
    OrderServicesComponent,
    FurnitureComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
  ]
})
export class AccountModule { }
