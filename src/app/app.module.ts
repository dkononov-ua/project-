import { AppComponent } from './app.component';
import { OurTeamComponent } from './pages/our-team/our-team.component';
import { UserLicenceComponent } from './pages/user-licence/user-licence.component';
import { HousingParametersModule } from './account-edit/house/housing-parameters.module';
import { HousingParametersRoutingModule } from './account-edit/house/housing-parameters-routing.module';
import { SearchRoutingModule } from './search/search-routing.module';
import { SearchModule } from './search/search.module';
import { DiscussioHouseRoutingModule } from './discussi/discussio-house/discussio-house-routing.module';
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
import { HomeComponent } from './pages/home/home.component';
import { TemplateComponent } from './template/template.component';
import { SharingInfoComponent } from './components/sharing-info/sharing-info.component';
import { AuthModule } from './auth/auth.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { NewsLineComponent } from './components/news-line/news-line.component';
import { SharedService } from './services/shared.service';
import { StatusMessageComponent } from './components/status-message/status-message.component';
import { StatusMessageService } from './services/status-message.service';
import { CardsDataService } from './services/user-components/cards-data.service';
import { PostsComponent } from './pages/posts/posts.component';
import { SearchHousePageComponent } from './pages/host-user/host-user-serach/search-house-page/search-house-page.component';
import { SearchTenantPageComponent } from './pages/host-user/host-user-serach/search-tenant-page/search-tenant-page.component';
import { SearchNeighborPageComponent } from './pages/host-user/host-user-serach/search-neighbor-page/search-neighbor-page.component';
import { SearchUserHostComponent } from './pages/host-user/host-user-serach/search-user-host.component';

@NgModule({
  declarations: [
    AppComponent,
    OurTeamComponent,
    UserLicenceComponent,
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
    DiscussioHouseRoutingModule,
    AuthModule,
    AuthRoutingModule
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
