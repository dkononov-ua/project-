import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import * as ServerConfig from 'src/app/config/path-config';
import { HouseInfo } from '../../../../interface/info';
import { HouseConfig } from '../../../../interface/param-config';
import { Options, Distance, Animals, CheckBox } from '../../../../interface/name';
import { CounterService } from 'src/app/services/counter.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { animations } from '../../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss'],
  animations: [
    animations.top2,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class MainInfoComponent implements OnInit, OnDestroy {

  statusInfoHouse: any;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  isOpen = true;
  isCopied = false;
  indexCard: number = 2;
  loading: boolean = false;
  indexPage: number = 0;
  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  counterHouseNewMessage: any;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;
  authorization: boolean = false;
  houseData: any;

  HouseInfo: HouseInfo = HouseConfig;
  options: { [key: number]: string } = Options;

  currentPhotoIndex: number = 0;
  showCardParam: number = 0;
  isLoadingImg: boolean = false;


  isCopiedMessage!: string;
  public locationLink: string = '';
  statusMessage: any;
  selectedFlatId!: string | null;
  startX = 0;
  selectedSubAgree: any;
  timeToOpenRating: number = 0;
  numConcludedAgree: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private http: HttpClient,
    private counterService: CounterService,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private router: Router,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
        // isMobile: boolean = false;
      })
    );
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId;
        if (this.selectedFlatId) {
          await this.loadDataFlat();
        }
      })
    );

    await this.getHouseAcces();
  }

  goToEdit() {
    if (this.isMobile) {
      this.router.navigate(['/edit-house/instruction']);
    } else {
      this.router.navigate(['/edit-house/address']);
    }
  }

  async loadDataFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.houseData = parsedHouseData;
        this.loadSearchDataFlat();
      } else {
        // console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  async loadSearchDataFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.houseData) {
      // console.log(this.houseData)
      this.statusInfoHouse = {
        private: this.houseData.about.private,
        rent: this.houseData.about.rent,
        room: this.houseData.about.room,
        students: this.houseData.about.students,
        woman: this.houseData.about.woman,
        man: this.houseData.about.man,
        family: this.houseData.about.family,
        date: this.houseData.about.data,
        checked: this.houseData.flatStat[0].checked,
        realll: this.houseData.flatStat[0].realll,
        option_flat: this.houseData.param.option_flat,
      };
      this.statusDataService.setStatusDataFlat(this.statusInfoHouse);
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    this.houseData = localStorage.getItem('houseData');
    if (this.houseData) {
      const parsedHouseData = JSON.parse(this.houseData);
      this.houseData = parsedHouseData;
      // console.log(this.houseData)
      if (this.houseData.acces) {
        this.acces_added = this.houseData.acces.acces_added;
        this.acces_admin = this.houseData.acces.acces_admin;
        this.acces_agent = this.houseData.acces.acces_agent;
        this.acces_agreement = this.houseData.acces.acces_agreement;
        this.acces_citizen = this.houseData.acces.acces_citizen;
        this.acces_comunal = this.houseData.acces.acces_comunal;
        this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
        this.acces_discuss = this.houseData.acces.acces_discuss;
        this.acces_filling = this.houseData.acces.acces_filling;
        this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
        this.acces_flat_features = this.houseData.acces.acces_flat_features;
        this.acces_services = this.houseData.acces.acces_services;
        this.acces_subs = this.houseData.acces.acces_subs;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Отримую угоди для виведення інформації по ним для мешканців та власника
  async getConcludedAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    if (userData && userJson) {
      const userObject = JSON.parse(userData);
      const user_id = userObject.inf.user_id;
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: 0, };
      try {
        const response: any = (await this.http.post(this.serverPath + '/agreement/get/saveagreements', data).toPromise()) as any;
        // console.log(response)
        if (response && response[0].status !== 'Немає доступу') {
          const agreeData = response.filter((item: { flat: { subscriber_id: any; }; }) =>
            item.flat.subscriber_id === user_id);
          if (agreeData && agreeData.length !== 0) {
            this.selectedSubAgree = agreeData[0].flat;
            // підраховую яка кількість днів залишилась до відкриття відгука
            const { dateAgreeStart } = agreeData[0].flat;
            const daysToAdd = 14;
            const endDate: Date = new Date(dateAgreeStart);
            endDate.setDate(endDate.getDate() + daysToAdd);
            const today: Date = new Date();
            const differenceInTime: number = endDate.getTime() - today.getTime();
            const differenceInDays: number = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            this.timeToOpenRating = differenceInDays;
          } else {
            this.selectedSubAgree = [];
          }
        } else {
          this.numConcludedAgree = 0;
          // this.sharedService.setStatusMessage('У вас немає доступу до оселі ID ' + this.selectedFlatId + 'Можливо її було забанено');
          // setTimeout(() => {
          //   this.sharedService.logoutHouse();
          // }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('У вас немає доступу до оселі ID ' + this.selectedFlatId + 'Можливо її було забанено');
        setTimeout(() => {
          this.sharedService.logoutHouse();
        }, 2000);
      }
    }
  }
}


