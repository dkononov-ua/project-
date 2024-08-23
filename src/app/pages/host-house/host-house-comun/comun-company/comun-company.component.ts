import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeComunService } from '../../../../services/comun/change-comun.service';
import { ChangeMonthService } from '../../../../services/comun/change-month.service';
import { ChangeYearService } from '../../../../services/comun/change-year.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import * as ComunConfig from 'src/app/interface/comun';
import { StatusMessageService } from 'src/app/services/status-message.service';
@Component({
  selector: 'app-comun-company',
  templateUrl: './comun-company.component.html',
  styleUrls: ['./comun-company.component.scss'],
  animations: [animations.top1],
})
export class ComunCompanyComponent implements OnInit, OnDestroy {

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
  // ***

  showInput = false;
  isCopiedMessage: string = '';
  clickShowInput() {
    this.showInput = !this.showInput;
  }

  selectedImageUrl: string | null | undefined;
  selectedFlatId: string | null | undefined;
  selectedComun: any;
  selectedYear: any;
  selectedMonth: any;

  field: boolean = true;
  toggleField() {
    this.field = !this.field;
  }

  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private sharedService: SharedService,
    private statusMessageService: StatusMessageService,
  ) { }

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
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      if (this.selectedFlatId) {
        this.getSelectedComun();
        this.getSelectedYear();
        this.getSelectedMonth();
      } else {
        this.sharedService.logoutHouse();
      }
    }
  }

  // Підписка на обрану послугу
  async getSelectedComun() {
    this.subscriptions.push(
      this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
        this.selectedComun = selectedComun || this.selectedComun;
        if (this.selectedFlatId && this.selectedComun) {
          this.getComunalInfo();
          this.getComunalImg();
        } else {
          this.getDefaultData();
        }
      })
    );
  }

  // Підписка на обраний рік
  async getSelectedYear() {
    this.subscriptions.push(
      this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
        this.selectedYear = selectedYear || this.selectedYear;
      })
    );
  }

  // Підписка на обраний місяць
  async getSelectedMonth() {
    this.subscriptions.push(
      this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
        this.selectedMonth = selectedMonth || this.selectedMonth;
      })
    );
  }

  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedService?.imageUrl ?? this.defaultImageUrl;
  }

  getComunalImg(): void {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedService?.imageUrl || this.defaultImageUrl;
  }

  async getComunalInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      comunal_name: this.selectedComun,
    }
    if (userJson && this.selectedComun && this.selectedComun !== undefined && this.selectedComun !== null) {
      try {
        const response: any = await this.http.post(this.serverPath + '/comunal/get/button', data).toPromise();
        if (response.status === false) {
          return;
        }
        const filteredData = response.comunal.filter((item: any) => item.comunal_name === this.selectedComun);
        if (filteredData.length > 0) {
          this.comunInfo = filteredData[0];
        } else {
          console.log('No data found for the specified comunal_name.');
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      comunal_name: this.selectedComun,
      when_pay_y: this.selectedYear,
      when_pay_m: this.selectedMonth,
      comunal: this.comunInfo,
    }
    if (userJson && data) {
      try {
        const response: any = await this.http.post(this.serverPath + '/comunal/add/comunalCompany', data).toPromise();
        if (response.status === 'Данні по комуналці успішно змінені') {
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('Дані збережено');
            setTimeout(() => {
              this.statusMessageService.setStatusMessage('');
            }, 1500);
          }, 200);
        } else {
          this.statusMessageService.setStatusMessage('Помилка збереження');
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('');
          }, 1500);
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  clearInfo(): void {
    if (!this.field)
      this.comunInfo = {
        about_comun: '',
        comunal_company: '',
        comunal_name: '',
        comunal_address: '',
        comunal_site: '',
        comunal_phone: '',
        iban: '',
        edrpo: '',
        personalAccount: '',
      };
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.isCopiedMessage = message;
          setTimeout(() => {
            this.isCopiedMessage = '';
          }, 2000);
        })
        .catch((error) => {
          this.isCopiedMessage = '';
        });
    }
  }

  copyCompany() { this.copyToClipboard(this.comunInfo.comunal_company, 'Назва компанії скопійовано'); }
  copyAccount() { this.copyToClipboard(this.comunInfo.personalAccount, 'Особистий рахунок скопійовано'); }
  copyAddress() { this.copyToClipboard(this.comunInfo.comunal_address, 'Адреса компанії скопійовано'); }
  copySite() { this.copyToClipboard(this.comunInfo.comunal_site, 'Оплата/сайт скопійовано'); }
  copyPhone() { this.copyToClipboard(this.comunInfo.comunal_phone, 'Номер телефону скопійовано'); }
  copyIban() { this.copyToClipboard(this.comunInfo.iban, 'IBAN скопійовано'); }
  copyEdrpo() { this.copyToClipboard(this.comunInfo.edrpo, 'ЄДРПОУ скопійовано'); }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
