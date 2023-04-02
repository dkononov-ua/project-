import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { SharedRoutingModule } from './shared-routing.module';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
  ]
})
export class SharedModule { }
