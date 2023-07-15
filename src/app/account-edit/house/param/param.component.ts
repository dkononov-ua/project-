import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface FlatInfo {
  rooms: number;
  repair_status: string | undefined;
  area: number;
  kitchen_area: number;
  balcony: string | undefined;
  floor: number;
  option: undefined,
}
@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(130%)' }))
      ])
    ])
  ],

})
export class ParamComponent {

  flatInfo: FlatInfo = {
    rooms: 0,
    repair_status: '',
    area: 0,
    kitchen_area: 0,
    balcony: '',
    floor: 0,
    option: undefined,
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;
  minValue: number = 0;
  maxValue: number = 1000;
  minValueKitchen: number = 0;
  maxValueKitchen: number = 100;
  minValueFloor: number = -3;
  maxValueFloor: number = 47;

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      console.log(this.selectedFlatId);
      if (this.selectedFlatId !== null) {
        this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response)
          this.flatInfo = response.param;
          console.log(this.flatInfo);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  };

  saveInfo(): void {
    this.disabled = true;
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      const data = this.flatInfo;
      console.log(data)
      this.http.post('http://localhost:3000/flatinfo/add/parametrs', { auth: JSON.parse(userJson), new: data, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    this.flatInfo = {
      rooms: 0,
      repair_status: '',
      area: 0,
      kitchen_area: 0,
      balcony: '',
      floor: 0,
      option: undefined,
    };
  }
}
