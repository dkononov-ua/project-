import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { AgreeDeleteComponent } from './host-house-agree/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './host-house-agree/agree-menu/agree-menu.component';
import { SelectionHousingComponent } from 'src/app/components/house/selection-housing/selection-housing.component';
import { AddHouseComponent } from 'src/app/components/house/add-house/add-house.component';
import { HouseResidentsComponent } from './host-house-resident/house-residents/house-residents.component';
import { HouseControlComponent } from './host-house-control/house-control.component';
import { ResidentComponent } from './host-house-resident/resident.component';
import { AgreeHostComponent } from './host-house-agree/agree-host/agree-host.component';
import { AgreeConcludedComponent } from './host-house-agree/agree-concluded/agree-concluded.component';
import { AgreeReviewComponent } from './host-house-agree/agree-review/agree-review.component';
import { AgreeStepComponent } from './host-house-agree/agree-step/agree-step.component';
import { ResidentOwnerComponent } from './host-house-resident/resident-owner/resident-owner.component';
import { ResidentMenuComponent } from './host-house-resident/resident-menu/resident-menu.component';
import { ResidentPageComponent } from './host-house-resident/resident-page/resident-page.component';
import { UserSearchComponent } from 'src/app/pages/host-house/host-house-resident/user-search/user-search.component';
import { HostHousePageComponent } from './host-house-page/host-house-page.component';
import { AboutComponent } from './host-house-edit/about/about.component';
import { AddObjectsComponent } from './host-house-edit/add-objects/add-objects.component';
import { AdditionalInfoComponent } from './host-house-edit/additional-info/additional-info.component';
import { AddressComponent } from './host-house-edit/address/address.component';
import { HousingParametersComponent } from './host-house-edit/housing-parameters.component';
import { InstructionComponent } from './host-house-edit/instruction/instruction.component';
import { ParamComponent } from './host-house-edit/param/param.component';
import { PhotoComponent } from './host-house-edit/photo/photo.component';
import { AgreeCreateComponent } from './host-house-agree/agree-create/agree-create.component';
import { SubscribersHouseComponent } from './host-house-discus/subscribers/subscribers-house.component';
import { SubscribersDiscusComponent } from './host-house-discus/discus/subscribers-discus.component';
import { SubscriptionsHouseComponent } from './host-house-discus/subscriptions/subscriptions-house.component';
import { HostHouseDiscusComponent } from './host-house-discus/host-house-discus.component';
import { HouseDiscussPageComponent } from './host-house-discus/house-discuss-page/house-discuss-page.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, data: { title: 'Профіль оселі', description: 'Профіль оселі' }, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: HostHousePageComponent, canActivate: [CanActivateGuard] },
      { path: 'agree-delete', component: AgreeDeleteComponent, canActivate: [CanActivateGuard] },
      {
        path: 'edit', component: HousingParametersComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'address', pathMatch: 'full' },
          { path: 'address', component: AddressComponent, canActivate: [CanActivateGuard] },
          { path: 'param', component: ParamComponent, canActivate: [CanActivateGuard] },
          { path: 'photo', component: PhotoComponent, canActivate: [CanActivateGuard] },
          { path: 'about', component: AboutComponent, canActivate: [CanActivateGuard] },
          { path: 'additionally', component: AdditionalInfoComponent, canActivate: [CanActivateGuard] },
          { path: 'instruction', component: InstructionComponent, canActivate: [CanActivateGuard] },
          { path: 'add-objects', component: AddObjectsComponent, canActivate: [CanActivateGuard] },
        ]
      },
      {
        path: 'discus', component: HostHouseDiscusComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: HouseDiscussPageComponent },
          { path: 'discussion', component: SubscribersDiscusComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribers', component: SubscribersHouseComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsHouseComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'residents', component: ResidentComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'all-residents', pathMatch: 'full' },
          { path: 'all-residents', component: HouseResidentsComponent, canActivate: [CanActivateGuard] },
          { path: 'resident', component: ResidentPageComponent, canActivate: [CanActivateGuard] },
          { path: 'owner', component: ResidentOwnerComponent, canActivate: [CanActivateGuard] },
          { path: 'menu', component: ResidentMenuComponent, canActivate: [CanActivateGuard] },
          { path: 'add', component: UserSearchComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'control', component: HouseControlComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'selection', pathMatch: 'full' },
          { path: 'selection', data: { title: 'Вибрати оселю', description: 'Вибрати оселю' }, component: SelectionHousingComponent, canActivate: [CanActivateGuard] },
          { path: 'add', data: { title: 'Створити оселю, додати оселю', description: 'Створити оселю' }, component: AddHouseComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'agree', component: AgreeHostComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'menu', pathMatch: 'full' },
          { path: 'menu', data: { title: 'Угоди оселі', description: 'Угоди оселі' }, component: AgreeMenuComponent, canActivate: [CanActivateGuard] },
          { path: 'concluded', component: AgreeConcludedComponent, canActivate: [CanActivateGuard] },
          { path: 'rewiew', component: AgreeReviewComponent, canActivate: [CanActivateGuard] },
          { path: 'step', component: AgreeStepComponent, canActivate: [CanActivateGuard] },
        ],
      },
    ],
  },

  { path: 'agree-create', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
  { path: 'agree-create/:selectedSubscriber?.user_id', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
