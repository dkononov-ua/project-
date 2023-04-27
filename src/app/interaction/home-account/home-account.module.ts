import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAccountRoutingModule } from './home-account-routing.module';
import { UserComponent } from './user/user.component';
import { HouseComponent } from './house/house.component';
import { HostAccComponent } from './host-acc/host-acc.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { HomeAccountComponent } from './home-account.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { HouseParamComponent } from './house/house-param/house-param.component';
import { OrderingServicesComponent } from './house/ordering-services/ordering-services.component';
import { SubscribersComponent } from './house/subscribers/subscribers.component';
import { AgreementsComponent } from './house/agreements/agreements.component';
import { FillingComponent } from './house/filling/filling.component';
import { HouseNavComponent } from './nav/house-nav/house-nav.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserNavComponent } from './nav/user-nav/user-nav.component';

@NgModule({
  declarations: [
    UserComponent,
    HouseComponent,
    HostAccComponent,
    HomeAccountComponent,
    HouseParamComponent,
    OrderingServicesComponent,
    SubscribersComponent,
    AgreementsComponent,
    FillingComponent,
    HouseNavComponent,
    UserNavComponent,
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
    NgxSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  exports: []
})
export class HomeAccountModule { }
