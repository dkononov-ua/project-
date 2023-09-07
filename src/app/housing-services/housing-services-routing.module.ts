import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostComunComponent } from './host-comun/host-comun.component';
import { HousingServicesComponent } from './housing-services.component';
import { CanActivateGuard } from './../services/auth.guard';
import { ComunCompanyComponent } from './comun-company/comun-company.component';
import { ComunHistoryComponent } from './comun-history/comun-history.component';
import { ComunStatSeasonComponent } from './comun-stat-season/comun-stat-season.component';
import { ComunStatMonthComponent } from './comun-stat-month/comun-stat-month.component';
import { ComunStatYearComponent } from './comun-stat-year/comun-stat-year.component';
import { ComunStatComunComponent } from './comun-stat-comun/comun-stat-comun.component';

const routes: Routes = [
  {
    path: 'housing-services',
    component: HousingServicesComponent, canActivate: [CanActivateGuard],
    children: [
      {
        path: 'host-comun',
        component: HostComunComponent, canActivate: [CanActivateGuard],

        children: [
          { path: '', redirectTo: 'comun-company', pathMatch: 'full' },
          { path: 'comun-history', component: ComunHistoryComponent, canActivate: [CanActivateGuard] },
          { path: 'comun-stat-season', component: ComunStatSeasonComponent, canActivate: [CanActivateGuard] },
          { path: 'comun-stat-comun', component: ComunStatComunComponent, canActivate: [CanActivateGuard] },
          { path: 'comun-stat-month', component: ComunStatMonthComponent, canActivate: [CanActivateGuard] },
          { path: 'comun-stat-year', component: ComunStatYearComponent, canActivate: [CanActivateGuard] },
          { path: 'comun-company', component: ComunCompanyComponent, canActivate: [CanActivateGuard] },
          { path: 'comun-stat-season', component: ComunStatSeasonComponent, canActivate: [CanActivateGuard] },
        ]
      },
      { path: '', redirectTo: 'host-comun', pathMatch: 'full' },
      { path: 'host-comun/:selectedFlat.flat.flat_id', component: ComunStatComunComponent, canActivate: [CanActivateGuard] },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingServicesRoutingModule { }
