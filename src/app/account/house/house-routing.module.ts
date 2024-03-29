import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { AgreeDeleteComponent } from './agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './agree-h/agree-menu/agree-menu.component';
import { SelectionHousingComponent } from 'src/app/components/house/selection-housing/selection-housing.component';
import { AddHouseComponent } from 'src/app/components/house/add-house/add-house.component';
import { HouseResidentsComponent } from './resident/house-residents/house-residents.component';
import { HouseControlComponent } from './house-control/house-control.component';
import { ResidentComponent } from './resident/resident.component';
import { AgreeHostComponent } from './agree-h/agree-host/agree-host.component';
import { AgreeConcludedComponent } from './agree-h/agree-concluded/agree-concluded.component';
import { AgreeReviewComponent } from './agree-h/agree-review/agree-review.component';
import { AgreeStepComponent } from './agree-h/agree-step/agree-step.component';
import { MainInfoComponent } from './house-info/main-info/main-info.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house-info', pathMatch: 'full' },
      { path: 'house-info', component: MainInfoComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'residents', component: ResidentComponent, canActivate: [CanActivateGuard] },
  {
    path: 'house-control', component: HouseControlComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'selection-house', pathMatch: 'full' },
      { path: 'selection-house', component: SelectionHousingComponent, canActivate: [CanActivateGuard] },
      { path: 'add-house', component: AddHouseComponent, canActivate: [CanActivateGuard] },
    ],
  },
  {
    path: 'agree', component: AgreeHostComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      { path: 'menu', component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'concluded', component: AgreeConcludedComponent, canActivate: [CanActivateGuard] },
      { path: 'rewiew', component: AgreeReviewComponent, canActivate: [CanActivateGuard] },
      { path: 'step', component: AgreeStepComponent, canActivate: [CanActivateGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
