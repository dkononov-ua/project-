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

  defaultImageUrl: string = "../../assets/comun/default_services.svg";

  comunalServices = [
    { name: "Опалення", imageUrl: "../../assets/comun/teplo.jpg" },
    { name: "Водопостачання", imageUrl: "../../assets/comun/water.jfif" },
    { name: "Вивіз сміття", imageUrl: "../../assets/comun/cleaning.jpg" },
    { name: "Електроенергія", imageUrl: "../../assets/comun/energy.jpg" },
    { name: "Газопостачання", imageUrl: "../../assets/comun/gas.jpg" },
    { name: "Комунальна плата за утримання будинку", imageUrl: "../../assets/comun/default_services.svg" },
    { name: "Охорона будинку", imageUrl: "../../assets/comun/ohorona.jpg" },
    { name: "Ремонт під'їзду", imageUrl: "../../assets/comun/default_services.svg" },
    { name: "Ліфт", imageUrl: "../../assets/comun/default_services.svg" },
    { name: "Інтернет та телебачення", imageUrl: "../../assets/comun/internet.jpg" },
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
    };

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
      this.getComunalInfo();
      this.getComunalImg();
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

    if (userJson) {
      this.http.post('http://localhost:3000/comunal/get/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: this.selectedComun })
        .subscribe(
          (response: any) => {
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

    console.log(data)
    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {
      this.http.post('http://localhost:3000/comunal/add/comunalCompany', data)
        .subscribe((response: any) => {
          this.disabled = true;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  editInfo(): void {
    this.disabled = false;
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
