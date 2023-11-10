import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { ViewComunService } from 'src/app/services/view-comun.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';

interface FlatInfo {
  comunal_before: any;
  comunal_now: any;
  howmuch_pay: any;
  about_pay: string | undefined;
  tariff: any;
  consumed: any;
  calc_howmuch_pay: any;
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

  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;


  comunalServices = [
    { name: "Опалення", unit: "Гкал" },
    { name: "Водопостачання", unit: "м3" },
    { name: "Вивіз сміття", unit: "внесок" },
    { name: "Електроенергія", unit: "кВт" },
    { name: "Газопостачання", unit: "м3" },
    { name: "Управління будинком", unit: "внесок" },
    { name: "Охорона будинку", unit: "внесок" },
    { name: "Ремонт під'їзду", unit: "внесок" },
    { name: "Ліфт", unit: "внесок" },
    { name: "Інтернет та телебачення", unit: "внесок" },
    { name: "Домофон", unit: "внесок" },
  ];

  months = [
    { id: '1', name: 'Січень' },
    { id: '2', name: 'Лютий' },
    { id: '3', name: 'Березень' },
    { id: '4', name: 'Квітень' },
    { id: '5', name: 'Травень' },
    { id: '6', name: 'Червень' },
    { id: '7', name: 'Липень' },
    { id: '8', name: 'Серпень' },
    { id: '9', name: 'Вересень' },
    { id: '10', name: 'Жовтень' },
    { id: '11', name: 'Листопад' },
    { id: '12', name: 'Грудень' }
  ];

  flatInfo: FlatInfo = {
    comunal_before: '',
    comunal_now: '',
    howmuch_pay: '',
    about_pay: '',
    tariff: '',
    consumed: '',
    calc_howmuch_pay: '',
    option_sendData: 2,
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
  statusMessage: string | undefined;
  comunImg: any;
  about: boolean = false;
  addAbout() {
    this.about = !this.about;
  }


  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private _dialog: LyDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getInfoFlat();
    this.getSelectParam();
    this.loading = false;
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
      const response = await this.http.post(serverPath + '/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: this.selectedComun,
        when_pay_y: this.selectedYear
      }).toPromise() as any;
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
    if (com_inf && this.selectedComun && this.selectedComun !== 'undefined' && this.selectedYear && this.selectedMonth && com_inf.comunal === undefined) {
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
        this.flatInfo.comunal_before = '',
          this.flatInfo.comunal_now = '',
          this.flatInfo.howmuch_pay = '',
          this.flatInfo.about_pay = '',
          this.flatInfo.tariff = '',
          this.flatInfo.consumed = '',
          this.flatInfo.calc_howmuch_pay = '',
          this.flatInfo.option_sendData = 0,
          this.flatInfo.user_id = '',
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
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        const parsedHouseData = JSON.parse(houseData);
        this.area = parsedHouseData.param.area;
        this.selectedOption = parsedHouseData.param.option_flat;
      } else {
        console.log('немає оселі')
      }
    }
  }

  saveInfo(): void {
    const userJson = localStorage.getItem('user');

    if (userJson && this.selectedFlatId !== undefined) {
      this.http.post(serverPath + '/comunal/add/comunal', {
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

      // const comunal_before = this.flatInfo.comunal_now;
      const selectedMonthIndex = this.months.findIndex((month) => month.name === this.selectedMonth);
      const nextMonthIndex = (selectedMonthIndex + 1) % this.months.length;
      let nextYear = this.selectedYear;
      let nextMonth = this.months[nextMonthIndex].name;

      if (nextMonthIndex === 0) {
        nextYear++;
      }

      const comunalNextMonthData = {
        tariff: this.flatInfo.tariff,
        comunal_before: '',
        comunal_now: '',
        howmuch_pay: '',
        about_pay: '',
        consumed: '',
        calc_howmuch_pay: '',
        calc_tariff_square: '',
        option_sendData: this.flatInfo.option_sendData,
      };

      setTimeout(() => {
        this.http.post(serverPath + '/comunal/add/comunal', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          comunal_name: this.selectedComun,
          when_pay_y: nextYear,
          when_pay_m: nextMonth,
          comunal: comunalNextMonthData,
        }).subscribe((response: any) => {
          if (response.status === 'Данні по комуналці успішно змінені') {
            setTimeout(() => {
              this.statusMessage = 'Збережено';
              setTimeout(() => {
                this.statusMessage = '';
                this.selectComunInfo();
              }, 2500);
            }, 200);
          } else if (response.status === false) {
            setTimeout(() => {
              this.statusMessage = 'Не вдалось зберегти';
              setTimeout(() => {
                this.statusMessage = '';
                this.selectComunInfo();
              }, 1500);
            }, 500);
          }

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

  clearInfo(): void {
    this.flatInfo = {
      comunal_before: undefined,
      comunal_now: undefined,
      howmuch_pay: 0,
      about_pay: undefined,
      tariff: undefined,
      consumed: undefined,
      calc_howmuch_pay: 0,
      option_sendData: 1,
      user_id: undefined,
    };
  }

  prevMonth(): void {
    const currentIndex = this.months.findIndex(month => month.name === this.selectedMonth);
    if (currentIndex > 0) {
      const previousMonth = this.months[currentIndex - 1].name;
      console.log(previousMonth)
      this.changeMonthService.setSelectedMonth(previousMonth);
      this.selectComunInfo();
    }
  }

  nextMonth() {
    const currentIndex = this.months.findIndex(month => month.name === this.selectedMonth);
    if (currentIndex < 11) {
      const previousMonth = this.months[currentIndex + 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
      this.selectComunInfo();
    }
  }

  openCropperDialog(event: Event) {
    this._dialog.open<CropImgComponent, Event>(CropImgComponent, {
      data: event,
      width: 400,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        const blob = this.dataURItoBlob(result.dataURL!);
        const formData = new FormData();

        formData.append('file', blob, result.name!);
        console.log(formData)
        this.onUpload(formData);
      }
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  onUpload(formData: any): void {
    const userJson = localStorage.getItem('user');
    if (!formData) {
      console.log('Файл не обраний. Завантаження не відбудеться.');
      return;
    }
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
    const headers = { 'Accept': 'application/json' };
    this.http.post(serverPath + '/img/uploaduser', formData, { headers }).subscribe(
      (data: any) => {
        if (data.status === 'Збережено') {
          setTimeout(() => {
            this.statusMessage = 'Фото додано';
            setTimeout(() => {
              this.statusMessage = '';
              // this.getInfo();
              this.loading = false;
            }, 1500);
          }, 500);
        } else {
          setTimeout(() => {
            this.statusMessage = 'Помилка завантаження';
            setTimeout(() => {
              // this.getInfo();
              this.statusMessage = '';
              this.loading = false;
            }, 1500);
          }, 500);
        }
      },
      error => console.log(error)
    );
  }

}

