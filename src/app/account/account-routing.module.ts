import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { CanActivateGuard } from '../services/auth.guard';
import { HouseComponent } from './house/house.component';
import { UserComponent } from './user/user.component';
import { ParametersComponent } from './house/parameters/parameters.component';
import { SubscribersComponent } from './discussion/subscribers/subscribers.component';
import { DocumentsComponent } from './house/documents/documents.component';
import { OrderServicesComponent } from './house/order-services/order-services.component';
import { FurnitureComponent } from './house/furniture/furniture.component';
import { AccessComponent } from './discussion/access/access.component';
import { FilesComponent } from './user/files/files.component';
import { ContactsComponent } from './user/contacts/contacts.component';
import { SubscriptionsComponent } from './user/subscriptions/subscriptions.component';
import { CardsComponent } from './user/cards/cards.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { ChatComponent } from './discussion/chat/chat.component';
import { ResidentsComponent } from './discussion/residents/residents.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'house', pathMatch: 'full' },
      {
        path: 'house', component: HouseComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'parameters', pathMatch: 'full' },
          { path: 'parameters', component: ParametersComponent, canActivate: [CanActivateGuard] },
          { path: 'documents', component: DocumentsComponent, canActivate: [CanActivateGuard] },
          { path: 'order-services', component: OrderServicesComponent, canActivate: [CanActivateGuard] },
          { path: 'furniture', component: FurnitureComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'user', component: UserComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'contacts', pathMatch: 'full' },
          { path: 'files', component: FilesComponent, canActivate: [CanActivateGuard] },
          { path: 'contacts', component: ContactsComponent, canActivate: [CanActivateGuard] },
          { path: 'cards', component: CardsComponent, canActivate: [CanActivateGuard] },
          { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [CanActivateGuard] },
        ],
      },
      {
        path: 'discussion', component: DiscussionComponent, canActivate: [CanActivateGuard],
        children: [
          { path: '', redirectTo: 'residents', pathMatch: 'full' },
          { path: 'access', component: AccessComponent, canActivate: [CanActivateGuard] },
          { path: 'subscribers', component: SubscribersComponent, canActivate: [CanActivateGuard] },
          { path: 'chat', component: ChatComponent, canActivate: [CanActivateGuard] },
          { path: 'residents', component: ResidentsComponent, canActivate: [CanActivateGuard] },
        ],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
