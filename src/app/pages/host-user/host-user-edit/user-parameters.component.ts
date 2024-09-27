import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { MenuService } from 'src/app/services/menu.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-user-parameters',
  templateUrl: './user-parameters.component.html',
  styleUrls: ['./user-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.bot,
    animations.appearance,

  ],
})

export class UserParametersComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];

  collapsePerson: boolean = false;
  collapsePersonStatus: boolean = false;
  collapseContacts: boolean = false;
  collapseContactsStatus: boolean = false;
  collapseStatus: boolean = false;
  collapseStatusStatus: boolean = false;
  collapseDelete: boolean = false;
  collapseDeleteStatus: boolean = false;
  awaitStatusBtn: boolean = true;
  collapseParamStatus: boolean = false;
  userData: any;
  fillingCont: number = 0;
  fillingInf: number = 0;
  totalFillingCont: number = 0;
  totalСompletion: number = 0;
  totalFillingInf: number = 0;
  totalFilling: number = 0;

  toogleFilter(filter: string) {
    this.collapsePerson = false;
    this.collapseContacts = false;
    this.collapseStatus = false;
    this.collapseDelete = false;
    switch (filter) {
      case 'Person':
        this.collapsePerson = true;
        break;
      case 'Contacts':
        this.collapseContacts = true;
        break;
      case 'Status':
        this.collapseStatus = true;
        break;
      case 'Delete':
        this.collapseDelete = true;
        break;
    }
  }

  toogleAll() {
    this.collapsePersonStatus = true;
    this.collapseContactsStatus = true;
    this.collapseDeleteStatus = true;
    this.collapseStatusStatus = true;
    this.awaitStatusBtn = false;
    setTimeout(() => {
      this.collapsePersonStatus = false;
      this.collapseContactsStatus = false;
      this.collapseDeleteStatus = false;
      this.collapseStatusStatus = false;
      this.collapsePerson = false;
      this.collapseContacts = false;
      this.collapseDelete = false;
      this.collapseStatus = false;
      this.awaitStatusBtn = true;
    }, 1000);
  }

  getSpinnerClass(value: number): string {
    if (value >= 70) {
      return 'spinner-green';
    } else if (value >= 50) {
      return 'spinner-yellow';
    } else if (value > 0) {
      return 'spinner-red';
    } else {
      return 'spinner-gray';
    }
  }


  constructor(
    private http: HttpClient,
    private location: Location,
    private sharedService: SharedService,
    private menuService: MenuService,
    private loaderService: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    this.getToogleMenu();
  }

  // підписка на шлях до серверу
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

  // підписка на шлях до серверу
  async getToogleMenu() {
    this.subscriptions.push(
      this.menuService.toogleMenuEditUser$.subscribe(async (status: boolean) => {
        if (!status) {
          this.toogleAll();
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getInfoUser();
    } else {
      this.authorization = false;
    }
  }

  // Беру інформацію користувача
  async getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.userData = userObject;
      this.countFillingProfile();
      this.loaderService.setLoading(false);
    } else if (!userData) {
      setTimeout(() => {
        this.getInfoUser();
      }, 100);
    }
  }

  countFillingProfile() {
    const totalFields = 12;
    this.fillingCont = this.countFillingCont();
    this.fillingInf = this.countFillingInf();
    const totalFilledFields = this.fillingCont + this.fillingInf;
    this.totalFillingCont = parseFloat((this.fillingCont / 7 * 100).toFixed(2));
    this.totalFillingInf = parseFloat((this.fillingInf / 5 * 100).toFixed(2));
    this.totalFilling = parseFloat(((totalFilledFields / totalFields) * 100).toFixed(2));
  }

  countFillingInf(): number {
    let count = 0;
    if (this.userData.inf.firstName) count++;
    if (this.userData.inf.lastName) count++;
    if (this.userData.inf.surName) count++;
    if (this.userData.inf.dob) count++;
    if (this.userData.img) count++;
    return count;
  }

  countFillingCont(): number {
    let count = 0;
    if (this.userData.cont.facebook) count++;
    if (this.userData.cont.instagram) count++;
    if (this.userData.cont.mail) count++;
    if (this.userData.cont.phone_alt) count++;
    if (this.userData.cont.telegram) count++;
    if (this.userData.cont.tell) count++;
    if (this.userData.cont.viber) count++;
    return count;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

};
