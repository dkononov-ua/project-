import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';
import { AccountNavComponent } from '../components/account-nav/account-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HousingSelectionComponent } from '../components/housing-selection/housing-selection.component';
import { AccountSelectionComponent } from '../components/account-selection/account-selection.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { UserSearchComponent } from '../pages/user-search/user-search.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    AccountNavComponent,
    HousingSelectionComponent,
    AccountSelectionComponent,
    UserSearchComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    AccountNavComponent,
    HousingSelectionComponent,
    AccountSelectionComponent,
    UserSearchComponent,
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
