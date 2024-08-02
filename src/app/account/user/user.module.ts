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
import { UserPageComponent } from './user-page/user-page.component';
import { UserContactsComponent } from 'src/app/account-edit/user/user-contacts/user-contacts.component';
import { UserLookingComponent } from 'src/app/account-edit/user/user-looking/user-looking.component';
import { UserParametersComponent } from 'src/app/account-edit/user/user-parameterscomponent';
import { UserPersonComponent } from 'src/app/account-edit/user/user-person/user-person.component';
import { UserStatusComponent } from 'src/app/account-edit/user/user-status/user-status.component';
import { UserDeleteComponent } from 'src/app/account-edit/user/user-delete/user-delete.component';
import { UserTenantComponent } from './tenant/user-tenant/user-tenant.component';
import { UserTenantStepComponent } from './tenant/user-tenant-step/user-tenant-step.component';
import { SubscribersDiscusComponent } from 'src/app/discussi/discussio-user/discus/subscribers-discus.component';
import { SubscribersUserComponent } from 'src/app/discussi/discussio-user/subscribers/subscribers-user.component';
import { SubscriptionsUserComponent } from 'src/app/discussi/discussio-user/subscriptions/subscriptions-user.component';
import { DeleteSubsComponent } from 'src/app/discussi/discussio-user/delete/delete-subs.component';
import { DiscusUserComponent } from 'src/app/discussi/discussio-user/discus-user/discus-user.component';

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
    UserParametersComponent,
    UserContactsComponent,
    UserPersonComponent,
    UserStatusComponent,
    UserLookingComponent,
    UserDeleteComponent,
    UserTenantComponent,
    UserTenantStepComponent,

    SubscribersUserComponent,
    SubscribersDiscusComponent,
    SubscriptionsUserComponent,
    DeleteSubsComponent,
    DiscusUserComponent,

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
