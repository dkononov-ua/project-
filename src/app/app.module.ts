import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './registration/registration.component';
import { PaymentsComponent } from './payments/payments.component';
import { ServicesComponent } from './services/services.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EnergyComponent } from './services/energy/energy.component';
import { WaterComponent } from './services/water/water.component';
import { CleaningComponent } from './services/cleaning/cleaning.component';
import { GasComponent } from './services/gas/gas.component';
import { InternetComponent } from './services/internet/internet.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { InformationHousingComponent } from './registration/information-housing/information-housing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { InformationUserComponent } from './registration/information-user/information-user.component';
import { HomeAccountComponent } from './interaction/home-account/home-account.component';
import { TenantsSearchComponent } from './interaction/tenants-search/tenants-search.component';
import { AgreementComponent } from './interaction/agreement/agreement.component';
import { HousingSearchComponent } from './interaction/housing-search/housing-search.component';
import { UserInteractionComponent } from './interaction/user-interaction/user-interaction.component';
import { UserPaymentComponent } from './registration/user-payment/user-payment.component';
import { HttpClientModule } from '@angular/common/http';
import { DevelopersPageComponent } from './developers-page/developers-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PaymentsComponent,
    ServicesComponent,
    NavbarComponent,
    FooterComponent,
    EnergyComponent,
    WaterComponent,
    CleaningComponent,
    GasComponent,
    InternetComponent,
    OurTeamComponent,
    RegistrationComponent,
    SearchTermComponent,
    InformationUserComponent,
    HomeAccountComponent,
    PaymentsComponent,
    TenantsSearchComponent,
    AgreementComponent,
    HousingSearchComponent,
    UserInteractionComponent,
    UserPaymentComponent,
    InformationUserComponent,
    InformationHousingComponent,
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

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
