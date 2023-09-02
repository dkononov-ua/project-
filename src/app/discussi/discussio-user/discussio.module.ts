import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussioRoutingModule } from './discussio-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChoseSubscribeService } from '../../services/chose-subscribe.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HostDiscussioComponent } from './host-discussio/host-discussio.component';
import { UserDiscussioComponent } from './user-discussio/user-discussio.component';
import { ApprovedComponent } from './approved/approved.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatUserComponent } from './chat-user/chat-user.component';
import { ChatHostComponent } from './chat-host/chat-host.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HouseRoutingModule } from 'src/app/account/house/house-routing.module';
import { UserRoutingModule } from 'src/app/account/user/user-routing.module';


@NgModule({
  declarations: [
    HostDiscussioComponent,
    UserDiscussioComponent,
    ApprovedComponent,
    ChatUserComponent,
    ChatHostComponent,
    ChatRoomComponent,
  ],
  providers: [ChoseSubscribeService],
  imports: [
    DiscussioRoutingModule,
    CommonModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
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
    MatDialogModule,

    HouseRoutingModule,
    UserRoutingModule,

  ]
})
export class DiscussioModule { }
