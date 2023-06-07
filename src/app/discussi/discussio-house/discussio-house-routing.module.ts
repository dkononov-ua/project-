import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedHComponent } from './approved-h/approved-h.component';
import { HostDiscussioHComponent } from './host-discussio-h/host-discussio-h.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';

const routes: Routes = [
  {
    path: 'host-discussio-h',
    component: HostDiscussioHComponent,
    children: [
      { path: '', redirectTo: 'house-discussio', pathMatch: 'full' },
      { path: 'house-discussio', component: HouseDiscussioComponent },
      { path: 'approved-h', component: ApprovedHComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioHouseRoutingModule { }
