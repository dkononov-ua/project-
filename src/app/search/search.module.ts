import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './search.component';
import { HousingSearchComponent } from './house/housing-search/housing-search.component';
import { TenantsSearchComponent } from './tenant/tenants-search/tenants-search.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { SearchTermComponent } from './house/search-term/search-term.component';
import { FilterService } from './filter.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from '../app-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchTermTenantComponent } from './tenant/search-term-tenant/search-term-tenant.component';
import { HostHouseComponent } from './house/host-house/host-house.component';
import { HostTenantComponent } from './tenant/host-tenant/host-tenant.component';
import { PhotoGalleryComponent } from './house/photo-gallery/photo-gallery.component';

@NgModule({
  declarations: [
    SearchTermComponent,
    HousingSearchComponent,
    TenantsSearchComponent,
    SearchComponent,
    SearchTermTenantComponent,
    HostHouseComponent,
    HostTenantComponent,
    PhotoGalleryComponent,
  ],
  providers: [FilterService],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    RouterModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatSliderModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatAutocompleteModule,
    NgbTypeaheadModule,
  ],
  exports: [
  ]
})
export class SearchModule { }
