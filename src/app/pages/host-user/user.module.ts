import { DatePipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { UserContactsComponent } from 'src/app/pages/host-user/host-user-edit/user-contacts/user-contacts.component';
import { UserDeleteComponent } from 'src/app/pages/host-user/host-user-edit/user-delete/user-delete.component';
import { UserPersonComponent } from 'src/app/pages/host-user/host-user-edit/user-person/user-person.component';
import { UserStatusComponent } from 'src/app/pages/host-user/host-user-edit/user-status/user-status.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgreeUserConcludedComponent } from './host-user-agree/agree-user-concluded/agree-user-concluded.component';
import { AgreeUserPageComponent } from './host-user-agree/agree-user-page/agree-user-page.component';
import { AgreeUserReviewComponent } from './host-user-agree/agree-user-review/agree-user-review.component';
import { AgreeUserStepComponent } from './host-user-agree/agree-user-step/agree-user-step.component';
import { HostUserAgreeComponent } from './host-user-agree/host-user-agree.component';
import { HostUserDiscusComponent } from './host-user-discus/host-user-discus.component';
import { UserDiscussPageComponent } from './host-user-discus/user-discuss-page/user-discuss-page.component';
import { HostUserPageComponent } from './host-user-page/host-user-page.component';
import { UserTenantStepComponent } from './host-user-tenants-profile/user-tenant-step/user-tenant-step.component';
import { UserTenantComponent } from './host-user-tenants-profile/user-tenant/user-tenant.component';
import { UserComponent } from './user.component';
import { HostUserTenantsProfileComponent } from './host-user-tenants-profile/host-user-tenants-profile.component';
import { SubscribersUserComponent } from './host-user-discus/subscribers/subscribers-user.component';
import { SubscribersDiscusComponent } from './host-user-discus/discus/subscribers-discus.component';
import { SubscriptionsUserComponent } from './host-user-discus/subscriptions/subscriptions-user.component';
import { UserParametersComponent } from './host-user-edit/user-parameters.component';
import { MatBadgeModule } from '@angular/material/badge';
import { UserTenantProfileComponent } from './host-user-edit/user-tenant-profile/user-tenant-profile.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    UserComponent,
    HostUserAgreeComponent,
    AgreeUserConcludedComponent,
    AgreeUserReviewComponent,
    AgreeUserPageComponent,
    AgreeUserStepComponent,
    HostUserPageComponent,
    UserParametersComponent,
    UserContactsComponent,
    UserPersonComponent,
    UserStatusComponent,
    UserDeleteComponent,
    UserTenantComponent,
    UserTenantStepComponent,
    HostUserDiscusComponent,
    UserDiscussPageComponent,
    SubscribersUserComponent,
    SubscribersDiscusComponent,
    SubscriptionsUserComponent,
    HostUserTenantsProfileComponent,
    UserTenantProfileComponent,
  ],
  providers: [
    DatePipe,
  ],
  imports: [
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
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatNativeDateModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatBadgeModule,

    MatDividerModule,
    MatButtonToggleModule,
  ]
})

export class UserModule { }
