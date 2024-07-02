import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navigation-house',
  templateUrl: './navigation-house.component.html',
  styleUrls: ['./navigation-house.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(1220%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(1220%)' }))
      ]),
    ]),
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

export class NavigationHouseComponent implements OnInit, OnDestroy {

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  disabledBtn: boolean = false;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

  toggleAllMenu(index: number) {
    this.linkOpen[index] = !this.linkOpen[index];
    this.disabledBtn = true;
    if (this.menu[index]) {
      setTimeout(() => {
        this.menu[index] = !this.menu[index];
        this.disabledBtn = false;
      }, 600);
    } else {
      this.menu[index] = !this.menu[index];
      this.disabledBtn = false;
    }
  }

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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
  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  selectedFlatId!: string | null;
  authorization: boolean = false;

  constructor(
    private counterService: CounterService,
    private sharedService: SharedService,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
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

  goToEdit() {
    if (this.isMobile) {
      this.router.navigate(['/edit-house/instruction']);
    } else {
      this.router.navigate(['/edit-house/address']);
    }
  }

  goToComun() {
    if (this.isMobile) {
      this.router.navigate(['/communal/about']);
    } else {
      this.router.navigate(['/communal/about']);
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
        } if (this.acces_flat_chats === 1) {
          await this.getHouseNewMessage();
        }
      } else {
        await this.getHouseDiscussioCount();
        await this.getHouseSubscribersCount();
        await this.getHouseSubscriptionsCount();
        await this.getHouseNewMessage();
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

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    // await this.counterService.getHouseNewMessage(0);
    this.subscriptions.push(
      this.counterService.counterHouseNewMessage$.subscribe(data => {
        this.counterHouseNewMessage = Number(data)
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}


