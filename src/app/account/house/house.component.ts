import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { animations } from '../../interface/animation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})

export class HouseComponent implements OnInit {

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

  constructor(
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private updateComponent: UpdateComponentService,
    private location: Location,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
    });
  }

  async ngOnInit(): Promise<void> {

    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    const userJson = localStorage.getItem('user');

    if (userJson) {
      this.authorization = true;
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        const parsedHouseData = JSON.parse(houseData);
        this.houseData = parsedHouseData;
        this.selectedFlatId = parsedHouseData.flat.flat_id;
        if (this.selectedFlatId) {
          this.getHouseAcces();
          await this.getHouseSubscribersCount();
          await this.getHouseSubscriptionsCount();
          await this.getHouseDiscussioCount();
          await this.getHouseNewMessage();
          await this.getUpdateHouseMessage();
          this.loading = false;
        }
      } else {
        // console.log('Оберіть оселю')
      }
    } else {
      this.authorization = false;
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      if (this.selectedFlatId) {
        this.loadDataFlat();
      }
    });
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        this.houseData = true;
      } else {
        this.houseData = false;
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    this.counterService.counterHouseSubscribers$.subscribe(data => {
      const counterHouseSubscribers: any = data;
      this.counterHouseSubscribers = counterHouseSubscribers.status;
      // console.log('кількість підписників', this.counterHouseSubscribers)
    });
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    this.counterService.counterHouseSubscriptions$.subscribe(data => {
      const counterHouseSubscriptions: any = data;
      this.counterHouseSubscriptions = counterHouseSubscriptions.status;
      // console.log('кількість підписок', this.counterHouseSubscriptions)
    });
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    this.counterService.counterHouseDiscussio$.subscribe(data => {
      const counterHouseDiscussio: any = data;
      if (counterHouseDiscussio.status === 'Немає доступу') {
        this.counterHouseDiscussio = null;
      } else {
        this.counterHouseDiscussio = counterHouseDiscussio.status;
      }
      // console.log('кількість дискусій', this.counterHouseDiscussio)
    });
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  getHouseAcces(): void {
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

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getHouseNewMessage(this.selectedFlatId);
    this.counterService.counterHouseNewMessage$.subscribe(data => {
      const counterHouseNewMessage: any = data;
      this.counterHouseNewMessage = counterHouseNewMessage.status;
      // console.log('кількість повідомлень оселі', this.counterHouseNewMessage)
    });
  }

  // повідомлення оселі було прочитано
  async getUpdateHouseMessage() {
    this.updateComponent.iReadHouseMessage$.subscribe(async () => {
      this.iReadHouseMessage = true;
      if (this.iReadHouseMessage === true) {
        this.counterHouseNewMessage = 0;
      }
    });
  }
}



