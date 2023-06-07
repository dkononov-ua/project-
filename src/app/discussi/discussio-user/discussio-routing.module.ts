import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedComponent } from './approved/approved.component';
import { HostDiscussioComponent } from './host-discussio/host-discussio.component';
import { UserDiscussioComponent } from './user-discussio/user-discussio.component';

const routes: Routes = [
  {
    path: 'host-discussio',
    component: HostDiscussioComponent,
    children: [
      { path: '', redirectTo: 'user-discussio', pathMatch: 'full' },
      { path: 'user-discussio', component: UserDiscussioComponent },
      { path: 'approved', component: ApprovedComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioRoutingModule { }
