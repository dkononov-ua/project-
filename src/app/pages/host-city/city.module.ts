import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { HammerModule, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { KyivComponent } from './kyiv/kyiv/kyiv.component';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { SharedRoutingModule } from 'src/app/shared/shared-routing.module';
import { HostCityComponent } from './host-city.component';
import { SharedModule } from "../../shared/shared.module";
@NgModule({
  declarations: [
    KyivComponent,
    HostCityComponent,
  ],
  exports: [
    KyivComponent,
    HostCityComponent,
  ],
  providers: [
    UpdateComponentService,
    StatusDataService,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    FormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatNativeDateModule,
    RouterModule,
    MatCheckboxModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    DragDropModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatStepperModule,
    HammerModule,
    BrowserModule,
    NgbTypeaheadModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatBottomSheetModule,
    NgOptimizedImage,
    SharedModule
]
})

export class CityModule { }
