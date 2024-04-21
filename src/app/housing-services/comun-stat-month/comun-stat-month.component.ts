import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { ViewComunService } from 'src/app/discussi/discussio-user/discus/view-comun.service';
import { serverPath } from 'src/app/config/server-config';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-comun-stat-month',
  templateUrl: './comun-stat-month.component.html',
  styleUrls: ['./comun-stat-month.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
  ],
})
export class ComunStatMonthComponent implements OnInit {

  open_consumed: boolean = false;
  openConsumed() {
    this.open_consumed = !this.open_consumed;
  }
  open_tariff: boolean = false;
  openTariff() {
    this.open_tariff = !this.open_tariff;
  }
  open_howmuch_pay: boolean = true;
  openHowmuchPay() {
    this.open_howmuch_pay = !this.open_howmuch_pay;
  }
  open_difference: boolean = true;
  openDifference() {
    this.open_difference = !this.open_difference;
  }
  open_payed: boolean = true;
  openPayed() {
    this.open_payed = !this.open_payed;
  }

  open_table: boolean = true;
  openTable() {
    this.open_table = !this.open_table;
  }

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
  selectedMonthID: { id: number, name: string } = { id: 0, name: '' };

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
  selectedYear: any;
  selectedMonth!: string | null;

  selectedView: any;
  selectedName: string | null | undefined;
  overpaymentText: any;
  currentIndex: number = 0;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private selectedViewComun: ViewComunService,
    private sharedService: SharedService,
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
          this.selectedFlatId = flatId;
          if (flatId) {
            this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
              this.selectedComun = selectedComun || this.selectedComun;
              this.getInfoComun();
            }); this.selectedComun
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
      const response = await this.http.post(serverPath + '/comunal/get/comunalAll', {
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

      utility.difference = (paid - needPay).toFixed(2);
    }

    this.difference = (this.totalNeedPay - this.totalPaid).toFixed(2);
    if (this.difference > 0) {
      this.overpaymentText = 'Борг';
      this.difference = Math.abs(this.difference);
    } else {
      this.overpaymentText = 'Переплата';
      this.difference = Math.abs(this.difference);
    }
  }

  nextMonth() {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    if (this.currentIndex < 11) {
      const previousMonth = this.months[this.currentIndex + 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
    } else if (this.currentIndex === 11) {
      this.currentIndex = 0;
      this.changeMonthService.setSelectedMonth('Січень');
      const yearChange = Number(this.selectedYear) + 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }

  prevMonth(): void {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    if (this.currentIndex > 0) {
      const previousMonth = this.months[this.currentIndex - 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
    } else if (this.currentIndex === 0) {
      this.currentIndex = 11;
      this.changeMonthService.setSelectedMonth('Грудень');
      const yearChange = Number(this.selectedYear) - 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }
}

