import { ChangeDetectorRef, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../../../../services/comun/change-month.service';
import { ChangeYearService } from '../../../../services/comun/change-year.service';
import { ChangeComunService } from '../../../../services/comun/change-comun.service';
import * as ServerConfig from 'src/app/config/path-config';
import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { CropImg2Component } from 'src/app/components/crop-img2/crop-img2.component';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as ComunConfig from 'src/app/interface/comun';
import * as DateConfig from 'src/app/interface/date';

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
    animations.top1,
    animations.bot,
    animations.swichCard,
    trigger('cardSwipe', [
      transition('void => *', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('left => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(-100%)' })),
      ]),
      transition('right => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})

export class ComunHistoryComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  // імпорт конфігу комунальної компанії
  comunInfo: ComunConfig.HouseComunalCompanyInfo = ComunConfig.HouseComunalCompanyInfoConfig;
  defaultImageUrl = ComunConfig.defaultImageUrl;
  comunalServices = ComunConfig.comunalServices;
  months = DateConfig.months;
  flatInfo: ComunConfig.HouseComunalCounter = ComunConfig.HouseComunalCounterConfig;
  // ***

  month1: boolean = true;
  month2: boolean = false;

  coment: boolean = false;
  allInfoComunal: any;
  toogleComent() {
    this.coment = !this.coment
  }

  deleteComunImg() {
    throw new Error('Method not implemented.');
  }

  isCopiedMessage: string = '';

  selectedImageUrl: string | null | undefined;



  cardSwipeState: string = '';


  area: any;
  selectedOption: any;
  tariff_square: any;

  defaultUnit: string = "Тариф/внесок";
  selectedUnit: string | null | undefined;

  noInformationMessage: boolean = false;
  selectedFlatId!: string | null;
  selectedComun: any;
  selectedYear: any;
  selectedMonth: any;

  comunImg: any;
  about: boolean = false;
  cropped?: string;
  photoData: any;
  selectedFile: any;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  currentIndex: number = 0;
  photoViewing: boolean = false;
  helpInfo: boolean = false;
  copiedData: boolean = false;
  openHelp() {
    this.helpInfo = !this.helpInfo;
  }

  startX = 0;
  card1: boolean = true;
  card2: boolean = false;
  cardDirection: string = 'Discussio';

  isLoadingImg: boolean = false;
  reloadImg: boolean = false;
  showInfo: boolean = true;
  isMobile = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  houseAuthorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private statusMessageService: StatusMessageService,
    private router: Router,
  ) {

    localStorage.removeItem('copiedData');
    const copiedData = localStorage.getItem('copiedData');
    if (copiedData) {
      this.copiedData = true;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectedFlatId();
      await this.checkHouseAuthorization();
    } else {
      this.authorization = false;
    }
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
      })
    );
  }

  async checkHouseAuthorization(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      this.houseAuthorization = true;
      const parsedHouseData = JSON.parse(houseData);
      this.area = parsedHouseData.param.area;
      this.selectedOption = parsedHouseData.param.option_flat;
      if (this.selectedFlatId) {
        await this.getSelectedComun();
        await this.getSelectedYear();
        await this.getSelectedMonth();
      } else {
        this.sharedService.logoutHouse();
      }
    }
  }

  // Підписка на обрану послугу
  async getSelectedComun() {
    this.subscriptions.push(
      this.changeComunService.selectedComun$.pipe(
        switchMap(async (selectedComun: string | null) => {
          this.selectedComun = selectedComun || this.selectedComun;
          this.showInfo = false;
          await this.getComunalYearInfo();
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe()
    );
  }

  // Підписка на обраний рік
  async getSelectedYear() {
    this.subscriptions.push(
      this.changeYearService.selectedYear$.pipe(
        switchMap(async (selectedYear: string | null) => {
          this.selectedYear = selectedYear || new Date().getFullYear().toString();
          this.showInfo = false;
          await this.getComunalYearInfo();
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe()
    );
  }

  // Підписка на обраний місяць
  async getSelectedMonth() {
    this.subscriptions.push(
      this.changeMonthService.selectedMonth$.pipe(
        switchMap((selectedMonth: string | null) => {
          this.selectedMonth = selectedMonth || (new Date().getMonth() + 1).toString();
          this.showInfo = false;
          const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
          if (com_inf && this.selectedComun && this.selectedYear && this.selectedMonth) {
            this.getDefaultData();
            this.getComunalMonthInfo();
          }
          return [];
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe()
    );
  }

  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedUnit = selectedService?.unit ?? this.defaultUnit;
    const selectedServicePhoto = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedServicePhoto?.imageUrl ?? this.defaultImageUrl;
  }

  async getComunalYearInfo(): Promise<any> {
    // console.log('getComunalYearInfo')
    localStorage.setItem('selectedComun', this.selectedComun);
    localStorage.setItem('selectedYear', this.selectedYear);
    localStorage.setItem('selectedMonth', this.selectedMonth);
    const userJson = localStorage.getItem('user');
    if (this.selectedYear && this.selectedComun && userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/comunal/get/comunal', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          comunal_name: this.selectedComun,
          when_pay_y: this.selectedYear
        }).toPromise();
        if (response.status === false) {
          return;
        }
        if (response) {
          localStorage.removeItem('comunal_inf');
          setTimeout(() => {
            localStorage.setItem('comunal_inf', JSON.stringify(response.comunal));
            const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
            if (com_inf) {
              this.allInfoComunal = com_inf;
              this.sortMonth(this.allInfoComunal);
            }
            this.getComunalMonthInfo();
          }, 100);
        } else {
          localStorage.removeItem('comunal_inf');
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  async getComunalMonthInfo(): Promise<void> {
    // console.log('selectMonthInfo')
    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
    if (com_inf) {
      const selectedInfo = com_inf.find((selectMonth: any) => {
        return selectMonth.when_pay_y === this.selectedYear &&
          selectMonth.when_pay_m === this.selectedMonth &&
          selectMonth.comunal_name === this.selectedComun;
      });
      if (selectedInfo) {
        this.noInformationMessage = false;
        this.flatInfo = selectedInfo;
        if (selectedInfo.img) {
          this.comunImg = selectedInfo.img.img
        }
        this.calculateConsumed();
        this.calculatePay();
        setTimeout(() => {
          this.showInfo = true;
        }, 100);
      } else {
        this.noInformationMessage = true;
        this.clearInfo()
        setTimeout(() => {
          this.showInfo = true;
        }, 100);
      }
    } else {
      console.log('No data found in local storage.');
    }
  }

  // Додаю айді до місяця та сотрую їх по порядку
  async sortMonth(data: any): Promise<void> {
    // console.log('sortMonth')
    // Додавання ID місяця до allInfoComunal
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const month = this.months.find(m => m.name === item.when_pay_m);
      if (month) {
        item.month_id = month.id + 1; // Додаємо 1 до айді місяця
      }
    }
    // Сортування за айді місяця
    this.allInfoComunal.sort((a: { month_id: number; }, b: { month_id: number; }) => a.month_id - b.month_id);
  }

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      try {
        const response: any = await this.http.post(this.serverPath + '/comunal/add/comunal', {
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
            this.statusMessageService.setStatusMessage('Збережено');
            setTimeout(() => {
              this.statusMessageService.setStatusMessage('');
              this.getComunalYearInfo();
            }, 1500);
          }, 200);
        } else if (response.status === false) {
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('Не вдалось зберегти');
            this.cropped = undefined;
            setTimeout(() => {
              this.statusMessageService.setStatusMessage('');
              this.getComunalYearInfo();
            }, 1500);
          }, 500);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Авторизуйтесь');
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
    }
  }

  copy(): void {
    localStorage.setItem('copiedData', JSON.stringify(this.flatInfo));
    setTimeout(() => {
      this.statusMessageService.setStatusMessage('Скопійовано');
      this.copiedData = true;
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
      }, 1000);
    })
  }

  paste(): void {
    const copiedData = localStorage.getItem('copiedData');
    if (copiedData) {
      this.statusMessageService.setStatusMessage('Заповнено');
      const parsedData: ComunConfig.HouseComunalCounter = JSON.parse(copiedData);
      this.flatInfo = { ...parsedData };
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
      }, 1000);
    } else {
      this.statusMessageService.setStatusMessage('Помилка');
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
      }, 1000);
    }
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
      this.http.post(this.serverPath + '/img/uploadcomunal', photoData, { headers }).subscribe(
        (uploadResponse: any) => {
          if (uploadResponse.status === 'Збережено') {
            this.saveInfo();
            setTimeout(() => {
              this.statusMessageService.setStatusMessage("Додано до показників");
              setTimeout(() => {
                this.statusMessageService.setStatusMessage('');
              }, 1500);
            }, 1000);
          } else {
            setTimeout(() => {
              this.statusMessageService.setStatusMessage('Дані не збережено');
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

  pickMonth(month: string, year: string) {
    this.changeYearService.setSelectedYear((year).toString());
    if (year) {
      this.changeMonthService.setSelectedMonth(month);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

