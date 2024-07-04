import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UagreeConcludedComponent } from './agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeMenuComponent } from './agree-u/uagree-menu/uagree-menu.component';
import { UagreeReviewComponent } from './agree-u/uagree-review/uagree-review.component';
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
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UagreeHostComponent } from './agree-u/uagree-host/uagree-host.component';
import { UagreeStepComponent } from './agree-u/uagree-step/uagree-step.component';
import { PreviewInfoComponent } from './preview-info/preview-info.component';
import { UserComponent } from './user.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserPageComponent } from './user-page/user-page.component';
@NgModule({
  declarations: [
    UserComponent,
    UagreeConcludedComponent,
    UagreeMenuComponent,
    UagreeReviewComponent,
    UagreeHostComponent,
    UagreeStepComponent,
    PreviewInfoComponent,
    UserPageComponent,
  ],
  providers: [
    DatePipe,
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
    MatProgressSpinnerModule,

  ]
})
export class UserModule { }
