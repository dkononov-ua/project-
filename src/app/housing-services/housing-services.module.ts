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
import { DetailsComponent } from './details/details.component';
import { NavbarComunComponent } from './navbar-comun/navbar-comun.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ServiceProfileComponent } from './service-profile/service-profile.component';
import { EngCabinetComponent } from './eng-cabinet/eng-cabinet.component';
import { ComunCompanyComponent } from './comun-company/comun-company.component';

@NgModule({
  declarations: [
    HousingServicesComponent,
    HostComunComponent,
    PaymentHistoryComponent,
    ServiceProfileComponent,
    DetailsComponent,
    NavbarComunComponent,
    EngCabinetComponent,
    ComunCompanyComponent,
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
  ]
})
export class HousingServicesModule { }
