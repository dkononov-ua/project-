import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddressComponent } from './address/address.component';
import { HouseIdComponent } from './house-id/house-id.component';
import { ParamComponent } from './param/param.component';
import { PhotoComponent } from './photo/photo.component';
import { HostComponent } from './host/host.component';
import { HousingParametersComponent } from './housing-parameters.component';
import { SharedModule } from '../../shared/shared/shared.module';


const routes: Routes = [
  {
    path: 'housing-parameters',component: HousingParametersComponent,
    children: [
      {
        path: 'host',
        component: HostComponent,
        children: [
          { path: '', redirectTo: 'address', pathMatch: 'full' },
          { path: 'address', component: AddressComponent },
          { path: 'house-id', component: HouseIdComponent },
          { path: 'param', component: ParamComponent },
          { path: 'photo', component: PhotoComponent },
          { path: 'about', component: AboutComponent },
        ]
      },
      { path: '', redirectTo: 'host', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingParametersRoutingModule { }
