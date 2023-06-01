import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussioRoutingModule } from './discussio-routing.module';
import { HostDiscussioComponent } from './host-discussio/host-discussio.component';
import { UserDiscussioComponent } from './user-discussio/user-discussio.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountRoutingModule } from '../account/account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ApprovedComponent } from './approved/approved.component';
import { UserChatComponent } from './user-discussio/user-chat/user-chat.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';
import { MoreInfoComponent } from './house-discussio/more-info/more-info.component';


@NgModule({
  declarations: [
    HostDiscussioComponent,
    UserDiscussioComponent,
    ApprovedComponent,
    UserChatComponent,
    HouseDiscussioComponent,
    MoreInfoComponent
  ],
  imports: [
    CommonModule,
    DiscussioRoutingModule,
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
export class DiscussioModule { }
