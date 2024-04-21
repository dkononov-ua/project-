import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousingServicesComponent } from './housing-services.component';
import { CanActivateGuard } from './../services/auth.guard';
import { ComunCompanyComponent } from './comun-company/comun-company.component';
import { ComunHistoryComponent } from './comun-history/comun-history.component';
import { ComunStatSeasonComponent } from './comun-stat-season/comun-stat-season.component';
import { ComunStatMonthComponent } from './comun-stat-month/comun-stat-month.component';
import { ComunStatYearComponent } from './comun-stat-year/comun-stat-year.component';
import { ComunStatComunComponent } from './comun-stat-comun/comun-stat-comun.component';
import { ComunAboutComponent } from './comun-about/comun-about.component';
import { ComunAddComponent } from './comun-add/comun-add.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingServicesRoutingModule { }
