import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FillingComponent } from './filling/filling.component';
import { AgreeConcludedComponent } from './agree-h/agree-concluded/agree-concluded.component';
import { AgreeDeleteComponent } from './agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './agree-h/agree-menu/agree-menu.component';
import { AgreeReviewComponent } from './agree-h/agree-review/agree-review.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { ParametersComponent } from './parameters/parameters.component';
import { HouseShareComponent } from './house-share/house-share.component';
import { ActReceptionTransmissionComponent } from './agree-h/act-reception-transmission/act-reception-transmission.component';
import { ActViewComponent } from './agree-h/act-view/act-view.component';
import { AgreeDownloadComponent } from './agree-h/agree-download/agree-download.component';
import { HouseResidentsComponent } from './house-residents/house-residents.component';
import { ResidentsComponent } from './residents/residents.component';
import { RouterModule } from '@angular/router';
import { HouseComponent } from './house.component';
import { HouseRoutingModule } from './house-routing.module';
import { HouseInfoComponent } from './house-info/house-info.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  declarations: [
    HouseComponent,
    FillingComponent,
    AgreeConcludedComponent,
    AgreeDeleteComponent,
    AgreeMenuComponent,
    AgreeReviewComponent,
    ParametersComponent,
    HouseShareComponent,
    ResidentsComponent,
    HouseResidentsComponent,
    AgreeDownloadComponent,
    ActReceptionTransmissionComponent,
    ActViewComponent,
    HouseInfoComponent,
  ],
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    HouseRoutingModule,
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
    MatRadioModule,
    MatCheckboxModule,
  ]
})
export class HouseModule { }
