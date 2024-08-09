import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { FilterService } from '../../services/search/filter.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { FilterUserService } from '../../services/search/filter-user.service';
import { SearchTenantComponent } from './host-search-tenant/search-tenant.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProfileComponent } from './host-search-tenant/profile/profile.component';
import { GestureService } from '../../services/gesture.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchTermTenantsComponent } from './host-search-tenant/search-term-tenants/search-term-tenants.component';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchHousingComponent } from './host-search-house/search-housing.component';
import { HouseComponent } from './host-search-house/house/house.component';
import { SearchTermHouseComponent } from './host-search-house/search-term-house/search-term-house.component';
@NgModule({
  declarations: [
    SearchTenantComponent,
    ProfileComponent,
    SearchHousingComponent,
    HouseComponent,
    SearchTermTenantsComponent,
    SearchTermHouseComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatStepperModule,
    HammerModule,
    BrowserModule,

    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
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
    MatPaginatorModule,
    MatRadioModule,
    MatCheckboxModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [
    FilterService,
    FilterUserService,
    { provide: MatPaginatorIntl },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureService },
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class SearchModule { }
