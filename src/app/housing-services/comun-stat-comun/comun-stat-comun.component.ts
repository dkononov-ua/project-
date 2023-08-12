import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';

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
  selector: 'app-comun-stat-comun',
  templateUrl: './comun-stat-comun.component.html',
  styleUrls: ['./comun-stat-comun.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('columnAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(50%)', opacity: 0 }),
        animate('800ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ComunStatComunComponent implements OnInit {

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
  option_stat: number = 2;
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

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeYearService: ChangeYearService,
  ) { }

  ngOnInit(): void {
    if (this.selectedFlatId !== null) {
      this.getSelectParam()
      if (this.selectedComun !== null && this.selectedYear !== null) {
        this.getInfoComun()
          .then(() => {
            this.getDefaultData();
            this.updateMaxPaymentsValue();
            this.updateMaxNeedPayValue();
            this.updateMaxConsumptionsValue();
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error', error);
            this.loading = false;
          });
      } else {
        console.log('Не обрані комунальні або рік')
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedUnit = selectedService?.unit ?? this.defaultUnit;
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
      this.getInfoComun();
      this.getDefaultData();
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
      this.getInfoComun();
      this.getDefaultData();
    });
  }

  updateMaxPaymentsValue(): void {
    if (this.seasonPayments.length > 0) {
      this.maxPaymentsValue = Math.max(...this.seasonPayments.map(season => season.payment));
    }
  }

  updateMaxNeedPayValue(): void {
    if (this.seasonNeedPay.length > 0) {
      this.maxNeedPayValue = Math.max(...this.seasonNeedPay.map(season => season.needPay));
    }
  }

  updateMaxConsumptionsValue(): void {
    if (this.seasonConsumptions.length > 0) {
      this.maxConsumptionsValue = Math.max(...this.seasonConsumptions.map(season => season.consumptions));
    }
  }

  getInfoFlat() {
    this.dataService.getData().subscribe((data: any) => {
      this.area = data.houseData.param.area;
      this.selectedOption = data.houseData.param.option_flat;
    });
  }

  async getInfoComun(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedYear && this.selectedComun && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: this.selectedComun,
        when_pay_y: this.selectedYear
      }).toPromise() as any;

      if (response) {
        localStorage.setItem('comunal_inf', JSON.stringify(response));
        this.selectedYear ? this.selectedYear : null;
        const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);

        if (userJson && com_inf) {

          const winterStats = this.getSeasonStatistics(this.selectedYear, com_inf, "winter");
          this.winter = winterStats;

          const springStats = this.getSeasonStatistics(this.selectedYear, com_inf, "spring");
          this.spring = springStats;

          const summerStats = this.getSeasonStatistics(this.selectedYear, com_inf, "summer");
          this.summer = summerStats;

          const autumnStats = this.getSeasonStatistics(this.selectedYear, com_inf, "autumn");
          this.autumn = autumnStats;

          this.seasonPayments = [
            { season: 'Зима', payment: this.winter?.totalPaid! },
            { season: 'Весна', payment: this.spring?.totalPaid! },
            { season: 'Літо', payment: this.summer?.totalPaid! },
            { season: 'Осінь', payment: this.autumn?.totalPaid! },
          ];

          this.seasonNeedPay = [
            { season: 'Зима', needPay: this.winter?.totalNeedPay! },
            { season: 'Весна', needPay: this.spring?.totalNeedPay! },
            { season: 'Літо', needPay: this.summer?.totalNeedPay! },
            { season: 'Осінь', needPay: this.autumn?.totalNeedPay! },
          ];

          this.seasonConsumptions = [
            { season: 'Зима', consumptions: this.winter?.totalConsumption! },
            { season: 'Весна', consumptions: this.spring?.totalConsumption! },
            { season: 'Літо', consumptions: this.summer?.totalConsumption! },
            { season: 'Осінь', consumptions: this.autumn?.totalConsumption! },
          ];

          this.totalYearStats = this.allSeasonStats([winterStats, springStats, summerStats, autumnStats]);
        }
      } else {
        console.error(false);
      }
    } else {
      console.log('comun not found');
    }
  }

  allSeasonStats(seasonStats: FlatStat[]): FlatStat {
    let totalPaid = 0;
    let totalNeedPay = 0;
    let totalMonthAveragePaid = 0;
    let totalConsumption = 0;
    let totalMonthAverageConsumption = 0;
    let totalMonthAverageNeedPay = 0;

    for (const seasonStat of seasonStats) {
      totalPaid += seasonStat.totalPaid!;
      totalNeedPay += seasonStat.totalNeedPay!;
      totalMonthAveragePaid += seasonStat.monthAveragePaid * seasonStat.totalPaid!;
      totalConsumption += seasonStat.totalConsumption;
      totalMonthAverageConsumption += seasonStat.monthAverageConsumption * seasonStat.totalConsumption;
      totalMonthAverageNeedPay += seasonStat.monthAverageNeedPay * seasonStat.totalNeedPay;
    }

    const monthAveragePaid = totalPaid !== 0 ? (totalMonthAveragePaid / totalPaid).toFixed(2) : '0.00';
    const monthAverageConsumption = totalConsumption !== 0 ? (totalMonthAverageConsumption / totalConsumption).toFixed(2) : '0.00';
    const monthAverageNeedPay = totalNeedPay !== 0 ? (totalMonthAverageNeedPay / totalNeedPay).toFixed(2) : '0.00';

    return {
      totalPaid,
      totalNeedPay: parseFloat(totalNeedPay.toFixed(2)),
      monthAveragePaid: parseFloat(monthAveragePaid),
      totalConsumption,
      monthAverageConsumption: parseFloat(monthAverageConsumption),
      monthAverageNeedPay: parseFloat(monthAverageNeedPay),
    };
  }

  getSeasonStatistics(selectedYear: number, com_inf: any, season: string): FlatStat {
    const seasonMonths: { [key: string]: string[] } = {
      'winter': ['Грудень', 'Січень', 'Лютий'],
      'spring': ['Березень', 'Квітень', 'Травень'],
      'summer': ['Червень', 'Липень', 'Серпень'],
      'autumn': ['Вересень', 'Жовтень', 'Листопад'],
    };

    const allMonth = com_inf.comunal.filter((data: any) => {
      return data.when_pay_y === String(selectedYear);
    });

    const filteredMonth = com_inf.comunal.filter((data: any) => {
      return data.when_pay_y === String(selectedYear) && seasonMonths[season].includes(data.when_pay_m);
    });

    // сплата
    const totalPaid = filteredMonth.reduce((total: number, data: any) => total + Number(data.howmuch_pay), 0);
    // споживання
    const totalConsumption = filteredMonth.reduce((total: number, data: any) => total + Number(data.consumed), 0);
    // нарахування
    const totalNeedPay = filteredMonth.reduce((total: number, data: any) => total + Number(data.calc_howmuch_pay), 0);

    // підрахунок середнє сплата по місяцю
    const nonZeroPaid = allMonth.filter((data: any) => Number(data.howmuch_pay) !== 0);
    const totalPaidMonth = nonZeroPaid.reduce((total: number, data: any) => {
      return total + Number(data.howmuch_pay);
    }, 0);
    const monthAveragePaid = totalPaidMonth / nonZeroPaid.length;

    // підрахунок середнє споживання по місяцю
    const nonZeroConsumed = allMonth.filter((data: any) => Number(data.consumed) !== 0);
    const totalConsumedMonth = nonZeroConsumed.reduce((total: number, data: any) => {
      return total + Number(data.consumed);
    }, 0);
    const monthAverageConsumption = totalConsumedMonth / nonZeroConsumed.length;

    // підрахунок середнє нарахування по місяцю
    const nonZeroNeedPay = allMonth.filter((data: any) => Number(data.calc_howmuch_pay) !== 0);
    const totalNeedPayMonth = nonZeroNeedPay.reduce((total: number, data: any) => {
      return total + Number(data.calc_howmuch_pay);
    }, 0);
    const monthAverageNeedPay = totalNeedPayMonth / nonZeroNeedPay.length;
    const seasonStats: FlatStat = {
      totalPaid,
      totalNeedPay,
      totalConsumption,
      monthAveragePaid: monthAveragePaid.toFixed(2),
      monthAverageConsumption: monthAverageConsumption.toFixed(2),
      monthAverageNeedPay,
    };
    return seasonStats;
  }

}

