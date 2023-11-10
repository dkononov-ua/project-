import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { ViewComunService } from 'src/app/services/view-comun.service';
import { serverPath } from 'src/app/shared/server-config';


@Component({
  selector: 'app-comun-stat-year',
  templateUrl: './comun-stat-year.component.html',
  styleUrls: ['./comun-stat-year.component.scss'],
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
export class ComunStatYearComponent implements OnInit {

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
  loading: boolean = true;
  totalNeedPay: number | undefined;
  totalPaid: number | undefined;
  totalСonsumed: number | undefined;
  totalDifference: number | undefined;
  noInformationMessage: boolean = false;
  selectedFlatId!: string | null;
  selectedComun!: string | null;
  selectedYear!: string | null;
  monthlySum: { [key: string]: any } = {};
  dataLoaded: boolean = false;
  sortField: string = 'id';
  monthlySumData$: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});
  sortedMonthlySumData$: BehaviorSubject<{ [key: string]: any }[]> = new BehaviorSubject<{ [key: string]: any }[]>([]);
  selectedSortOption: any;

  selectedView: any;
  selectedName: string | null | undefined;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private selectedViewComun: ViewComunService,

  ) {
    this.flatInfo = [];
  }

  async ngOnInit(): Promise<void> {
    this.getSelectParam();
    this.loading = false;
    if (this.selectedComun !== null && this.selectedFlatId !== null && this.selectedYear !== null) {
      await this.getInfoComunYear();
      this.dataLoaded = true;
      this.sortedMonthlySumData$.next(Object.values(this.monthlySumData$.value));
      this.sortData();
    } else {
      console.error('Some are missing.');
    }
  }

  async getSelectParam(): Promise<void> {

    this.selectedViewComun.selectedView$.subscribe(async (selectedView: string | null) => {
      this.selectedView = selectedView;
      await this.getInfoComunYear();
      if (this.selectedView) {
        this.selectedFlatId = this.selectedView;
        await this.getInfoComunYear();
        this.sortedMonthlySumData$.next(Object.values(this.monthlySumData$.value));
        this.sortData();
      } else {
        this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
          this.selectedFlatId = flatId;
          if (flatId) {
            await this.getInfoComunYear();
            this.sortedMonthlySumData$.next(Object.values(this.monthlySumData$.value));
            this.sortData();
          }
        });
      }
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });

    this.changeYearService.selectedYear$.subscribe(async (selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
      await this.getInfoComunYear();
      this.sortedMonthlySumData$.next(Object.values(this.monthlySumData$.value));
      this.sortData();
    });
  }

  async getInfoComunYear(): Promise<void> {
    const userJson = localStorage.getItem('user');

    if (this.selectedFlatId && this.selectedYear && userJson) {
      const monthlySum: { [key: string]: any } = {};
      let idCounter = 1;
      let totalNeedPay = 0;
      let totalPaid = 0;
      let totalDifference = 0;
      let totalСonsumed = 0;

      for (const e of this.months) {
        const response = await this.http.post(serverPath + '/comunal/get/comunalAll', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          when_pay_y: this.selectedYear,
          when_pay_m: e.name,
        }).toPromise() as any;

        if (response.comunal !== null && response.comunal !== undefined) {
          for (const comunalData of response.comunal) {
            const key = comunalData.comunal_name;
            if (!monthlySum[key]) {
              monthlySum[key] = {
                id: idCounter++,
                year: comunalData.when_pay_y,
                comunal_name: comunalData.comunal_name,
                total_howmuch_pay: 0,
                total_consumed: 0,
                total_calc_howmuch_pay: 0,
                total_difference: 0,
              };
            }

            monthlySum[key].total_howmuch_pay += parseFloat(comunalData.howmuch_pay);
            monthlySum[key].total_consumed += parseFloat(comunalData.consumed);
            monthlySum[key].total_calc_howmuch_pay += parseFloat(comunalData.calc_howmuch_pay);
            monthlySum[key].total_difference += parseFloat(comunalData.howmuch_pay) - parseFloat(comunalData.calc_howmuch_pay);
          }
        } else {
          this.noInformationMessage = true;
          console.log('No data found for selected month.');
        }
      }

      for (const key in monthlySum) {
        if (monthlySum.hasOwnProperty(key)) {
          const entry = monthlySum[key];
          totalNeedPay += entry.total_calc_howmuch_pay;
          totalСonsumed += entry.total_consumed;
          totalPaid += entry.total_howmuch_pay;
          totalDifference += entry.total_calc_howmuch_pay - entry.total_howmuch_pay;
        }
      }
      this.totalNeedPay = totalNeedPay;
      this.totalPaid = totalPaid;
      this.totalСonsumed = totalСonsumed;
      this.totalDifference = totalDifference;
      this.monthlySumData$.next(monthlySum);
    }
  }

  sortData() {
    const dataArray = Object.values(this.sortedMonthlySumData$.value);
    const sortedDataArray = dataArray.sort((a: any, b: any) => {
      switch (this.selectedSortOption) {
        case 'id':
          return a.id - b.id;
        case 'comunal_name':
          return a.comunal_name.localeCompare(b.comunal_name);
        case 'total_howmuch_pay':
          return b.total_howmuch_pay - a.total_howmuch_pay;
        case 'total_calc_howmuch_pay':
          return b.total_calc_howmuch_pay - a.total_calc_howmuch_pay;
        case 'total_difference':
          return a.total_difference - b.total_difference;
        default:
          return 0;
      }
    });
    const sortedData: { [key: string]: any }[] = sortedDataArray.map(item => item);
    this.sortedMonthlySumData$.next(sortedData);
  }

  sortBy(field: string) {
    this.sortField = field;
    this.sortData();
  }
}

