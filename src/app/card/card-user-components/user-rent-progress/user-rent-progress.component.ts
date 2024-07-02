import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-rent-progress',
  templateUrl: './user-rent-progress.component.html',
  styleUrls: ['./user-rent-progress.component.scss'],
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

export class UserRentProgressComponent implements OnInit, OnDestroy {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  counterUserNewAgree: any;
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

  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
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
      this.getCounterAgree();
      await this.getUserDiscussioCount();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
    }
  }

  // перевірка підписників оселі
  async getUserSubscribersCount() {
    // await this.counterService.getHouseSubscribersCount(0);
    this.subscriptions.push(
      this.counterService.counterUserSubscribers$.subscribe(data => {
        this.counterUserSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок оселі
  async getUserSubscriptionsCount() {
    // await this.counterService.getHouseSubscriptionsCount(0);
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        this.counterUserSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій оселі
  async getUserDiscussioCount() {
    // await this.counterService.getHouseDiscussioCount(0);
    this.subscriptions.push(
      this.counterService.counterUserDiscussio$.subscribe(data => {
        this.counterUserDiscussio = Number(data);
      })
    );
  }

  getCounterAgree() {
    const userJson = localStorage.getItem('user');
    // console.log(localStorage.getItem('user'))
    if (userJson) {
      const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
      if (counterUserNewAgree) {
        this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
        // console.log(counterUserNewAgree)
      } else {
        this.counterUserNewAgree = 0;
      }
    } else {
      this.counterUserNewAgree = 0;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}





