import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { ResidentsComponent } from './house/residents/residents.component';
import { InfoComponent } from './user/info/info.component';
import { HouseResidentsComponent } from './house/house-residents/house-residents.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { SubscribeToMeComponent } from './user/subscribe-to-me/subscribe-to-me.component';
import { FillingComponent } from './house/filling/filling.component';
import { HouseInfoComponent } from './house/house-info/house-info.component';
import { HouseShareComponent } from './house/house-share/house-share.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { AgreeReviewComponent } from './house/agree-h/agree-review/agree-review.component';
import { AgreeConcludedComponent } from './house/agree-h/agree-concluded/agree-concluded.component';
import { AgreeDownloadComponent } from './house/agree-h/agree-download/agree-download.component';
import { AgreeDeleteComponent } from './house/agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './house/agree-h/agree-menu/agree-menu.component';
import { AgreeDetailsComponent } from './house/agree-h/agree-details/agree-details.component';
import { UagreeConcludedComponent } from './user/agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeDeleteComponent } from './user/agree-u/uagree-delete/uagree-delete.component';
import { UagreeDetailsComponent } from './user/agree-u/uagree-details/uagree-details.component';
import { UagreeDownloadComponent } from './user/agree-u/uagree-download/uagree-download.component';
import { UagreeMenuComponent } from './user/agree-u/uagree-menu/uagree-menu.component';
import { UagreeReviewComponent } from './user/agree-u/uagree-review/uagree-review.component';
import { DownloadFillingComponent } from './house/filling/download-filling/download-filling.component';
@NgModule({
  declarations: [
    AccountComponent,
    HouseComponent,
    UserComponent,
    ParametersComponent,
    SubscriptionsComponent,
    ResidentsComponent,
    InfoComponent,
    HouseResidentsComponent,
    SubscribeToMeComponent,
    FillingComponent,
    HouseInfoComponent,
    HouseShareComponent,
    AgreeReviewComponent,
    AgreeConcludedComponent,
    AgreeDownloadComponent,
    AgreeDeleteComponent,
    AgreeMenuComponent,
    AgreeDetailsComponent,
    UagreeConcludedComponent,
    UagreeDeleteComponent,
    UagreeDetailsComponent,
    UagreeDownloadComponent,
    UagreeMenuComponent,
    UagreeReviewComponent,
    DownloadFillingComponent,
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
    MatDialogModule,
    MatAutocompleteModule,
    MatStepperModule,
  ]
})
export class AccountModule { }
