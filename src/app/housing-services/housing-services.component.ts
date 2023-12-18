import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from '../services/selected-flat.service';
import { ChangeMonthService } from './change-month.service';
import { ChangeYearService } from './change-year.service';

@Component({
  selector: 'app-housing-services',
  templateUrl: './housing-services.component.html',
  styleUrls: ['./housing-services.component.scss']
})
export class HousingServicesComponent {

  selectedMonth: any;
  selectedYear: any;
  selectedComunal: any | null;
  selectedFlatId!: string | null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
  ) { }

  goToHostComun() {
    this.router.navigate(['/housing-services/host-comun']);
  }
}
