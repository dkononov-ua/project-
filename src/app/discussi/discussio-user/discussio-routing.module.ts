import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedComponent } from './approved/approved.component';
import { HostDiscussioComponent } from './host-discussio/host-discussio.component';
import { UserDiscussioComponent } from './user-discussio/user-discussio.component';
import { ChatUserComponent } from './chat-user/chat-user.component';
import { ChatHostComponent } from './chat-host/chat-host.component';

const routes: Routes = [
  {
    path: 'host-discussio',
    component: HostDiscussioComponent,
    children: [
      { path: '', redirectTo: 'user-discussio', pathMatch: 'full' },
      { path: 'user-discussio', component: UserDiscussioComponent },
      { path: 'approved', component: ApprovedComponent },
    ],
  },
  { path: 'chat-host', component: ChatHostComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussioRoutingModule { }
