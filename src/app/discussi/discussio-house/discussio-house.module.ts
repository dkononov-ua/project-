import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussioHouseRoutingModule } from './discussio-house-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountRoutingModule } from 'src/app/account/account-routing.module';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApprovedHComponent } from './approved-h/approved-h.component';
import { HostDiscussioHComponent } from './host-discussio-h/host-discussio-h.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';


@NgModule({
  declarations: [
    ApprovedHComponent,
    HostDiscussioHComponent,
    HouseDiscussioComponent
  ],
  providers: [
    SelectedFlatService,
  ],
  imports: [
    CommonModule,
    DiscussioHouseRoutingModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    DragDropModule,
    HttpClientModule,
    RouterModule,
    MatInputModule,
    MatSnackBarModule,
  ]
})
export class DiscussioHouseModule { }
