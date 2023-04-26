import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-comun-date',
  templateUrl: './comun-date.component.html',
  styleUrls: ['./comun-date.component.scss']
})
export class ComunDateComponent {

  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  months = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень'
  ];

  years = [2023, 2022, 2021, 2020];
  houses: { id: number, name: string }[] = [];

  selectHouse: any;
  comunal_name: any;
  public selectedFlatId: any;
  public selectedComunal: any | null;
  selectedMonth: any;
  selectedYear: any;

  constructor(private fb: FormBuilder, private dataService: DataService, private http: HttpClient, private hostComunComponent: HostComunComponent) {
  }

  ngOnInit(): void {

    this.selectedFlatId = localStorage.getItem('house');
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    const comunal_name = localStorage.getItem('comunal_name');
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');

    if (selectedYear) {
      this.selectedYear = JSON.parse(selectedYear);
    }

    if (selectedMonth) {
      this.selectedMonth = JSON.parse(selectedMonth);
    }
  }

  onSelectionChangeYear(): void {
    this.loading = true;

    localStorage.setItem('selectedYear', JSON.stringify(this.selectedYear));
    localStorage.removeItem('comunal_inf')
    localStorage.removeItem('selectedMonth')
    this.selectedMonth = null;

    const userJson = localStorage.getItem('user');
    const comunal_name = localStorage.getItem('comunal_name');

    if (userJson) {
      this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: JSON.parse(this.selectedFlatId).flat_id,
        comunal_name: JSON.parse(comunal_name!).comunal,
        when_pay_y: this.selectedYear
      })
        .subscribe((response: any) => {
          localStorage.setItem('comunal_inf', JSON.stringify(response));
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
    location.reload();

  }

  onSelectionChangeMonth(): void {
    this.loading = true;
    localStorage.removeItem('selectedMonth')
    localStorage.setItem('selectedMonth', JSON.stringify(this.selectedMonth));
    location.reload();

  }
}
