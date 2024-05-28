import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StatusInfo } from '../interface/info'
import { StatusConfig } from '../interface/param-config'
@Injectable({
  providedIn: 'root'
})
export class StatusDataService {

  private statusDataSubject = new BehaviorSubject<any>('');
  public statusData$ = this.statusDataSubject.asObservable();

  private statusDataFlatSubject = new BehaviorSubject<any>('');
  public statusDataFlat$ = this.statusDataFlatSubject.asObservable();

  statusInfo: StatusInfo = StatusConfig;

  constructor() { }

  setStatusData(data: any): void {
    // console.log(data)
    this.statusDataSubject.next(data);
  }

  setStatusDataFlat(data: any): void {
    // console.log(data)
    this.statusDataFlatSubject.next(data);
  }

  // якщо треба буде кожне окремо присвоїти
  // setStatusUserSearchData(data: any): void {
  //   // this.statusInfo.house = data.house;
  //   // this.statusInfo.flat = data.flat;
  //   // this.statusInfo.room = data.room;
  //   // this.statusInfo.looking_woman = data.looking_woman;
  //   // this.statusInfo.looking_man = data.looking_man;
  //   // this.statusInfo.agree_search = data.agree_search;
  //   // this.statusInfo.students = data.students;
  //   // this.statusInfo.woman = data.woman;
  //   // this.statusInfo.man = data.man;
  //   // this.statusInfo.family = data.family;
  //   // this.statusInfo.date = data.date;
  //   // this.statusInfo.checked = data.checked;
  //   // this.statusInfo.realll = data.realll;
  //   this.setStatusData();
  // }

}
