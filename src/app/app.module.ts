import { AppComponent } from './app.component';
import { SelectedFlatService } from './services/selected-flat.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { RouterModule } from '@angular/router';
import { LookingComponent } from './pages/host-user/host-user-edit/looking/looking.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { AboutProjectComponent } from './pages/host/about-project/about-project.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MinimaLight, MinimaDeepDark, MinimaDark } from '@alyle/ui/themes/minima';
import { LY_THEME, LY_THEME_NAME, StyleRenderer, LyTheme2 } from '@alyle/ui';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { ReportsComponent } from './components/reports/reports.component';
import { NewsComponent } from './components/news/news.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent } from './pages/host/home/home.component';
import { TemplateComponent } from './template/template.component';
import { SharingInfoComponent } from './components/sharing-info/sharing-info.component';
import { NewsLineComponent } from './components/news-line/news-line.component';
import { SharedService } from './services/shared.service';
import { StatusMessageComponent } from './components/status-message/status-message.component';
import { StatusMessageService } from './services/status-message.service';
import { CardsDataService } from './services/user-components/cards-data.service';
import { SearchHousePageComponent } from './pages/host-user/host-user-serach/search-house-page/search-house-page.component';
import { SearchTenantPageComponent } from './pages/host-user/host-user-serach/search-tenant-page/search-tenant-page.component';
import { SearchNeighborPageComponent } from './pages/host-user/host-user-serach/search-neighbor-page/search-neighbor-page.component';
import { SearchUserHostComponent } from './pages/host-user/host-user-serach/search-user-host.component';
import { NotFoundComponent } from './pages/host/not-found/not-found.component';
import { OurTeamComponent } from './pages/host/our-team/our-team.component';
import { FeedbackComponent } from './pages/host/feedback/feedback.component';
import { SupportUsComponent } from './pages/host/support-us/support-us.component';
import { UserLicenceComponent } from './pages/host/user-licence/user-licence.component';
import { PostsComponent } from './pages/blog/posts/posts.component';
import { ActTransferComponent } from './components/agreements/act-transfer/act-transfer.component';
import { RentalAgreementComponent } from './components/agreements/rental-agreement/rental-agreement.component';
import { ConfirmActionsComponent } from './components/agreements/confirm-actions/confirm-actions.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './pages/host-user/user.module';
import { HouseModule } from './pages/host-house/house.module';
import { AuthModule } from './pages/host-auth/auth.module';
import { HousingServicesModule } from './housing-services/housing-services.module';
import { SearchModule } from './search/search.module';

@NgModule({
  declarations: [
    AppComponent,
    OurTeamComponent,
    UserLicenceComponent,
    LookingComponent,
    FeedbackComponent,
    AboutProjectComponent,
    ReportsComponent,
    NotFoundComponent,
    NewsComponent,
    SupportUsComponent,
    ActTransferComponent,
    RentalAgreementComponent,
    ConfirmActionsComponent,
    HomeComponent,
    TemplateComponent,
    SharingInfoComponent,
    NewsLineComponent,
    StatusMessageComponent,
    PostsComponent,
    SearchUserHostComponent,
    SearchHousePageComponent,
    SearchTenantPageComponent,
    SearchNeighborPageComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatSliderModule,
    MatIconModule,
    RouterModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatStepperModule,
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

    // модулі треба імпортувати а роутери імпортуються в AppRoutingModule
    AppRoutingModule,
    SharedModule,
    UserModule,
    HouseModule,
    AuthModule,
    SearchModule,
    HousingServicesModule,
    // *********

  ],
  providers: [
    SelectedFlatService,
    StatusMessageService,
    CardsDataService,
    DatePipe,
    SharedService,
    StyleRenderer,
    LyTheme2,
    { provide: LY_THEME_NAME, useValue: 'minima-deep-dark' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDeepDark, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class AppModule { }
