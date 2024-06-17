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

  private userDataSubject = new BehaviorSubject<any>('');
  public userData$ = this.userDataSubject.asObservable();

  private statusAccessSubject = new BehaviorSubject<any>('');
  public statusAccess$ = this.statusAccessSubject.asObservable();


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

  setUserData(data: any, index: number): void {
    console.log(data)
    // index потрібен для показу рейтингу в links-box.component
    // якщо 0 - показую два рейтинги
    // якщо 1 - показую рейтинг орендодавця
    // якщо 2 - показую рейтинг орендаря
    this.userDataSubject.next({ data, index });
  }

  setStatusAccess(data: any): void {
    // console.log(data)
    this.statusAccessSubject.next(data);
  }

}
