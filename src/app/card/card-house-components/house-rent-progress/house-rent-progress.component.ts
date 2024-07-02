import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-house-rent-progress',
  templateUrl: './house-rent-progress.component.html',
  styleUrls: ['./house-rent-progress.component.scss'],
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
  ],
})

export class HouseRentProgressComponent implements OnInit, OnDestroy {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  goBack(): void {
    this.location.back();
  }
  selectedFlatId!: string | null;
  statusMessage: string | undefined;
  houseData: any;
  authorization: boolean = false;
  loading: boolean = false;

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

  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  unreadHouseMessage: any;
  iReadHouseMessage: boolean = false;
  counterHouseNewMessage: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private updateComponent: UpdateComponentService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.subscriptions.push(
        this.sharedService.isMobile$.subscribe((status: boolean) => {
          this.isMobile = status;
        })
      );
      this.getSelectParam();
    }
  }

  getSelectParam() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId;
        this.getHouseAcces();
      })
    );
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
        if (this.acces_discuss === 1) {
          await this.getHouseDiscussioCount();
        }
        if (this.acces_subs === 1) {
          await this.getHouseSubscribersCount();
          await this.getHouseSubscriptionsCount();
        }
      } else {
        await this.getHouseDiscussioCount();
        await this.getHouseSubscribersCount();
        await this.getHouseSubscriptionsCount();
      }
    }
  }

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    // await this.counterService.getHouseSubscribersCount(0);
    this.subscriptions.push(
      this.counterService.counterHouseSubscribers$.subscribe(data => {
        this.counterHouseSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    // await this.counterService.getHouseSubscriptionsCount(0);
    this.subscriptions.push(
      this.counterService.counterHouseSubscriptions$.subscribe(data => {
        this.counterHouseSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    // await this.counterService.getHouseDiscussioCount(0);
    this.subscriptions.push(
      this.counterService.counterHouseDiscussio$.subscribe(data => {
        this.counterHouseDiscussio = Number(data);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}




