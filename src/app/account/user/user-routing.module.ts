import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/services/auth.guard';
import { UagreeMenuComponent } from './agree-u/uagree-menu/uagree-menu.component';
import { LookingComponent } from 'src/app/account-edit/user/looking/looking.component';
import { UagreeConcludedComponent } from './agree-u/uagree-concluded/uagree-concluded.component';
import { UagreeReviewComponent } from './agree-u/uagree-review/uagree-review.component';
import { UagreeHostComponent } from './agree-u/uagree-host/uagree-host.component';
import { UagreeStepComponent } from './agree-u/uagree-step/uagree-step.component';
import { PreviewInfoComponent } from './preview-info/preview-info.component';
import { UserComponent } from './user.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: UserPageComponent, canActivate: [CanActivateGuard] },
      { path: 'preview', component: PreviewInfoComponent, canActivate: [CanActivateGuard] },
    ],
  },
  {
    path: 'agree', component: UagreeHostComponent, canActivate: [CanActivateGuard],
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      { path: 'menu', component: UagreeMenuComponent, canActivate: [CanActivateGuard] },
      { path: 'concluded', component: UagreeConcludedComponent, canActivate: [CanActivateGuard] },
      { path: 'rewiew', component: UagreeReviewComponent, canActivate: [CanActivateGuard] },
      { path: 'step', component: UagreeStepComponent, canActivate: [CanActivateGuard] },
    ],
  },
  { path: 'looking', component: LookingComponent, canActivate: [CanActivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
