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
          if (response == undefined && null)
          this.disabled = false;

        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  };

  saveInfo(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {
      const data = this.flatInfo;
      console.log(data)
      this.http.post('http://localhost:3000/flatinfo/add/parametrs', { auth: JSON.parse(userJson), new: data, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
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

  clearInfo(): void {
    if (this.disabled === false)
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
