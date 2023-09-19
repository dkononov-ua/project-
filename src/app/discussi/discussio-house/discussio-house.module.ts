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
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatHouseComponent } from './chat-house/chat-house.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { SubscribersHouseComponent } from './subscribers-house/subscribers-house.component';
import { SubscriptionsHouseComponent } from './subscriptions-house/subscriptions-house.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { AgreeCreateComponent } from 'src/app/account/house/agree-h/agree-create/agree-create.component';
import { DeleteSubComponent } from './delete-sub/delete-sub.component';
import { SubscribersDiscusComponent } from './subscribers-discus/subscribers-discus.component';
import { ChatMenuComponent } from './chat-menu/chat-menu.component';
import { HouseRoutingModule } from 'src/app/account/house/house-routing.module';
import { UserRoutingModule } from 'src/app/account/user/user-routing.module';
import { SubscribersHostComponent } from './subscribers-host/subscribers-host.component';


@NgModule({
  declarations: [
    AgreeCreateComponent,
    ChatHouseComponent,
    ChatRoomsComponent,
    SubscribersHouseComponent,
    SubscriptionsHouseComponent,
    DeleteSubComponent,
    SubscribersDiscusComponent,
    ChatMenuComponent,
    SubscribersHostComponent,
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
    MatPaginatorModule,
    MatStepperModule,

    HouseRoutingModule,
    UserRoutingModule,
  ]
})
export class DiscussioHouseModule { }
