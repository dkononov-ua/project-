import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { FillingComponent } from './filling/filling.component';
import { AgreeDeleteComponent } from './agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './agree-h/agree-menu/agree-menu.component';
import { HouseResidentsComponent } from './house-residents/house-residents.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { ResidentComponent } from './resident/resident.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house-info', pathMatch: 'full' },
      { path: 'house-info', component: HouseInfoComponent, canActivate: [CanActivateGuard] },
      { path: 'filling', component: FillingComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-menu', component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'resident', component: ResidentComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'house-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
