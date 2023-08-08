import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-comun-stat-all',
  templateUrl: './comun-stat-all.component.html',
  styleUrls: ['./comun-stat-all.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})
export class ComunStatAllComponent implements OnInit {

  months = [
    { id: 0, name: 'Січень' },
    { id: 1, name: 'Лютий' },
    { id: 2, name: 'Березень' },
    { id: 3, name: 'Квітень' },
    { id: 4, name: 'Травень' },
    { id: 5, name: 'Червень' },
    { id: 6, name: 'Липень' },
    { id: 7, name: 'Серпень' },
    { id: 8, name: 'Вересень' },
    { id: 9, name: 'Жовтень' },
    { id: 10, name: 'Листопад' },
    { id: 11, name: 'Грудень' }
  ];

  flatInfo: any;
  selectedMonth!: any;
  selectedYear!: any;
  selectedFlatId!: string | null;
  loading: boolean = true;
  statsAll: any;
  totalNeedPay: number | undefined;
  totalPaid: number | undefined;
  difference: number | undefined;
  selectedMonthStats: any;
  showNoDataMessage: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService
  ) { this.flatInfo = []; }

  ngOnInit(): void {
    this.getSelectParam();
    this.loading = false;

    if (this.selectedFlatId !== null && this.selectedYear !== null && this.selectedMonth !== null) {
      this.getInfoComun();
    } else {
      console.error('Some are missing.');
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: number | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
      this.getInfoComun();
    });

    this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
      this.selectedMonth = selectedMonth || this.selectedMonth;
      this.getInfoComun();
    });
  }

  async getInfoComun(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedMonth && this.selectedYear && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunalAll', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        when_pay_y: this.selectedYear,
        when_pay_m: this.selectedMonth,
      }).toPromise() as any;

      if (response) {
        this.showNoDataMessage = false;
        const selectedMonthStats = response.comunal.find((item: any) => item.when_pay_m === this.selectedMonth);
        if (selectedMonthStats) {
          this.statsAll = response.comunal
            .filter((item: any) => item.when_pay_m === this.selectedMonth)
            .map((item: any, index: number) => ({
              id: index + 1,
              name: item.comunal_name,
              needPay: item.calc_howmuch_pay,
              paid: item.howmuch_pay,
              consumed: item.consumed,
              tariff: item.tariff,
            }));

          this.flatInfo = this.statsAll;
          this.calculateTotals();
        } else {
          this.showNoDataMessage = true;
          console.log('No data found for selected month.');
        }
      } else {
        console.log('User not found.');
      }
    }
  }

  calculateTotals() {
    this.totalNeedPay = 0;
    this.totalPaid = 0;
    this.difference = 0;

    for (const utility of this.statsAll) {
      const needPay = parseFloat(utility.needPay);
      if (!isNaN(needPay)) {
        this.totalNeedPay += needPay;
      }

      const paid = parseFloat(utility.paid);
      if (!isNaN(paid)) {
        this.totalPaid += paid;
      }

      utility.difference = needPay - paid;
    }

    this.difference = this.totalNeedPay - this.totalPaid;
  }
}

