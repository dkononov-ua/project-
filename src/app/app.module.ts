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
import { TestComponent } from './style/test/test.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    TestComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
