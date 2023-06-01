import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostDiscussioComponent } from './host-discussio/host-discussio.component';
import { UserDiscussioComponent } from './user-discussio/user-discussio.component';
import { ApprovedComponent } from './approved/approved.component';
import { UserChatComponent } from './user-discussio/user-chat/user-chat.component';
import { HouseDiscussioComponent } from './house-discussio/house-discussio.component';
import { MoreInfoComponent } from './house-discussio/more-info/more-info.component';

const routes: Routes = [
  {
    path: 'host-discussio',
    component: HostDiscussioComponent,
    children: [
      { path: '', redirectTo: 'user-discussio', pathMatch: 'full' },
      { path: 'more-info', component: MoreInfoComponent },
      { path: 'user-discussio', component: UserDiscussioComponent },
      { path: 'user-chat', component: UserChatComponent },
      { path: 'house-discussio', component: HouseDiscussioComponent },
      { path: 'approved', component: ApprovedComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioRoutingModule { }
