import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseComponent } from './house.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { AgreeDeleteComponent } from './host-house-agree/agree-delete/agree-delete.component';
import { AgreeMenuComponent } from './host-house-agree/agree-menu/agree-menu.component';
import { HouseResidentsComponent } from './host-house-resident/house-residents/house-residents.component';
import { HouseControlComponent } from './host-house-control/house-control.component';
import { ResidentComponent } from './host-house-resident/resident.component';
import { AgreeConcludedComponent } from './host-house-agree/agree-concluded/agree-concluded.component';
import { AgreeReviewComponent } from './host-house-agree/agree-review/agree-review.component';
import { AgreeStepComponent } from './host-house-agree/agree-step/agree-step.component';
import { ResidentOwnerComponent } from './host-house-resident/resident-owner/resident-owner.component';
import { ResidentMenuComponent } from './host-house-resident/resident-menu/resident-menu.component';
import { ResidentPageComponent } from './host-house-resident/resident-page/resident-page.component';
import { UserSearchComponent } from 'src/app/pages/host-house/host-house-resident/user-search/user-search.component';
import { HostHousePageComponent } from './host-house-page/host-house-page.component';
import { AboutComponent } from './host-house-edit/about/about.component';
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
import { ChatHostHouseComponent } from 'src/app/pages/host-house/host-house-chat/chat-host-house.component';
import { AgreeHostComponent } from './host-house-agree/agree-host.component';
import { ActCreateComponent } from './host-house-agree/act-create/act-create.component';
import { HostHouseObjectsComponent } from './host-house-objects/host-house-objects.component';
import { ObjectsPageComponent } from './host-house-objects/objects-page/objects-page.component';
import { AddObjectsComponent } from './host-house-objects/add-objects/add-objects.component';
import { ControlObjectsComponent } from './host-house-objects/control-objects/control-objects.component';
import { HouseControlPageComponent } from './host-house-control/house-control-page/house-control-page.component';
import { HouseControlAboutComponent } from './host-house-control/house-control-about/house-control-about.component';
import { HostHouseSearchComponent } from './host-house-search/host-house-search.component';
import { SearchTenantPageComponent } from './host-house-search/search-tenant-page/search-tenant-page.component';
import { SearchNeighborPageComponent } from './host-house-search/search-neighbor-page/search-neighbor-page.component';
import { HousingServicesComponent } from './host-house-comun/housing-services.component';
import { ComunAboutComponent } from './host-house-comun/comun-about/comun-about.component';
import { ComunAddComponent } from './host-house-comun/comun-add/comun-add.component';
import { ComunCompanyComponent } from './host-house-comun/comun-company/comun-company.component';
import { ComunHistoryComponent } from './host-house-comun/comun-history/comun-history.component';
import { ComunStatComunComponent } from './host-house-comun/comun-stat-comun/comun-stat-comun.component';
import { ComunStatMonthComponent } from './host-house-comun/comun-stat-month/comun-stat-month.component';
import { ComunStatSeasonComponent } from './host-house-comun/comun-stat-season/comun-stat-season.component';
import { ComunStatYearComponent } from './host-house-comun/comun-stat-year/comun-stat-year.component';

const routes: Routes = [
  {
    path: '',
    component: HouseComponent, data: { title: 'Профіль оселі', description: 'Профіль оселі' }, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: HostHousePageComponent },
      { path: 'chat', component: ChatHostHouseComponent, canActivate: [CanActivateGuard] },
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
        path: 'control', component: HouseControlComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: HouseControlAboutComponent },
          { path: 'add', component: HouseControlPageComponent },
        ],
      },
      {
        path: 'objects', component: HostHouseObjectsComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: ObjectsPageComponent },
          { path: 'add', component: AddObjectsComponent, canActivate: [CanActivateGuard] },
          { path: 'control', component: ControlObjectsComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'search', component: HostHouseSearchComponent,
        children: [
          { path: '', redirectTo: 'house', pathMatch: 'full' },
          { path: 'tenant', component: SearchTenantPageComponent },
          { path: 'neighbor', component: SearchNeighborPageComponent },
        ],
      },
      {
        path: 'agree', component: AgreeHostComponent,
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'about', component: AgreeMenuComponent },
          { path: 'step', component: AgreeStepComponent },
          { path: 'review', component: AgreeReviewComponent, canActivate: [CanActivateGuard] },
          { path: 'concluded', component: AgreeConcludedComponent, canActivate: [CanActivateGuard] },
          { path: 'create', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
          { path: 'create/:selectedSubscriber?.user_id', component: AgreeCreateComponent, canActivate: [CanActivateGuard] },
          { path: 'act-create/:selectedFlatAgree', component: ActCreateComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'communal',
        component: HousingServicesComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'about', pathMatch: 'full' },
          { path: 'add', component: ComunAddComponent, canActivate: [CanActivateGuard] },
          { path: 'about', component: ComunAboutComponent, canActivate: [CanActivateGuard] },
          { path: 'history', component: ComunHistoryComponent, canActivate: [CanActivateGuard] },
          { path: 'all-yaers-stat', component: ComunStatSeasonComponent, canActivate: [CanActivateGuard] },
          { path: 'stat-comun', component: ComunStatComunComponent, canActivate: [CanActivateGuard] },
          { path: 'stat-month', component: ComunStatMonthComponent, canActivate: [CanActivateGuard] },
          { path: 'stat-year', component: ComunStatYearComponent, canActivate: [CanActivateGuard] },
          { path: 'company', component: ComunCompanyComponent, canActivate: [CanActivateGuard] },
          { path: 'stat-season', component: ComunStatComunComponent, canActivate: [CanActivateGuard] },
        ]
      }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseRoutingModule { }
