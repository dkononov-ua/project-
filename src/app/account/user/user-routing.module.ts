import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { UagreeConcludedComponent } from './agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeDeleteComponent } from './agree-u/uagree-delete/uagree-delete.component';
import { UagreeMenuComponent } from './agree-u/uagree-menu/uagree-menu.component';
import { UagreeReviewComponent } from './agree-u/uagree-review/uagree-review.component';
import { InfoComponent } from './info/info.component';
import { UactViewComponent } from './agree-u/uact-view/uact-view.component';
import { UagreeDetailsComponent } from './agree-u/uagree-details/uagree-details.component';
import { UagreeDownloadComponent } from './agree-u/uagree-download/uagree-download.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: InfoComponent, canActivate: [CanActivateGuard] },
      { path: 'uagree-concluded', component: UagreeConcludedComponent, canActivate: [CanActivateGuard] },
      { path: 'uagree-delete', component: UagreeDeleteComponent, canActivate: [CanActivateGuard] },
      { path: 'uagree-menu', component: UagreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'uagree-review', component: UagreeReviewComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'uact-view/:selectedFlatAgree', component: UactViewComponent, canActivate: [CanActivateGuard] },
  { path: 'uagree-download/:selectedFlatAgree', component: UagreeDownloadComponent, canActivate: [CanActivateGuard] },
  { path: 'uagree-details/:selectedFlatAgree', component: UagreeDetailsComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
