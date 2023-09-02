import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSearchComponent } from '../components/user-search/user-search.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../components/loader/loader.component';
import { NavbarUserComponent } from '../components/navbar-user/navbar-user.component';
import { NavbarHouseComponent } from '../components/navbar-house/navbar-house.component';
import { SelectionAccountComponent } from '../components/selection-account/selection-account.component';
import { SelectionHousingComponent } from '../components/selection-housing/selection-housing.component';

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
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    FormsModule,
  ]
})
export class SharedModule { }
