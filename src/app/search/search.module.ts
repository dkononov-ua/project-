import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './search.component';
import { HousingSearchComponent } from './housing-search/housing-search.component';
import { TenantsSearchComponent } from './tenants-search/tenants-search.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { SearchTermComponent } from './search-term/search-term.component';
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
import { FilterPipe } from './search-term/filter.pipe';

@NgModule({
  declarations: [
    SearchTermComponent,
    HousingSearchComponent,
    TenantsSearchComponent,
    SearchComponent,
    FilterPipe,
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
    FilterPipe
  ]
})
export class SearchModule { }
