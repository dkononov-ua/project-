import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { RouterModule } from '@angular/router';
import { HouseComponent } from './house.component';
import { HouseRoutingModule } from './house-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResidentComponent } from './resident/resident.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActCreateComponent } from './agree-h/act-create/act-create.component';
import { ParametersComponent } from './house-info/parameters/parameters.component';
import { HouseShareComponent } from './house-info/house-share/house-share.component';
import { HouseResidentsComponent } from './resident/house-residents/house-residents.component';
import { MainInfoComponent } from './house-info/main-info/main-info.component';
import { ResidentAccessComponent } from './resident/resident-access/resident-access.component';
import { ResidentOwnerComponent } from './resident/resident-owner/resident-owner.component';
import { ResidentPageComponent } from './resident/resident-page/resident-page.component';
import { HouseControlComponent } from './house-control/house-control.component';
import { AgreeHostComponent } from './agree-h/agree-host/agree-host.component';
import { AgreeStepComponent } from './agree-h/agree-step/agree-step.component';
@NgModule({
  declarations: [
    HouseComponent,
    AgreeConcludedComponent,
    AgreeDeleteComponent,
    AgreeMenuComponent,
    AgreeReviewComponent,
    ParametersComponent,
    HouseShareComponent,
    HouseResidentsComponent,
    ResidentComponent,
    MainInfoComponent,
    ActCreateComponent,
    ResidentAccessComponent,
    ResidentOwnerComponent,
    ResidentPageComponent,
    HouseControlComponent,
    AgreeHostComponent,
    AgreeStepComponent,
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
    MatProgressSpinnerModule,
  ]
})
export class HouseModule { }
