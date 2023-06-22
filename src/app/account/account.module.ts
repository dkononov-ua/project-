import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { SubscribersComponent } from './house/subscribers/subscribers.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FurnitureComponent } from './house/furniture/furniture.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FilesComponent } from './user/files/files.component';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { ResidentsComponent } from './house/residents/residents.component';
import { InfoComponent } from './user/info/info.component';
import { HouseNavComponent } from './house/house-nav/house-nav.component';
import { HouseResidentsComponent } from './house/house-residents/house-residents.component';
import { AgreementsComponent } from './user/agree/agreements/agreements.component';
import { AgreementsHComponent } from './house/agree-house/agreements-h/agreements-h.component';
import { AgreeUComponent } from './user/agree/agree-u/agree-u.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AgreeHouseComponent } from './house/agree-house/agree-house.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConcludedAgreeComponent } from './user/agree/concluded-agree/concluded-agree.component';
import { DealsComponent } from './user/agree/deals/deals.component';

@NgModule({
  declarations: [
    AccountComponent,
    HouseComponent,
    UserComponent,
    ParametersComponent,
    SubscribersComponent,
    OrderServicesComponent,
    FurnitureComponent,
    FilesComponent,
    SubscriptionsComponent,
    ResidentsComponent,
    InfoComponent,
    HouseNavComponent,
    HouseResidentsComponent,
    AgreementsComponent,
    AgreementsHComponent,
    AgreeUComponent,
    AgreeHouseComponent,
    ConcludedAgreeComponent,
    DealsComponent,
  ],
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule
  ]
})
export class AccountModule { }
