import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSearchComponent } from '../components/user-search/user-search.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/loader/loader.component';
import { NavbarUserComponent } from '../components/navbar-user/navbar-user.component';
import { NavbarHouseComponent } from '../components/navbar-house/navbar-house.component';
import { SelectionAccountComponent } from '../components/selection-account/selection-account.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectionHousingComponent } from '../components/selection-housing/selection-housing.component';
import { SelectionDiscussioComponent } from '../components/selection-discussio/selection-discussio.component';
import { SubscriberMenuComponent } from '../discussi/discussio-user/subscriber-menu/subscriber-menu.component';
import { SubscribersMenuComponent } from '../discussi/discussio-house/subscribers-menu/subscribers-menu.component';
@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    UserSearchComponent,
    LoaderComponent,
    NavbarUserComponent,
    NavbarHouseComponent,
    SelectionAccountComponent,
    SelectionHousingComponent,
    SelectionDiscussioComponent,
    SubscriberMenuComponent,
    SubscribersMenuComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    UserSearchComponent,
    LoaderComponent,
    NavbarUserComponent,
    NavbarHouseComponent,
    SelectionAccountComponent,
    SelectionHousingComponent,
    SelectionDiscussioComponent,
    SubscriberMenuComponent,
    SubscribersMenuComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    FormsModule,

    MatFormFieldModule,
    MatSelectModule,
  ]
})
export class SharedModule { }
