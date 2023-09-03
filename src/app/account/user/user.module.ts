import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UagreeConcludedComponent } from './agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeDeleteComponent } from './agree-u/uagree-delete/uagree-delete.component';
import { UagreeMenuComponent } from './agree-u/uagree-menu/uagree-menu.component';
import { UagreeReviewComponent } from './agree-u/uagree-review/uagree-review.component';
import { InfoComponent } from './info/info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { UactViewComponent } from './agree-u/uact-view/uact-view.component';
import { UagreeDetailsComponent } from './agree-u/uagree-details/uagree-details.component';
import { UagreeDownloadComponent } from './agree-u/uagree-download/uagree-download.component';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UserComponent,
    InfoComponent,
    UagreeConcludedComponent,
    UagreeDeleteComponent,
    UagreeMenuComponent,
    UagreeReviewComponent,

    UactViewComponent,
    UagreeDetailsComponent,
    UagreeDownloadComponent,
  ],
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
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
    MatNativeDateModule,
    RouterModule,

  ]
})
export class UserModule { }
