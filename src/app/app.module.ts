import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './registration/registration.component';
import { PaymentsComponent } from './payments/payments.component';
import { ServicesComponent } from './services/services.component';
import { LessorComponent } from './registration/lessor/lessor.component';
import { LesseeComponent } from './registration/lessee/lessee.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { EnergyComponent } from './services/energy/energy.component';
import { WaterComponent } from './services/water/water.component';
import { CleaningComponent } from './services/cleaning/cleaning.component';
import { GasComponent } from './services/gas/gas.component';
import { InternetComponent } from './services/internet/internet.component';
import { HomeAccountComponent } from './payments/home-account/home-account.component';
import { OurTeamComponent } from './our-team/our-team.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    PaymentsComponent,
    ServicesComponent,
    LessorComponent,
    LesseeComponent,
    NavbarComponent,
    FooterComponent,
    EnergyComponent,
    WaterComponent,
    CleaningComponent,
    GasComponent,
    InternetComponent,
    HomeAccountComponent,
      OurTeamComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
