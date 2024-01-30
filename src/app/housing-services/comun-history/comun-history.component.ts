import { ChangeDetectorRef, Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import { ViewComunService } from 'src/app/discussi/discussio-user/discus/view-comun.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat, serverPathPhotoComunal } from 'src/app/config/server-config';
import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { GalleryComponent } from 'src/app/components/gallery/gallery.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CropImg2Component } from 'src/app/components/crop-img2/crop-img2.component';
import { auto } from '@popperjs/core';
import { animations } from '../../interface/animation';

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
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class ComunHistoryComponent implements OnInit {
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  serverPathPhotoComunal = serverPathPhotoComunal;
  isCopiedMessage: string = '';

  comunalServicesPhoto = [
    { name: "Опалення", imageUrl: "../../../assets/example-comun/comun_cat3.jpg" },
    { name: "Водопостачання", imageUrl: "../../../assets/example-comun/water.jfif" },
    { name: "Вивіз сміття", imageUrl: "../../../assets/example-comun/car_scavenging3.jpg" },
    { name: "Електроенергія", imageUrl: "../../../assets/example-comun/comun_rozetka1.jpg" },
    { name: "Газопостачання", imageUrl: "../../../assets/example-comun/gas_station4.jpg" },
    { name: "Комунальна плата за утримання будинку", imageUrl: "../../../assets/example-comun/default_services.svg" },
    { name: "Охорона будинку", imageUrl: "../../../assets/example-comun/ohorona.jpg" },
    { name: "Ремонт під'їзду", imageUrl: "../../../assets/example-comun/default_services.svg" },
    { name: "Ліфт", imageUrl: "../../../assets/example-comun/default_services.svg" },
    { name: "Інтернет та телебачення", imageUrl: "../../../assets/example-comun/internet.jpg" },
  ];

  selectedImageUrl: string | null | undefined;
  defaultImageUrl: string = "../../../assets/example-comun/default_services.svg";

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



  months: { id: number, name: string }[] = [
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
    comunal_before: '',
    comunal_now: '',
    howmuch_pay: '',
    about_pay: '',
    tariff: '',
    consumed: '',
    calc_howmuch_pay: '',
    option_sendData: 0,
    user_id: '',
  };

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;
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
  selectedMonthID: { id: number, name: string } = { id: 0, name: '' };
  statusMessage: string | undefined;
  comunImg: any;
  about: boolean = false;
  cropped?: string;
  photoData: any;
  selectedFile: any;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  currentIndex: number = 0;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private _dialog: LyDialog,
    private dialog: MatDialog,
    private _cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCurrentIndex();
    this.getInfoFlat();
    this.getSelectParam();
    this.loading = false;
  }

  async getCurrentIndex() {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
  }

  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedUnit = selectedService?.unit ?? this.defaultUnit;
    const selectedServicePhoto = this.comunalServicesPhoto.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedServicePhoto?.imageUrl ?? this.defaultImageUrl;
  }

  getComunalImg(): void {
    const selectedService = this.comunalServicesPhoto.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedService?.imageUrl || this.defaultImageUrl;
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
      this.selectComunInfo();
      this.getDefaultData();
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
        if (selectedInfo.img) {
          this.comunImg = selectedInfo.img.img;
        } else {
          this.comunImg = '';
        }
      } else {
        this.noInformationMessage = true;
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
        this.flatInfo.comunal_before = '';
        this.flatInfo.comunal_now = '';
        this.flatInfo.howmuch_pay = '';
        this.flatInfo.about_pay = '';
        this.flatInfo.tariff = '';
        this.flatInfo.consumed = '';
        this.flatInfo.calc_howmuch_pay = '';
        this.flatInfo.option_sendData = 0;
        this.flatInfo.user_id = '';
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
      }
    }

    if (!com_inf) {
      console.log('No data found in local storage.');
    }
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

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {

      try {
        const response: any = await this.http.post(serverPath + '/comunal/add/comunal', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          comunal_name: this.selectedComun,
          when_pay_y: this.selectedYear,
          when_pay_m: this.selectedMonth,
          comunal: this.flatInfo,
        }).toPromise();

        if (response.status === 'Данні по комуналці успішно змінені') {
          setTimeout(() => {
            this.cropped = undefined;
            this.statusMessage = 'Збережено';
            setTimeout(() => {
              this.statusMessage = '';
              this.selectComunInfo();
            }, 2500);
          }, 200);
        } else if (response.status === false) {
          setTimeout(() => {
            this.statusMessage = 'Не вдалось зберегти';
            this.cropped = undefined;
            setTimeout(() => {
              this.statusMessage = '';
              this.selectComunInfo();
            }, 1500);
          }, 500);
        }

      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    } else {
      this.loading = false;
      console.log('Авторизуйтесь');
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
    setTimeout(() => {
      this.statusMessage = 'Скопійовано';
      setTimeout(() => {
        this.statusMessage = '';
      }, 2500);
    })
  }

  paste(): void {
    const copiedData = localStorage.getItem('copiedData');
    if (copiedData) {
      this.statusMessage = 'Заповнено';
      const parsedData: FlatInfo = JSON.parse(copiedData);
      this.flatInfo = { ...parsedData };
      setTimeout(() => {
        this.statusMessage = '';
      }, 2500);
    } else {
      this.statusMessage = 'Помилка';
      setTimeout(() => {
        this.statusMessage = '';
      }, 1500);
    }
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  clearInfo(): void {
    this.comunImg = '';
    this.flatInfo = {
      comunal_before: 0,
      comunal_now: 0,
      howmuch_pay: 0,
      about_pay: '',
      tariff: 0,
      consumed: 0,
      calc_howmuch_pay: 0,
      option_sendData: 0,
      user_id: '',
    };
  }



  openFullScreenImage(photos: string): void {
    const sanitizedPhotos: SafeUrl = (this.sanitizer.bypassSecurityTrustUrl(serverPathPhotoComunal + photos)
    );
    const dialogRef = this.dialog.open(GalleryComponent, {
      data: {
        photos: sanitizedPhotos,
        place: 'comun',
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  closeFullScreenImage(): void {
    this.showFullScreenImage = false;
    this.fullScreenImageUrl = '';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  openCropperDialog(event: Event) {
    this._dialog.open<CropImg2Component, Event>(CropImg2Component, {
      data: event,
      width: 400,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        this.cropped = result.dataURL;
        this._cd.markForCheck();
        const blob = this.dataURItoBlob(result.dataURL!);
        const photoData = new FormData();
        photoData.append('file', blob, result.name!);
        this.photoData = photoData;
        this.saveObject();
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

  saveObject(): void {
    const photoData = this.photoData;
    const userJson = localStorage.getItem('user');
    const data = {
      comunal_name: this.selectedComun,
      when_pay_y: this.selectedYear,
      when_pay_m: this.selectedMonth,
      flat_id: this.selectedFlatId,
    };
    if (photoData && userJson && data) {
      photoData.append("inf", JSON.stringify(data));
      photoData.append('auth', userJson!);
      const headers = { 'Accept': 'application/json' };
      this.http.post(serverPath + '/img/uploadcomunal', photoData, { headers }).subscribe(
        (uploadResponse: any) => {
          if (uploadResponse.status === 'Збережено') {
            this.saveInfo();
            setTimeout(() => {
              this.statusMessage = "Додано до показників";
              setTimeout(() => {
                this.statusMessage = '';
              }, 1500);
            }, 1000);
          } else {
            setTimeout(() => {
              this.statusMessage = 'Дані не збережено';
            }, 2000);
          }
        },
        (uploadError: any) => {
          console.log(uploadError);
        }
      );
    } else {
      console.log('Внесіть данні')
    }
  }

  nextMonth() {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    if (this.currentIndex < 11) {
      this.clearInfo();
      const previousMonth = this.months[this.currentIndex + 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
      this.selectComunInfo();
      this.getDefaultData();
    }
  }

  prevMonth(): void {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    if (this.currentIndex > 0) {
      this.clearInfo();
      const previousMonth = this.months[this.currentIndex - 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
      this.selectComunInfo();
      this.getDefaultData();
    }
  }
}

