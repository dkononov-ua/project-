import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DiscussioHouseRoutingModule } from './discussio-house-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountRoutingModule } from 'src/app/account/account-routing.module';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApprovedHComponent } from './approved-h/approved-h.component';
import { HostDiscussioHComponent } from './host-discussio-h/host-discussio-h.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';
import { AgreementComponent } from 'src/app/account/house/agree-house/agreement/agreement.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatHouseComponent } from './chat-house/chat-house.component';
import { ChatComponent } from './chat/chat.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';


@NgModule({
  declarations: [
    ApprovedHComponent,
    HostDiscussioHComponent,
    HouseDiscussioComponent,
    AgreementComponent,
    ChatHouseComponent,
    ChatComponent,
    ChatRoomsComponent,
  ],
  providers: [
    SelectedFlatService,
    DatePipe,
  ],

  imports: [
    CommonModule,
    DiscussioHouseRoutingModule,
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
    MatDatepickerModule,
    MatDialogModule,
  ]
})
export class DiscussioHouseModule { }
