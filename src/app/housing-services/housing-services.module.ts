import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HousingServicesComponent } from './housing-services.component';
import { HostComunComponent } from './host-comun/host-comun.component';
import { SharedModule } from '../shared/shared.module';
import { ComunCompanyComponent } from './comun-company/comun-company.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectYearComponent } from './select-year/select-year.component';
import { SelectMonthComponent } from './select-month/select-month.component';
import { ComunHistoryComponent } from './comun-history/comun-history.component';
import { MatTableModule } from '@angular/material/table';
import { DeleteComunComponent } from './delete-comun/delete-comun.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectComunComponent } from './select-comun/select-comun.component';
import { ComunStatYearComponent } from './comun-stat-year/comun-stat-year.component';
import { ComunStatSeasonComponent } from './comun-stat-season/comun-stat-season.component';
import { ComunStatMonthComponent } from './comun-stat-month/comun-stat-month.component';
import { ComunStatComunComponent } from './comun-stat-comun/comun-stat-comun.component';
import { ComunAboutComponent } from './comun-about/comun-about.component';
import { ComunAddComponent } from './comun-add/comun-add.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    HousingServicesComponent,
    HostComunComponent,
    ComunCompanyComponent,
    SelectYearComponent,
    SelectMonthComponent,
    SelectComunComponent,
    ComunHistoryComponent,
    DeleteComunComponent,
    ComunStatYearComponent,
    ComunStatSeasonComponent,
    ComunStatMonthComponent,
    ComunStatComunComponent,
    ComunAboutComponent,
    ComunAddComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,

  ],
})
export class HousingServicesModule { }
