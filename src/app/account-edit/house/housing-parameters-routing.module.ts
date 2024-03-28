import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AddressComponent } from './address/address.component';
import { ParamComponent } from './param/param.component';
import { PhotoComponent } from './photo/photo.component';
import { CanActivateGuard } from '../../services/auth.guard';
import { HousingParametersComponent } from './housing-parameters.component';
import { HostComponent } from './host/host.component';
import { AddObjectsComponent } from './add-objects/add-objects.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { InstructionComponent } from './instruction/instruction.component';
import { AddHouseComponent } from 'src/app/components/house/add-house/add-house.component';

const routes: Routes = [
  {
    path: 'housing-parameters', component: HousingParametersComponent, canActivate: [CanActivateGuard],
    children: [
      {
        path: 'host',
        component: HostComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'instruction', pathMatch: 'full' },
          { path: 'address', component: AddressComponent, data: { animation: 'address' }, canActivate: [CanActivateGuard] },
          { path: 'param', component: ParamComponent, data: { animation: 'param' }, canActivate: [CanActivateGuard] },
          { path: 'photo', component: PhotoComponent, data: { animation: 'photo' }, canActivate: [CanActivateGuard] },
          { path: 'about', component: AboutComponent, data: { animation: 'about' }, canActivate: [CanActivateGuard] },
          { path: 'add-objects', component: AddObjectsComponent, data: { animation: 'about' }, canActivate: [CanActivateGuard] },
          { path: 'add-house', component: AddHouseComponent, canActivate: [CanActivateGuard] },
          { path: 'additional-info', component: AdditionalInfoComponent, canActivate: [CanActivateGuard] },
          { path: 'instruction', component: InstructionComponent, canActivate: [CanActivateGuard] },
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
