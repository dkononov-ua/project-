import { AppComponent } from './app.component';
import { AppRoutingModule, RegistrationComponent } from './pages/registration/registration.component';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { UserPaymentComponent } from './pages/user-payment/user-payment.component';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { SliderComponent } from './components/slider/slider.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';
import { KrutilkaComponent } from './components/krutilka/krutilka.component';
import { DeleteComunalComponent } from './components/delete-comunal/delete-comunal.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { AccountModule } from './account/account.module';
import { AccountRoutingModule } from './account/account-routing.module';
import { HousingParametersModule } from './account-edit/house/housing-parameters.module';
import { HousingParametersRoutingModule } from './account-edit/house/housing-parameters-routing.module';
import { SharedModule } from "./shared/shared.module";
import { SearchRoutingModule } from './search/search-routing.module';
import { SearchModule } from './search/search.module';
import { DiscussioRoutingModule } from './discussi/discussio-user/discussio-routing.module';
import { DiscussioModule } from './discussi/discussio-user/discussio.module';
import { DiscussioHouseRoutingModule } from './discussi/discussio-house/discussio-house-routing.module';
import { DiscussioHouseModule } from './discussi/discussio-house/discussio-house.module';
import { SelectedFlatService } from './services/selected-flat.service';
import { ChoseSubscribersService } from './services/chose-subscribers.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HousingServicesRoutingModule } from './housing-services/housing-services-routing.module';
import { HousingServicesModule } from './housing-services/housing-services.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    OurTeamComponent,
    RegistrationComponent,
    UserPaymentComponent,
    InformationUserComponent,
    SliderComponent,
    UserLicenceComponent,
    ComunPageComponent,
    KrutilkaComponent,
    DeleteComunalComponent,
    DeleteDialogComponent,
  ],
  providers: [
    SelectedFlatService,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    CommonModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatSliderModule,
    SharedModule,
    MatIconModule,
    RouterModule,

    HousingServicesModule,
    HousingServicesRoutingModule,

    AccountModule,
    AccountRoutingModule,

    HousingParametersModule,
    HousingParametersRoutingModule,

    SearchModule,
    SearchRoutingModule,

    DiscussioModule,
    DiscussioRoutingModule,

    DiscussioHouseModule,
    DiscussioHouseRoutingModule,
  ]
})
export class AppModule { }
