import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddressComponent } from './address/address.component';
import { ParamComponent } from './param/param.component';
import { PhotoComponent } from './photo/photo.component';
import { HostComponent } from './host/host.component';
import { HousingParametersComponent } from './housing-parameters.component';

const routes: Routes = [
  {
    path: 'housing-parameters',component: HousingParametersComponent,
    children: [
      {
        path: 'host',
        component: HostComponent,
        children: [
          { path: '', redirectTo: 'address', pathMatch: 'full' },
          { path: 'address', component: AddressComponent, data: { animation: 'address' } },
          { path: 'param', component: ParamComponent, data: { animation: 'param' } },
          { path: 'photo', component: PhotoComponent, data: { animation: 'photo' } },
          { path: 'about', component: AboutComponent, data: { animation: 'about' } },
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
