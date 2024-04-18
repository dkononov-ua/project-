import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { InformationUserComponent } from './account-edit/user/information-user.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { ComunPageComponent } from './pages/comun-page/comun-page.component';
import { HousingParametersModule } from './account-edit/house/housing-parameters.module';
import { HousingParametersRoutingModule } from './account-edit/house/housing-parameters-routing.module';
import { SearchRoutingModule } from './search/search-routing.module';
import { SearchModule } from './search/search.module';
import { DiscussioRoutingModule } from './discussi/discussio-user/discussio-routing.module';
import { DiscussioHouseRoutingModule } from './discussi/discussio-house/discussio-house-routing.module';
import { SelectedFlatService } from './services/selected-flat.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HousingServicesRoutingModule } from './housing-services/housing-services-routing.module';
import { HousingServicesModule } from './housing-services/housing-services.module';
import { RouterModule } from '@angular/router';
import { LookingComponent } from './account-edit/user/looking/looking.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { MatRadioModule } from '@angular/material/radio';
import { AboutProjectComponent } from './pages/about-project/about-project.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MinimaLight, MinimaDeepDark, MinimaDark } from '@alyle/ui/themes/minima';

import { LY_THEME, LY_THEME_NAME, StyleRenderer, LyTheme2 } from '@alyle/ui';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { OpportunitiesComponent } from './pages/opportunities/opportunities.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SharedModule } from './shared/shared.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NewsComponent } from './components/news/news.component';
import { SupportUsComponent } from './pages/support-us/support-us.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActTransferComponent } from './agreements/act-transfer/act-transfer.component';
import { RentalAgreementComponent } from './agreements/rental-agreement/rental-agreement.component';
import { ConfirmActionsComponent } from './agreements/confirm-actions/confirm-actions.component';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TemplateComponent } from './template/template.component';
import { HouseModule } from './account/house/house.module';
import { HouseRoutingModule } from './account/house/house-routing.module';
import { UpdateInfoComponent } from './pages/update-info/update-info.component';
@NgModule({
  declarations: [
    AppComponent,
    OurTeamComponent,
    RegistrationComponent,
    InformationUserComponent,
    UserLicenceComponent,
    ComunPageComponent,
    LookingComponent,
    FeedbackComponent,
    AboutProjectComponent,
    OpportunitiesComponent,
    ReportsComponent,
    NotFoundComponent,
    NewsComponent,
    SupportUsComponent,
    ActTransferComponent,
    RentalAgreementComponent,
    ConfirmActionsComponent,
    HomeComponent,
    HomePageComponent,
    TemplateComponent,
    UpdateInfoComponent,
  ],
  providers: [
    SelectedFlatService,
    DatePipe,
    StyleRenderer,
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-deep-dark' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDeepDark, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatSliderModule,
    SharedModule,
    MatIconModule,
    RouterModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatStepperModule,
    HousingServicesModule,
    HousingServicesRoutingModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    HammerModule,
    MatProgressSpinnerModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,

    MatInputModule,
    MatFormFieldModule,
    HousingParametersModule,
    HousingParametersRoutingModule,
    SearchModule,
    SearchRoutingModule,
    DiscussioRoutingModule,
    DiscussioHouseRoutingModule,

  ]
})
export class AppModule { }
