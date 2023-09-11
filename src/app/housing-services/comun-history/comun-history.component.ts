import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { ViewComunService } from 'src/app/services/view-comun.service';
interface FlatInfo {
  comunal_before: any;
  comunal_now: any;
  howmuch_pay: number;
  about_pay: string | undefined;
  tariff: any;
  consumed: any;
  calc_howmuch_pay: number;
  option_sendData: number;
  user_id: string | undefined;
}
@Component({
  selector: 'app-comun-history',
  templateUrl: './comun-history.component.html',
  styleUrls: ['./comun-history.component.scss'],
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
export class ComunHistoryComponent implements OnInit {

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

  flatInfo: FlatInfo = {
    comunal_before: 0,
    comunal_now: 0,
    howmuch_pay: 0,
    about_pay: '',
    tariff: 0,
    consumed: 0,
    calc_howmuch_pay: 0,
    option_sendData: 1,
    user_id: '',
  };

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;
  disabled: boolean = true;
  disabledNot: boolean = true;
  area: any;
  selectedOption: any;
  tariff_square: any;
  houses: { id: number, name: string }[] = [];
  defaultUnit: string = "Тариф/внесок";
  selectedUnit: string | null | undefined;
  noInformationMessage: boolean = false;

  selectedFlatId!: string | null;
  selectedComun: any;
  selectedYear: any;
  selectedMonth: any;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSelectParam();
    this.loading = false;
    if (this.selectedFlatId && this.selectedYear && this.selectedMonth && this.selectedComun !== 'undefined' && this.selectedComun) {
      await this.getComunalYearInfo();
      await this.selectMonthInfo();
      this.getDefaultData();
      this.getInfoFlat();
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
      this.selectComunInfo();
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
      this.getComunalYearInfo();
    });

    this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
      this.selectedMonth = selectedMonth || this.selectedMonth;
      if (this.selectedFlatId && this.selectedYear && this.selectedMonth && this.selectedComun !== 'undefined' && this.selectedComun) {
        this.selectMonthInfo();
        this.getDefaultData();
        this.getInfoFlat();
        this.calculateConsumed();
        this.calculatePay();
      }
    });
  }

  async getComunalYearInfo(): Promise<any> {
    localStorage.setItem('selectedComun', this.selectedComun);
    localStorage.setItem('selectedYear', this.selectedYear);
    localStorage.setItem('selectedMonth', this.selectedMonth);
    const userJson = localStorage.getItem('user');
    if (this.selectedYear && this.selectedComun && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: this.selectedComun,
        when_pay_y: this.selectedYear
      }).toPromise() as any;
      console.log(response)
      if (response.status === false) {
        console.log('Немає послуг');
        return;
      }

      if (response) {
        localStorage.setItem('comunal_inf', JSON.stringify(response.comunal));
        this.selectMonthInfo();
      }
    }
  }

  async selectComunInfo(): Promise<void> {
    await this.getComunalYearInfo()
    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
    this.selectMonthInfo();

    if (com_inf && this.selectedComun && this.selectedComun !== 'undefined' && this.selectedYear && this.selectedMonth && com_inf.comunal === undefined) {
      const selectedInfo = com_inf.find((selectMonth: any) => {
        return selectMonth.comunal_name === this.selectedComun
          && selectMonth.when_pay_y === this.selectedYear
          && selectMonth.when_pay_m === this.selectedMonth;
      });
      if (selectedInfo) {
        this.noInformationMessage = false;
        this.flatInfo = selectedInfo;
      } else {
        this.noInformationMessage = true;
        console.log('No data found for selected month.');
      }

    } else if (com_inf !== null && this.selectedComun !== null && this.selectedYear !== null && this.selectedMonth !== null && com_inf.comunal !== undefined) {
      const selectedInfo = com_inf.comunal.find((selectMonth: any) => {
        return selectMonth.comunal_name === this.selectedComun
          && selectMonth.when_pay_y === this.selectedYear
          && selectMonth.when_pay_m === this.selectedMonth;
      });
      if (selectedInfo) {
        this.noInformationMessage = false;
        this.flatInfo = selectedInfo;
      } else {
        this.noInformationMessage = true;
        console.log('No data found for selected month.');
      }
    }

    if (!com_inf) {
      console.log('No data found in local storage.');
    }
  }

  async selectMonthInfo(): Promise<void> {
    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
    if (com_inf && this.selectedComun && this.selectedComun !== 'undefined' &&  this.selectedYear && this.selectedMonth && com_inf.comunal === undefined) {
      const selectedInfo = com_inf.find((selectMonth: any) => {
        return selectMonth.when_pay_y === this.selectedYear &&
          selectMonth.when_pay_m === this.selectedMonth &&
          selectMonth.comunal_name === this.selectedComun;
      });
      if (selectedInfo) {
        this.noInformationMessage = false;
        this.flatInfo = selectedInfo;
        this.getDefaultData();
        this.getInfoFlat();
        this.calculateConsumed();
        this.calculatePay();
      } else {
        this.noInformationMessage = true;
        console.log('No data found for selected month.');
      }
    } else if (com_inf !== null && this.selectedComun !== null && this.selectedYear !== null && this.selectedMonth !== null && com_inf.comunal !== undefined) {
      const selectedInfo = com_inf.comunal.find((selectMonth: any) => {
        return selectMonth.when_pay_y === this.selectedYear &&
          selectMonth.when_pay_m === this.selectedMonth &&
          selectMonth.comunal_name === this.selectedComun;
      });
      if (selectedInfo) {
        this.noInformationMessage = false;
        this.flatInfo = selectedInfo;
        this.getDefaultData();
        this.getInfoFlat();
        this.calculateConsumed();
        this.calculatePay();
      } else {
        this.noInformationMessage = true;
        console.log('No data found for selected month.');
      }
    }

    if (!com_inf) {
      console.log('No data found in local storage.');
    }
  }


  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedUnit = selectedService?.unit ?? this.defaultUnit;
  }

  getInfoFlat() {
    this.dataService.getData().subscribe((data: any) => {
      this.area = data.houseData.param.area;
      this.selectedOption = data.houseData.param.option_flat;
    });
  }

  saveInfo(): void {
    const userJson = localStorage.getItem('user');

    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {
      this.http.post('http://localhost:3000/comunal/add/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: this.selectedComun,
        when_pay_y: this.selectedYear,
        when_pay_m: this.selectedMonth,
        comunal: this.flatInfo,
      })
        .subscribe((response: any) => {
          this.disabled = true;
        }, (error: any) => {
          console.error(error);
        });

      const comunal_before = this.flatInfo.comunal_now;
      const selectedMonthIndex = this.months.findIndex((month) => month.name === this.selectedMonth);
      const nextMonthIndex = (selectedMonthIndex + 1) % this.months.length;
      let nextYear = this.selectedYear;
      let nextMonth = this.months[nextMonthIndex].name;

      if (nextMonthIndex === 0) {
        nextYear++;
      }

      const comunalNextMonthData = {
        tariff: this.flatInfo.tariff,
        comunal_before: comunal_before,
        comunal_now: 0,
        howmuch_pay: 0,
        about_pay: '',
        consumed: 0,
        calc_howmuch_pay: 0,
        calc_tariff_square: 0,
        option_sendData: this.flatInfo.option_sendData,
      };

      setTimeout(() => {
        this.http.post('http://localhost:3000/comunal/add/comunal', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          comunal_name: this.selectedComun,
          when_pay_y: nextYear,
          when_pay_m: nextMonth,
          comunal: comunalNextMonthData,
        }).subscribe((response: any) => {
          localStorage.removeItem('comunal_inf');
          this.disabled = true;
          this.loading = true;
          this.reloadPageWithLoader();
        }, (error: any) => {
          console.error(error);
        });
      }, 100);
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flatInfo'] && !changes['flatInfo'].firstChange) {
      this.calculatePay();
    }
  }

  calculateConsumed(): void {
    const comunalNow = parseFloat(this.flatInfo.comunal_now);
    const comunalBefore = parseFloat(this.flatInfo.comunal_before);

    if (!isNaN(comunalNow) && !isNaN(comunalBefore)) {
      this.flatInfo.consumed = Math.abs(comunalNow - comunalBefore).toFixed(2);
      this.calculatePay();
    } else {
      this.flatInfo.consumed = '0.00';
      this.calculatePay();
    }
  }

  calculatePay(): void {
    if (this.flatInfo.option_sendData === 1) {
      const tariff = parseFloat(this.flatInfo.tariff);
      const consumed = parseFloat(this.flatInfo.consumed);

      if (!isNaN(tariff) && !isNaN(consumed)) {
        this.flatInfo.calc_howmuch_pay = tariff * consumed;
      } else {
        this.flatInfo.calc_howmuch_pay = 0;
      }

    } else if (this.flatInfo.option_sendData === 2) {
      const tariff = parseFloat(this.flatInfo.tariff);

      if (!isNaN(tariff) && this.area !== undefined) {
        this.flatInfo.calc_howmuch_pay = tariff * this.area;
      } else {
        this.flatInfo.calc_howmuch_pay = 0;
      }

    } else if (this.flatInfo.option_sendData === 3) {
      const tariff = parseFloat(this.flatInfo.tariff);

      if (!isNaN(tariff)) {
        this.flatInfo.calc_howmuch_pay = tariff;
      } else {
        this.flatInfo.calc_howmuch_pay = 0;
      }

    } else { }
  }

  copy(): void {
    localStorage.setItem('copiedData', JSON.stringify(this.flatInfo));
    console.log('Data copied successfully!');
  }

  paste(): void {
    const copiedData = localStorage.getItem('copiedData');
    if (copiedData) {
      const parsedData: FlatInfo = JSON.parse(copiedData);
      this.flatInfo = { ...parsedData };
      console.log('Data pasted successfully!');
    } else {
      console.log('No data found to paste.');
    }
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    if (this.disabled === false)
      this.flatInfo = {
        comunal_before: 0,
        comunal_now: 0,
        howmuch_pay: 0,
        about_pay: '',
        tariff: 0,
        consumed: 0,
        calc_howmuch_pay: 0,
        option_sendData: 1,
        user_id: '',
      };
  }
}

