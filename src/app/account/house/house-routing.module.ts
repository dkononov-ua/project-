import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { HouseInfoComponent } from './house-info/house-info.component';
import { FillingComponent } from './filling/filling.component';
import { AgreeConcludedComponent } from './agree-h/agree-concluded/agree-concluded.component';
import { AgreeDeleteComponent } from './agree-h/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './agree-h/agree-menu/agree-menu.component';
import { AgreeReviewComponent } from './agree-h/agree-review/agree-review.component';
import { ActReceptionTransmissionComponent } from './agree-h/act-reception-transmission/act-reception-transmission.component';
import { ActViewComponent } from './agree-h/act-view/act-view.component';
import { AgreeDetailsComponent } from './agree-h/agree-details/agree-details.component';
import { AgreeDownloadComponent } from './agree-h/agree-download/agree-download.component';
import { HouseResidentsComponent } from './house-residents/house-residents.component';
import { ResidentsComponent } from './residents/residents.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house-info', pathMatch: 'full' },
      { path: 'house-info', component: HouseInfoComponent, canActivate: [CanActivateGuard] },
      { path: 'filling', component: FillingComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-concluded', component: AgreeConcludedComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-menu', component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-review', component: AgreeReviewComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'residents', component: ResidentsComponent, canActivate: [CanActivateGuard] },
  { path: 'house-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
  { path: 'act-create', component: ActReceptionTransmissionComponent, canActivate: [CanActivateGuard] },
  { path: 'act-view/:selectedFlatAgree', component: ActViewComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-download/:selectedFlatAgree', component: AgreeDownloadComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-details/:selectedFlatAgree', component: AgreeDetailsComponent, canActivate: [CanActivateGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
