import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';


@Component({
  selector: 'app-comun-company',
  templateUrl: './comun-company.component.html',
  styleUrls: ['./comun-company.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
})
export class ComunCompanyComponent implements OnInit {

  comunalCompany = {
    comunal_company: '',
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

  comunalName: string = '';
  selectedImageUrl: string | null | undefined;
  selectedFlatId: string | null | undefined;
  selectedYear: any;
  selectedMonth: any;

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) {
  }

  ngOnInit(): void {
    this.comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;
    const selectedService = this.comunalServices.find(service => service.name === this.comunalName);
    this.defaultImageUrl = "../../assets/comun/default_services.svg";
    this.selectedImageUrl = selectedService?.imageUrl ?? this.defaultImageUrl;

    const userJson = localStorage.getItem('user');
    this.selectedFlatId = localStorage.getItem('house');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');

    if (selectedYear) {
      if (userJson) {
        this.http.post('http://localhost:3000/comunal/get/comunal', {
          auth: JSON.parse(userJson),
          flat_id: JSON.parse(this.selectedFlatId!).flat_id,
          comunal_name: comunalName,
          when_pay_y: JSON.parse(selectedYear)
        })
          .subscribe((response: any) => {
            localStorage.setItem('comunal_inf', JSON.stringify(response));
            console.log(response);
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('user not found');
      }

      this.selectedYear = JSON.parse(selectedYear);
    }
    if (selectedMonth) {
      this.selectedMonth = JSON.parse(selectedMonth);
    }
    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
    if (userJson && com_inf && com_inf.comunal) {
      const matchingComunal = com_inf.comunal.find((value: any) => {
        return value.comunal_name === comunalName && value.when_pay_y === String(this.selectedYear) && value.when_pay_m === this.selectedMonth;
      });

      if (matchingComunal) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            this.comunalCompany.comunal_company = matchingComunal.comunal_company;
          }
        });
      }
    } else {
      console.log('user not found or comunal_inf not available');
    }
  }

}
