import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './registration/registration.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { UserPaymentComponent } from './registration/user-payment/user-payment.component';
import { InformationUserComponent } from './registration/information-user/information-user.component';
import { UserInteractionComponent } from './interaction/user-interaction/user-interaction.component';
import { TenantsSearchComponent } from './interaction/tenants-search/tenants-search.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { HousingSearchComponent } from './interaction/housing-search/housing-search.component';
import { HomeAccountComponent } from './interaction/home-account/home-account.component';
import { AgreementComponent } from './interaction/agreement/agreement.component';
import { RegistrationMobComponent } from './registration/registration-mob/registration-mob.component';
import { SliderComponent } from './components/slider/slider.component';
import { ModalComponent } from './pages/modal/modal.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HousingParametersRoutingModule } from './registration/information-housing/housing-parameters-routing.module';
import { HousingParametersModule } from './registration/information-housing/housing-parameters.module';
import { SharedModule } from './shared/shared/shared.module';
import { HousingServicesModule } from './housing-services/housing-services.module';
import { HousingServicesRoutingModule } from './housing-services/housing-services-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    OurTeamComponent,
    RegistrationComponent,
    UserPaymentComponent,
    InformationUserComponent,
    UserInteractionComponent,
    TenantsSearchComponent,
    SearchTermComponent,
    HousingSearchComponent,
    HomeAccountComponent,
    AgreementComponent,
    RegistrationMobComponent,
    SliderComponent,
    ModalComponent,
    UserLicenceComponent,
  ],
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
    SharedModule,
    HousingParametersModule,
    HousingParametersRoutingModule,
    HousingServicesModule,
    HousingServicesRoutingModule,
    RouterModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
