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
import { ChoseSubscribeService } from './chose-subscribe.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    HostDiscussioComponent,
    UserDiscussioComponent,
    ApprovedComponent,
    UserChatComponent,
    HouseDiscussioComponent,
    MoreInfoComponent
  ],
  providers: [ChoseSubscribeService],
  imports: [
    CommonModule,
    DiscussioRoutingModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    DragDropModule,
    HttpClientModule,
    RouterModule,
    MatInputModule,
    MatSnackBarModule,
  ]
})
export class DiscussioModule { }
