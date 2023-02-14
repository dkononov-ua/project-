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

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    PaymentsComponent,
    ServicesComponent,
    LessorComponent,
    LesseeComponent
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
