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
import { ComunStatisticsComponent } from './comun-statistics/comun-statistics.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectYearComponent } from './select-year/select-year.component';
import { SelectMonthComponent } from './select-month/select-month.component';
import { ComunStatAllComponent } from './comun-stat-all/comun-stat-all.component';
import { SelectComunComponent } from './select-comun/select-comun.component';
import { ComunNavComponent } from './comun-nav/comun-nav.component';
import { ComunHistoryComponent } from './comun-history/comun-history.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    HousingServicesComponent,
    HostComunComponent,
    ComunCompanyComponent,
    ComunStatisticsComponent,
    SelectYearComponent,
    SelectMonthComponent,
    ComunStatAllComponent,
    SelectComunComponent,
    ComunNavComponent,
    ComunHistoryComponent,
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
  ],
})
export class HousingServicesModule { }
