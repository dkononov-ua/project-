import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { AgreeDeleteComponent } from './agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './agree-h/agree-menu/agree-menu.component';
import { HouseInfoComponent } from './house-info/house-info.component';
import { SelectionHousingComponent } from 'src/app/components/house/selection-housing/selection-housing.component';
import { AddHouseComponent } from 'src/app/components/house/add-house/add-house.component';
import { HouseResidentsComponent } from './resident/house-residents/house-residents.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'selection-house', pathMatch: 'full' },
      { path: 'house-info', component: HouseInfoComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-menu', component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'selection-house', component: SelectionHousingComponent, canActivate: [CanActivateGuard] },
      { path: 'add-house', component: AddHouseComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'house-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
