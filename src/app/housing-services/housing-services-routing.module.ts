import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CleaningComponent } from './cleaning/cleaning.component';
import { EnergyComponent } from './energy/energy.component';
import { GasComponent } from './gas/gas.component';
import { HostComunComponent } from './host-comun/host-comun.component';
import { HousingServicesComponent } from './housing-services.component';
import { InternetComponent } from './internet/internet.component';
import { WaterComponent } from './water/water.component';

const routes: Routes = [
  {
    path: 'housing-services',
    component: HousingServicesComponent,
    children: [
      {
        path: 'host-comun',
        component: HostComunComponent,
        children: [
          { path: '', redirectTo: 'energy', pathMatch: 'full' },
          { path: 'cleaning', component: CleaningComponent },
          { path: 'energy', component: EnergyComponent },
          { path: 'gas', component: GasComponent },
          { path: 'internet', component: InternetComponent },
          { path: 'water', component: WaterComponent },
        ]
      },
      { path: '', redirectTo: 'host-comun', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingServicesRoutingModule { }
