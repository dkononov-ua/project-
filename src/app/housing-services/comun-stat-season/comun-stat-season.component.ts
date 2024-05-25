import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { BehaviorSubject } from 'rxjs';
import { ViewComunService } from 'src/app/discussi/discussio-user/discus/view-comun.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
interface FlatStat {
  totalNeedPay: any;
  totalPaid: number | undefined;
  totalConsumption: number;
  monthAveragePaid: any;
  monthAverageConsumption: any;
  monthAverageNeedPay: any;

}
interface FlatInfo {
  comunal_company: string | undefined;
  comunal_name: string | undefined;
  comunal_address: string | undefined;
  comunal_site: string | undefined;
  comunal_phone: string | undefined;
  iban: string | undefined;
  edrpo: string | undefined;
  personalAccount: string | undefined;
  comunal_before: number | undefined;
  comunal_now: number;
  howmuch_pay: number;
  about_pay: string | undefined;
  tariff: number;
  consumed: number;
  calc_howmuch_pay: number;
  calc_tariff_square: number;
}
@Component({
  selector: 'app-comun-stat-season',
  templateUrl: './comun-stat-season.component.html',
  styleUrls: ['./comun-stat-season.component.scss'],
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
    trigger('columnAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('1200ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})

export class ComunStatSeasonComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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

  comunalServices = [
    { name: "Опалення", unit: "Гкал" },
    { name: "Водопостачання", unit: "м3" },
    { name: "Вивіз сміття", unit: "Тариф/внесок" },
    { name: "Електроенергія", unit: "кВт" },
    { name: "Газопостачання", unit: "м3" },
    { name: "Управління будинком", unit: "Тариф/внесок" },
    { name: "Охорона будинку", unit: "Тариф/внесок" },
    { name: "Ремонт під'їзду", unit: "Тариф/внесок" },
    { name: "Ліфт", unit: "Тариф/внесок" },
    { name: "Інтернет та телебачення", unit: "Тариф/внесок" },
    { name: "Домофон", unit: "Тариф/внесок" },
  ];

  seasonPayments: { season: string; payment: number }[] = [];
  seasonNeedPay: { season: string; needPay: number }[] = [];
  seasonConsumptions: { season: string; consumptions: number }[] = [];

  flatStat: FlatStat = {
    totalNeedPay: 0,
    totalPaid: 0,
    monthAveragePaid: 0,
    totalConsumption: 0,
    monthAverageConsumption: 0,
    monthAverageNeedPay: 0,
  };

  winter: FlatStat | undefined;
  spring: FlatStat | undefined;
  summer: FlatStat | undefined;
  autumn: FlatStat | undefined;
  totalYearStats: FlatStat | undefined;
  option_stat: number = 1;
  activeOption: number = 1;

  maxPaymentsValue: number = 0;
  maxNeedPayValue: number = 0;
  maxConsumptionsValue: number = 0;

  flatInfo: FlatInfo = {
    comunal_company: '',
    comunal_name: '',
    comunal_address: '',
    comunal_site: '',
    comunal_phone: '',
    iban: '',
    edrpo: '',
    personalAccount: '',
    comunal_before: 0,
    comunal_now: 0,
    howmuch_pay: 0,
    about_pay: '',
    tariff: 0,
    consumed: 0,
    calc_howmuch_pay: 0,
    calc_tariff_square: 0,
  };

  @ViewChild('textArea', { static: false })
  disabled: boolean = true;
  disabledNot: boolean = true;
  area: any;
  selectedOption: any;
  tariff_square: any;
  selectSeason: FlatStat | undefined;

  public selectedComunal: any | null;
  loading: boolean = true;
  myChart: any;

  selectedFlatId!: string | null;
  selectedComun!: any;
  selectedYear!: any;
  selectedMonth!: any;

  defaultUnit: string = "Тариф/внесок";
  selectedUnit: string | null | undefined;

  totalNeedPay: number | undefined;
  totalPaid: number | undefined;
  totalСonsumed: number | undefined;
  totalDifference: number | undefined;
  monthlySumData$: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});
  dataForGraph: any[] = [];

  selectedView: any;
  selectedName: string | null | undefined;
  indexPage: number = 0;
  noData: boolean = false;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeYearService: ChangeYearService,
    private selectedViewComun: ViewComunService,
    private sharedService: SharedService,
  ) { this.onChangeYear(); }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    if (this.selectedFlatId !== null) {
      if (this.selectedComun !== null && this.selectedYear !== null) {
        this.getSelectParam()
        this.getDefaultData();
        this.getInfoComunYear();
      } else { }
    } else { }
    this.loading = false;
  }

  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedUnit = selectedService?.unit ?? this.defaultUnit;
  }

  getSelectParam() {
    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
      if (this.selectedView) {
        this.selectedFlatId = this.selectedView;
        this.getDefaultData();
      } else {
        this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
          this.selectedFlatId = flatId;
          if (flatId) {
            this.getDefaultData();
          } else {
            this.selectedFlatId = null;
          }
        });
      }
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });
  }

  onChangeYear() {
    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
      if (this.selectedYear) {
        this.getInfoComunYear();
        this.getDefaultData();
      }
    });
  }

  getInfoFlat() {
    this.dataService.getInfoFlat().subscribe((data: any) => {
      this.area = data.param.area;
      this.selectedOption = data.param.option_flat;
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
        const response = await this.http.post(this.serverPath + '/comunal/get/comunalAll', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          when_pay_y: this.selectedYear,
          when_pay_m: e.name,
        }).toPromise() as any;
        if (response) {
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
            this.monthlySumData$.subscribe(data => {
              this.dataForGraph = Object.values(data);
            });
          }
          this.noData = false;
        } else {
          this.noData = true;
        }
      }

      for (const key in monthlySum) {
        if (monthlySum.hasOwnProperty(key)) {
          const entry = monthlySum[key];
          totalNeedPay += entry.total_howmuch_pay;
          totalСonsumed += entry.total_consumed;
          totalPaid += entry.total_calc_howmuch_pay;
          totalDifference += entry.total_calc_howmuch_pay - entry.total_howmuch_pay;
        }
      }
      this.totalNeedPay = totalNeedPay;
      this.totalPaid = totalPaid;
      this.totalСonsumed = totalСonsumed;
      this.totalDifference = totalDifference;
      this.monthlySumData$.next(monthlySum);
      const maxPaymentsValue = Math.max(...Object.values(monthlySum).map(entry => entry.total_calc_howmuch_pay));
      const maxNeedPayValue = Math.max(...Object.values(monthlySum).map(entry => entry.total_howmuch_pay));
      const maxConsumptionsValue = Math.max(...Object.values(monthlySum).map(entry => entry.total_consumed));
      this.maxPaymentsValue = maxPaymentsValue
      this.maxNeedPayValue = maxNeedPayValue
      this.maxConsumptionsValue = maxConsumptionsValue
    }
  }

  nextYear() {
    if (this.selectedYear) {
      const yearChange = Number(this.selectedYear) + 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }

  prevYear() {
    if (this.selectedYear) {
      const yearChange = Number(this.selectedYear) - 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }
}
