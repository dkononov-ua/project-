import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { AddressComponent } from './address/address.component';
import { ParamComponent } from './param/param.component';
import { PhotoComponent } from './photo/photo.component';
import { HousingParametersComponent } from './housing-parameters.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HostComponent } from './host/host.component';
import { RouterModule } from '@angular/router';
import { HousingParametersRoutingModule } from './housing-parameters-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddObjectsComponent } from './add-objects/add-objects.component';
import { DeleteHouseComponent } from './delete-house/delete-house.component';

import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { InstructionComponent } from './instruction/instruction.component';

@NgModule({
  declarations: [
    HousingParametersComponent,
    AboutComponent,
    AddressComponent,
    ParamComponent,
    PhotoComponent,
    HostComponent,
    AddObjectsComponent,
    DeleteHouseComponent,
    AdditionalInfoComponent,
    InstructionComponent,
  ],
  providers: [SelectedFlatService],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    DragDropModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule,
    HousingParametersRoutingModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,

    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule,
  ],
})
export class HousingParametersModule { }
