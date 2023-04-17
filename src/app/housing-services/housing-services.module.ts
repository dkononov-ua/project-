import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { WaterComponent } from './water/water.component';
import { EnergyComponent } from './energy/energy.component';
import { GasComponent } from './gas/gas.component';
import { InternetComponent } from './internet/internet.component';
import { CleaningComponent } from './cleaning/cleaning.component';
import { RouterModule } from '@angular/router';
import { HousingServicesComponent } from './housing-services.component';
import { HostComunComponent } from './host-comun/host-comun.component';
import { SharedModule } from '../shared/shared.module';
import { PaymentHistoryComponent } from './energy/payment-history/payment-history.component';
import { ServiceProfileComponent } from './energy/service-profile/service-profile.component';
import { DetailsComponent } from './energy/details/details.component';
import { NavbarComunComponent } from './navbar-comun/navbar-comun.component';
import { EngCabinetComponent } from './energy/eng-cabinet/eng-cabinet.component';

@NgModule({
  declarations: [
    HousingServicesComponent,
    WaterComponent,
    EnergyComponent,
    GasComponent,
    InternetComponent,
    CleaningComponent,
    HostComunComponent,
    PaymentHistoryComponent,
    ServiceProfileComponent,
    DetailsComponent,
    NavbarComunComponent,
    EngCabinetComponent,
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
