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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HostComponent } from './host/host.component';
import { RouterModule } from '@angular/router';
import { HousingParametersRoutingModule } from './housing-parameters-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    HousingParametersComponent,
    AboutComponent,
    AddressComponent,
    ParamComponent,
    PhotoComponent,
    HostComponent,
  ],
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
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    HousingParametersRoutingModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class HousingParametersModule { }
