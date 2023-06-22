import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedHComponent } from './approved-h/approved-h.component';
import { HostDiscussioHComponent } from './host-discussio-h/host-discussio-h.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { AgreementComponent } from 'src/app/account/house/agree-house/agreement/agreement.component';

const routes: Routes = [
  {
    path: 'host-discussio-h',
    component: HostDiscussioHComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house-discussio', pathMatch: 'full' },
      { path: 'house-discussio', component: HouseDiscussioComponent, canActivate: [CanActivateGuard] },
      { path: 'approved-h', component: ApprovedHComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'agreement/:selectedSubscriber?.user_id', component: AgreementComponent, canActivate: [CanActivateGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioHouseRoutingModule { }
