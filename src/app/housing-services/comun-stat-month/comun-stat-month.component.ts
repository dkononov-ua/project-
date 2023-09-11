import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { ViewComunService } from 'src/app/services/view-comun.service';

@Component({
  selector: 'app-comun-stat-month',
  templateUrl: './comun-stat-month.component.html',
  styleUrls: ['./comun-stat-month.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('columnAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(80%)', opacity: 0 }),
        animate('800ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('columnAnimation1', [
      transition('void => *', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('2000ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ComunStatMonthComponent implements OnInit {

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

  displayedColumns: string[] = ['id', 'name', 'consumed', 'tariff', 'needPay', 'paid', 'difference'];

  flatInfo: any;
  loading: boolean = true;
  statsAll: any;
  totalNeedPay: number | undefined;
  totalPaid: number | undefined;
  difference: any;
  selectedMonthStats: any;
  noInformationMessage: boolean = false;

  selectedFlatId!: string | null;
  selectedComun!: string | null;
  selectedYear!: string | null;
  selectedMonth!: string | null;

  selectedView: any;
  selectedName: string | null | undefined;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private selectedViewComun: ViewComunService,

  ) { this.flatInfo = []; }

  ngOnInit(): void {
    this.getSelectParam();
    if (this.selectedFlatId && this.selectedComun) {
      this.loading = false;
      if (this.selectedFlatId && this.selectedYear && this.selectedMonth) {
        this.getInfoComun();
      } else {
        console.error('Some are missing.');
      }
    } else {
      console.log('Оберіть оселю і комуналку')
    }
  }

  getSelectParam() {

    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
      if (this.selectedView) {
        this.selectedFlatId = this.selectedView;
        this.getInfoComun();
      } else {
        this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
          console.log(this.selectedFlatId)
          this.selectedFlatId = flatId;
          if (flatId) {
            this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
              this.selectedComun = selectedComun || this.selectedComun;
              this.getInfoComun();
            });
          } else {
            this.selectedComun = null;
          }
        });
      }
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
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
        this.noInformationMessage = false;
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
          this.noInformationMessage = true;
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

      utility.difference = (needPay - paid).toFixed(2);
    }

    this.difference = (this.totalNeedPay - this.totalPaid).toFixed(1);
  }
}

