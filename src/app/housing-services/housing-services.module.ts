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
import { NavbarComunComponent } from './navbar-comun/navbar-comun.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ServiceProfileComponent } from './service-profile/service-profile.component';
import { EngCabinetComponent } from './eng-cabinet/eng-cabinet.component';
import { ComunCompanyComponent } from './comun-company/comun-company.component';
import { MatSelectModule } from '@angular/material/select';
import { ComunDateComponent } from './comun-date/comun-date.component';
import { ComunStatisticsComponent } from './comun-statistics/comun-statistics.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    HousingServicesComponent,
    HostComunComponent,
    PaymentHistoryComponent,
    ServiceProfileComponent,
    NavbarComunComponent,
    EngCabinetComponent,
    ComunCompanyComponent,
    ComunDateComponent,
    ComunStatisticsComponent,
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
  ]
})
export class HousingServicesModule { }
