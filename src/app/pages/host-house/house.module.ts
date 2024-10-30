import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { HouseComponent } from './house.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResidentComponent } from './host-house-resident/resident.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResidentOwnerComponent } from './host-house-resident/resident-owner/resident-owner.component';
import { ResidentPageComponent } from './host-house-resident/resident-page/resident-page.component';
import { HouseControlComponent } from './host-house-control/house-control.component';
import { ResidentMenuComponent } from './host-house-resident/resident-menu/resident-menu.component';
import { UserSearchComponent } from './host-house-resident/user-search/user-search.component';
import { HostHousePageComponent } from './host-house-page/host-house-page.component';
import { AboutComponent } from './host-house-edit/about/about.component';
import { AdditionalInfoComponent } from './host-house-edit/additional-info/additional-info.component';
import { AddressComponent } from './host-house-edit/address/address.component';
import { HousingParametersComponent } from './host-house-edit/housing-parameters.component';
import { InstructionComponent } from './host-house-edit/instruction/instruction.component';
import { ParamComponent } from './host-house-edit/param/param.component';
import { PhotoComponent } from './host-house-edit/photo/photo.component';
import { LyButtonModule } from '@alyle/ui/button';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyIconModule } from '@alyle/ui/icon';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MissingParamsService } from './host-house-edit/missing-params.service';

import { AgreeConcludedComponent } from './host-house-agree/agree-concluded/agree-concluded.component';
import { AgreeDeleteComponent } from './host-house-agree/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './host-house-agree/agree-menu/agree-menu.component';
import { AgreeReviewComponent } from './host-house-agree/agree-review/agree-review.component';
import { ActCreateComponent } from './host-house-agree/act-create/act-create.component';
import { AgreeStepComponent } from './host-house-agree/agree-step/agree-step.component';
import { AgreeCreateComponent } from './host-house-agree/agree-create/agree-create.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SubscribersHouseComponent } from './host-house-discus/subscribers/subscribers-house.component';
import { SubscriptionsHouseComponent } from './host-house-discus/subscriptions/subscriptions-house.component';
import { SubscribersDiscusComponent } from './host-house-discus/discus/subscribers-discus.component';
import { HostHouseDiscusComponent } from './host-house-discus/host-house-discus.component';
import { HouseDiscussPageComponent } from './host-house-discus/house-discuss-page/house-discuss-page.component';
import { AgreeHostComponent } from './host-house-agree/agree-host.component';
import { HostHouseObjectsComponent } from './host-house-objects/host-house-objects.component';
import { ObjectsPageComponent } from './host-house-objects/objects-page/objects-page.component';
import { AddObjectsComponent } from './host-house-objects/add-objects/add-objects.component';
import { ControlObjectsComponent } from './host-house-objects/control-objects/control-objects.component';
import { HouseControlPageComponent } from './host-house-control/house-control-page/house-control-page.component';
import { HouseControlAboutComponent } from './host-house-control/house-control-about/house-control-about.component';
import { HostHouseSearchComponent } from './host-house-search/host-house-search.component';
import { SearchTenantPageComponent } from './host-house-search/search-tenant-page/search-tenant-page.component';
import { SearchNeighborPageComponent } from './host-house-search/search-neighbor-page/search-neighbor-page.component';
import { ComunAboutComponent } from './host-house-comun/comun-about/comun-about.component';
import { ComunAddComponent } from './host-house-comun/comun-add/comun-add.component';
import { ComunCompanyComponent } from './host-house-comun/comun-company/comun-company.component';
import { ComunHistoryComponent } from './host-house-comun/comun-history/comun-history.component';
import { ComunStatComunComponent } from './host-house-comun/comun-stat-comun/comun-stat-comun.component';
import { ComunStatMonthComponent } from './host-house-comun/comun-stat-month/comun-stat-month.component';
import { ComunStatSeasonComponent } from './host-house-comun/comun-stat-season/comun-stat-season.component';
import { ComunStatYearComponent } from './host-house-comun/comun-stat-year/comun-stat-year.component';
import { DeleteComunComponent } from './host-house-comun/delete-comun/delete-comun.component';
import { HousingServicesComponent } from './host-house-comun/housing-services.component';
import { SelectComunComponent } from './host-house-comun/select-comun/select-comun.component';
import { SelectMonthComponent } from './host-house-comun/select-month/select-month.component';
import { SelectYearComponent } from './host-house-comun/select-year/select-year.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [

    HostHouseDiscusComponent,
    HouseDiscussPageComponent,
    SubscribersHouseComponent,
    SubscriptionsHouseComponent,
    SubscribersDiscusComponent,

    HouseComponent,

    AgreeCreateComponent,
    AgreeConcludedComponent,
    AgreeDeleteComponent,
    AgreeMenuComponent,
    AgreeReviewComponent,
    ActCreateComponent,
    AgreeHostComponent,
    AgreeStepComponent,

    ResidentComponent,
    ResidentOwnerComponent,
    ResidentPageComponent,
    ResidentMenuComponent,

    HouseControlComponent,
    UserSearchComponent,
    HostHousePageComponent,

    HousingParametersComponent,
    AboutComponent,
    AddressComponent,
    ParamComponent,
    PhotoComponent,
    AddObjectsComponent,
    AdditionalInfoComponent,
    InstructionComponent,

    HostHouseObjectsComponent,
    ObjectsPageComponent,
    ControlObjectsComponent,

    HouseControlPageComponent,
    HouseControlAboutComponent,

    HostHouseSearchComponent,
    SearchTenantPageComponent,
    SearchNeighborPageComponent,

    HousingServicesComponent,
    ComunCompanyComponent,
    SelectYearComponent,
    SelectMonthComponent,
    SelectComunComponent,
    ComunHistoryComponent,
    DeleteComunComponent,
    ComunStatYearComponent,
    ComunStatSeasonComponent,
    ComunStatMonthComponent,
    ComunStatComunComponent,
    ComunAboutComponent,
    ComunAddComponent,
  ],
  providers: [
    DatePipe,
    MissingParamsService,
    SelectedFlatService, provideHttpClient(withInterceptorsFromDi())
  ],
  imports: [
    MatSnackBarModule,
    MatPaginatorModule,
    MatSliderModule,
    MatMenuModule,
    HammerModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatNativeDateModule,
    RouterModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    DragDropModule,
    MatBadgeModule,

    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,

    SharedModule,

    MatTableModule,
    MatSlideToggleModule,
    MatButtonToggleModule,

  ]
})
export class HouseModule { }
