import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeComunService } from '../change-comun.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ViewComunService } from 'src/app/discussi/discussio-user/discus/view-comun.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

interface ComunInfo {
  comunal_company: string;
  comunal_name: string;
  comunal_address: string;
  comunal_site: string;
  comunal_phone: string;
  iban: string;
  edrpo: string;
  personalAccount: string;
  about_comun: string;
}
@Component({
  selector: 'app-comun-company',
  templateUrl: './comun-company.component.html',
  styleUrls: ['./comun-company.component.scss'],
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
    animations.swichCard,
  ],
})
export class ComunCompanyComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  showInput = false;
  isCopiedMessage: string = '';
  clickShowInput() {
    this.showInput = !this.showInput;
  }

  comunInfo: ComunInfo = {
    comunal_company: '',
    comunal_name: '',
    comunal_address: '',
    comunal_site: '',
    comunal_phone: '',
    iban: '',
    edrpo: '',
    personalAccount: '',
    about_comun: '',
  };

  defaultImageUrl: string = "../../../assets/example-comun/default_services.svg";
  comunalServices = [
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

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  comunalName: string = '';
  selectedImageUrl: string | null | undefined;
  selectedFlatId: string | null | undefined;
  selectedComun: any;
  selectedYear: any;
  selectedMonth: any;
  disabled: boolean = true;
  loading: boolean = true;
  statusMessage: string | undefined;

  field: boolean = true;
  toggleField() {
    this.field = !this.field;
  }

  help: boolean = false;
  openHelp() {
    this.help = !this.help;
  }
  isMobile: boolean = false;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private sharedService: SharedService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectParam();
    this.loading = false;
    if (this.selectedFlatId !== null && this.selectedComun !== null && this.selectedComun !== null) {
      this.getDefaultData();
    }
    else (!this.selectedFlatId); {
      this.loading = false;
    }
  };

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
      if (this.selectedFlatId && this.selectedComun && this.selectedComun !== 'undefined' && this.selectedComun) {
        this.getComunalInfo();
        this.getComunalImg();
      }
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
    });

    this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
      this.selectedMonth = selectedMonth || this.selectedMonth;
    });
  }

  getDefaultData() {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedService?.imageUrl ?? this.defaultImageUrl;
  }

  getComunalImg(): void {
    const selectedService = this.comunalServices.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedService?.imageUrl || this.defaultImageUrl;
  }

  getComunalInfo(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedComun && this.selectedComun !== undefined && this.selectedComun !== null) {
      this.http.post(this.serverPath + '/comunal/get/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: this.selectedComun })
        .subscribe(
          (response: any) => {
            if (response.status === false) {
              return;
            }
            const filteredData = response.comunal.filter((item: any) => item.comunal_name === this.selectedComun);
            if (filteredData.length > 0) {
              this.comunInfo = filteredData[0];
            } else {
              console.log('No data found for the specified comunal_name.');
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  saveInfo(): void {
    const userJson = localStorage.getItem('user');
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      comunal_name: this.selectedComun,
      when_pay_y: this.selectedYear,
      when_pay_m: this.selectedMonth,
      comunal: this.comunInfo,
    }

    if (userJson && this.selectedFlatId !== undefined) {
      this.http.post(this.serverPath + '/comunal/add/comunalCompany', data)
        .subscribe((response: any) => {
          console.log(response)
          if (response.status === 'Данні по комуналці успішно змінені') {
            setTimeout(() => {
              this.sharedService.setStatusMessage('Дані збережено');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 1500);
            }, 200);
          } else {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 1500);
          }
        });
    }
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
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

}
