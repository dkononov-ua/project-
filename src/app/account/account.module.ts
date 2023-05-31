import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { SubscribersComponent } from './discussion/subscribers/subscribers.component';
import { DocumentsComponent } from './house/documents/documents.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FurnitureComponent } from './house/furniture/furniture.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AccessComponent } from './discussion/access/access.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { FilesComponent } from './user/files/files.component';
import { ContactsComponent } from './user/contacts/contacts.component';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { CardsComponent } from './user/cards/cards.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ChatComponent } from './discussion/chat/chat.component';
import { ResidentsComponent } from './discussion/residents/residents.component';
import { InfoComponent } from './user/info/info.component';
import { DiscussionUserComponent } from './user/discussion-user/discussion-user.component';

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
    AccessComponent,
    AccountNavComponent,
    FilesComponent,
    ContactsComponent,
    SubscriptionsComponent,
    CardsComponent,
    DiscussionComponent,
    ChatComponent,
    ResidentsComponent,
    InfoComponent,
    DiscussionUserComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    AccountRoutingModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class AccountModule { }
