import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
interface FlatInfo {
  comunal_before: any;
  comunal_now: any;
  howmuch_pay: number;
  about_pay: string | undefined;
  tariff: any;
  consumed: any;
  calc_howmuch_pay: number;
  option_sendData: number;
}
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
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
export class PaymentHistoryComponent implements OnInit {

  comunalServices = [
    { name: "Опалення", unit: "Гкал", imageUrl: "../../assets/comun/teplo.jpg" },
    { name: "Водопостачання", unit: "м3", imageUrl: "../../assets/comun/water.jfif" },
    { name: "Вивіз сміття", unit: "Тариф/внесок", imageUrl: "../../assets/comun/cleaning.jpg" },
    { name: "Електроенергія", unit: "кВт", imageUrl: "../../assets/comun/energy.jpg" },
    { name: "Газопостачання", unit: "м3", imageUrl: "../../assets/comun/gas.jpg" },
    { name: "Управління будинком", unit: "Тариф/внесок", imageUrl: "../../assets/comun/default_services.svg" },
    { name: "Охорона будинку", unit: "Тариф/внесок", imageUrl: "../../assets/comun/ohorona.jpg" },
    { name: "Ремонт під'їзду", unit: "Тариф/внесок", imageUrl: "../../assets/comun/default_services.svg" },
    { name: "Ліфт", unit: "Тариф/внесок", imageUrl: "../../assets/comun/default_services.svg" },
    { name: "Інтернет та телебачення", unit: "Тариф/внесок", imageUrl: "../../assets/comun/internet.jpg" },
    { name: "Домофон", unit: "Тариф/внесок", imageUrl: "../../assets/comun/default_services.svg" },
  ];

  months = [
    { id: 0, name: 'Не обрано' },
    { id: 1, name: 'Січень' },
    { id: 2, name: 'Лютий' },
    { id: 3, name: 'Березень' },
    { id: 4, name: 'Квітень' },
    { id: 5, name: 'Травень' },
    { id: 6, name: 'Червень' },
    { id: 7, name: 'Липень' },
    { id: 8, name: 'Серпень' },
    { id: 9, name: 'Вересень' },
    { id: 10, name: 'Жовтень' },
    { id: 11, name: 'Листопад' },
    { id: 12, name: 'Грудень' }
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
  selectedMonth: any;
  selectedYear: number | undefined;
  public selectedComunal: any | null;
  selectedFlatId!: string | null;
  comunalName: string = '';
  defaultUnit: string = "Тариф/внесок";
  selectedImageUrl: string | null | undefined;
  selectedUnit: string | null | undefined;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.selectedMonth = localStorage.getItem('selectedMonth');
        this.getInfoComun(this.selectedMonth);
        this.getDefaultData();
        this.getInfoFlat();
        this.calculateConsumed();
        this.calculatePay();
      }
    });
  }

  getDefaultData() {
    this.comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;
    const selectedService = this.comunalServices.find(service => service.name === this.comunalName);
    this.selectedUnit = selectedService?.unit ?? this.defaultUnit;
  }

  getInfoFlat() {
    this.dataService.getData().subscribe((data: any) => {
      this.area = data.houseData.param.area;
      this.selectedOption = data.houseData.param.option_flat;
    });
  }

  async getInfoComun(selectedMonth: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const selectedYear = localStorage.getItem('selectedYear');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;

    if (!selectedYear || !userJson) {
      console.log('User not found or selected year is missing.');
      return;
    }

    try {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: comunalName,
        when_pay_y: JSON.parse(selectedYear)
      }).toPromise() as any;

      if (response) {
        localStorage.setItem('comunal_inf', JSON.stringify(response));
        this.selectedYear = JSON.parse(selectedYear);
        this.selectedMonth = selectedMonth ? JSON.parse(selectedMonth) : null;
        const comInf = JSON.parse(localStorage.getItem('comunal_inf')!);

        if (userJson && comInf) {
          const selectMonth = comInf.comunal.find((selectMonth: any) => {
            return selectMonth.when_pay_y === String(this.selectedYear) &&
              selectMonth.when_pay_m === this.selectedMonth &&
              selectMonth.comunal_name === comunalName;
          });

          if (selectMonth) {
            this.flatInfo = selectMonth;
          }
        }
      } else {
        console.error('Response is empty.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  saveInfo(): void {
    const comunal_name = localStorage.getItem('comunal_name');
    const userJson = localStorage.getItem('user');

    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {
      this.http.post('http://localhost:3000/comunal/add/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: JSON.parse(comunal_name!).comunal,
        when_pay_y: JSON.parse(localStorage.getItem('selectedYear')!),
        when_pay_m: JSON.parse(localStorage.getItem('selectedMonth')!),
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
      const nextMonth = this.months[nextMonthIndex].name;
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
          comunal_name: JSON.parse(comunal_name!).comunal,
          when_pay_y: JSON.parse(localStorage.getItem('selectedYear')!),
          when_pay_m: nextMonth,
          comunal: comunalNextMonthData,
        }).subscribe((response: any) => {
          this.disabled = true;
        }, (error: any) => {
          console.error(error);
        });
      }, 500);
    } else {
      console.log('user not found, the form is blocked');
    }
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
      this.flatInfo.consumed = Math.abs(comunalNow - comunalBefore);
      this.calculatePay();
    } else {
      this.flatInfo.consumed = 0;
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
      };
  }
}
