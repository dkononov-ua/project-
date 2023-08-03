import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject, debounceTime } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface FlatStat {
  totalPaid: number | undefined;
  totalConsumption: number;
  monthAveragePaid: any;
  monthAverageConsumption: any;
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
  selector: 'app-comun-statistics',
  templateUrl: './comun-statistics.component.html',
  styleUrls: ['./comun-statistics.component.scss'],
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
export class ComunStatisticsComponent implements OnInit {

  flatStat: FlatStat = {
    totalPaid: 0,
    monthAveragePaid: 0,
    totalConsumption: 0,
    monthAverageConsumption: 0,
  };

  winter: FlatStat | undefined;
  spring: FlatStat | undefined;
  summer: FlatStat | undefined;
  autumn: FlatStat | undefined;
  totalYearStats: FlatStat | undefined;

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
  selectedMonth: any;
  selectedYear!: number;
  public selectedComunal: any | null;
  selectedFlatId!: string | null;
  loading: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dataService: DataService,
    private http: HttpClient,
    private hostComunComponent: HostComunComponent,
    private selectedFlatService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getInfoComun()
          .then(() => {
            this.getInfoFlat();
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error', error);
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    });
  }

  getInfoFlat() {
    this.dataService.getData().subscribe((data: any) => {
      this.area = data.houseData.param.area;
      this.selectedOption = data.houseData.param.option_flat;
    });
  }

  async getInfoComun(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const selectedYear = localStorage.getItem('selectedYear');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;

    if (selectedYear && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: comunalName,
        when_pay_y: JSON.parse(selectedYear)
      }).toPromise() as any;

      if (response) {
        localStorage.setItem('comunal_inf', JSON.stringify(response));
        this.selectedYear = selectedYear ? JSON.parse(selectedYear) : null;
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

          this.totalYearStats = this.allSeasonStats([winterStats, springStats, summerStats, autumnStats]);
        }
      } else {
        console.error(false);
      }
    } else {
      console.log('user not found');
    }
  }

  allSeasonStats(seasonStats: FlatStat[]): FlatStat {
    let totalPaid = 0;
    let totalMonthAveragePaid = 0;
    let totalConsumption = 0;
    let totalMonthAverageConsumption = 0;

    for (const seasonStat of seasonStats) {
      totalPaid += seasonStat.totalPaid!;
      totalMonthAveragePaid += seasonStat.monthAveragePaid * seasonStat.totalPaid!;
      totalConsumption += seasonStat.totalConsumption;
      totalMonthAverageConsumption += seasonStat.monthAverageConsumption * seasonStat.totalConsumption;
    }

    const monthAveragePaid = (totalMonthAveragePaid / totalPaid).toFixed(2);
    const monthAverageConsumption = (totalMonthAverageConsumption / totalConsumption).toFixed(2);

    return {
      totalPaid,
      monthAveragePaid: Number(monthAveragePaid),
      totalConsumption,
      monthAverageConsumption: Number(monthAverageConsumption),
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

    const totalPaid = filteredMonth.reduce((total: number, data: any) => total + Number(data.howmuch_pay), 0);
    const totalConsumption = filteredMonth.reduce((total: number, data: any) => total + Number(data.consumed), 0);

    // підрахунок середнє оплата по місяцю
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

    const seasonStats: FlatStat = {
      totalPaid,
      totalConsumption,
      monthAveragePaid: monthAveragePaid.toFixed(2),
      monthAverageConsumption: monthAverageConsumption.toFixed(2),
    };
    return seasonStats;
  }

}
