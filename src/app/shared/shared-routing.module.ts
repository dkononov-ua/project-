import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatHostHouseComponent } from '../chat/house/chat-host-house/chat-host-house.component';
import { ChatHostComponent } from '../chat/user/chat-host/chat-host.component';
import { CanActivateGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: 'chat-house', component: ChatHostHouseComponent, canActivate: [CanActivateGuard] },
  { path: 'chat-user', component: ChatHostComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
