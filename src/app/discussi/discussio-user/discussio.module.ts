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
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { HouseRoutingModule } from 'src/app/account/house/house-routing.module';
import { UserRoutingModule } from 'src/app/account/user/user-routing.module';
import { SubscribersUserComponent } from './subscribers/subscribers-user.component';
import { SubscribersDiscusComponent } from './discus/subscribers-discus.component';
import { SubscriptionsUserComponent } from './subscriptions/subscriptions-user.component';
import { DeleteSubsComponent } from './delete/delete-subs.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SubscribersUserComponent,
    SubscribersDiscusComponent,
    SubscriptionsUserComponent,
    DeleteSubsComponent,
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
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HouseRoutingModule,
    UserRoutingModule,
  ]
})
export class DiscussioModule { }
