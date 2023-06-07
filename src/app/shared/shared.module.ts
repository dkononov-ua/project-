import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { SharedRoutingModule } from './shared-routing.module';
import { AccountNavComponent } from '../components/account-nav/account-nav.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    AccountNavComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
    AccountNavComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
  ]
})
export class SharedModule { }
