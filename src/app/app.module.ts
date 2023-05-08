import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './pages/registration/registration.component';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { UserPaymentComponent } from './pages/user-payment/user-payment.component';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { TenantsSearchComponent } from './search/tenants-search/tenants-search.component';
import { SearchTermComponent } from './components/search-term/search-term.component';
import { HousingSearchComponent } from './search/housing-search/housing-search.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { SliderComponent } from './components/slider/slider.component';
import { ModalComponent } from './pages/modal/modal.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HousingServicesModule } from './housing-services/housing-services.module';
import { HousingServicesRoutingModule } from './housing-services/housing-services-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from './shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { KrutilkaComponent } from './components/krutilka/krutilka.component';
import { TestComponent } from './pages/test/test.component';
import { DeleteComunalComponent } from './components/delete-comunal/delete-comunal.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchComponent } from './search/search.component';
import { AccountModule } from './account/account.module';
import { AccountRoutingModule } from './account/account-routing.module';
import { HousingParametersModule } from './account-edit/house/housing-parameters.module';
import { HousingParametersRoutingModule } from './account-edit/house/housing-parameters-routing.module';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    OurTeamComponent,
    RegistrationComponent,
    UserPaymentComponent,
    InformationUserComponent,
    TenantsSearchComponent,
    SearchTermComponent,
    HousingSearchComponent,
    AgreementComponent,
    SliderComponent,
    ModalComponent,
    UserLicenceComponent,
    ComunPageComponent,
    KrutilkaComponent,
    TestComponent,
    DeleteComunalComponent,
    DeleteDialogComponent,
    SearchComponent,
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
    HousingServicesModule,
    HousingServicesRoutingModule,
    RouterModule,
    CommonModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    AccountModule,
    AccountRoutingModule,
    HousingParametersModule,
    HousingParametersRoutingModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
