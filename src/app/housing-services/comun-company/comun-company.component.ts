import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeComunService } from '../change-comun.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ViewComunService } from 'src/app/services/view-comun.service';
import { serverPath, path_logo } from 'src/app/config/server-config';

interface ComunInfo {
  comunal_company: string | undefined;
  comunal_name: string | undefined;
  comunal_address: string | undefined;
  comunal_site: string | undefined;
  comunal_phone: string | undefined;
  iban: string | undefined;
  edrpo: string | undefined;
  personalAccount: string | undefined;
  about_comun: string | undefined;
}
@Component({
  selector: 'app-comun-company',
  templateUrl: './comun-company.component.html',
  styleUrls: ['./comun-company.component.scss'],
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
export class ComunCompanyComponent implements OnInit {

  showInput = false;
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
  path_logo = path_logo;
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

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
  ) {
  }

  ngOnInit(): void {
    this.getSelectParam();
    this.loading = false;
    if (this.selectedFlatId !== null && this.selectedComun !== null && this.selectedComun !== null) {
      this.getDefaultData();
    }
    else (!this.selectedFlatId); {
      this.loading = false;
      console.log('Оберіть оселю')
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
      this.http.post(serverPath + '/comunal/get/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: this.selectedComun })
        .subscribe(
          (response: any) => {
            if (response.status === false) {
              console.log('Немає послуг');
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
      this.http.post(serverPath + '/comunal/add/comunalCompany', data)
        .subscribe((response: any) => {
          if (response.status === 'Данні по комуналці успішно змінені') {
            setTimeout(() => {
              this.statusMessage = 'Дані збережено';
              setTimeout(() => {
                this.statusMessage = '';
              }, 1500);
            }, 200);
          } else {
            this.statusMessage = 'Помилка збереження';
            setTimeout(() => {
              this.statusMessage = '';
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
    if (this.disabled === false)
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

}
