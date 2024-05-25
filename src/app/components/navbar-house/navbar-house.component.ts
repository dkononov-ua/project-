import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-navbar-house',
  templateUrl: './navbar-house.component.html',
  styleUrls: ['./navbar-house.component.scss']
})
export class NavbarHouseComponent {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedFlatId: any;
  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  dataUpdated = false;
  houseData: any;
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
  subscribed: any;
  iReadHouseMessage: boolean = false;
  counterHouseNewMessage: any;

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
    private counterService: CounterService,
    private sharedService: SharedService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        const parsedHouseData = JSON.parse(houseData);
        this.houseData = parsedHouseData;
        this.selectedFlatId = parsedHouseData.flat.flat_id
        this.getFlatAcces();
        this.getHouseSubscribersCount();
        this.getHouseSubscriptionsCount();
        this.getHouseDiscussioCount();
        this.getHouseNewMessage();
        await this.getUpdateHouseMessage();
      } else {
        console.log('Оберіть оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
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

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    // await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    this.counterService.counterHouseSubscribers$.subscribe(data => {
      const counterHouseSubscribers: any = data;
      this.counterHouseSubscribers = counterHouseSubscribers.status;
      // console.log('кількість підписників', this.counterHouseSubscribers)
    });
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    // await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    this.counterService.counterHouseSubscriptions$.subscribe(data => {
      const counterHouseSubscriptions: any = data;
      this.counterHouseSubscriptions = counterHouseSubscriptions.status;
      // console.log('кількість підписок', this.counterHouseSubscriptions)
    });
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    // await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    this.counterService.counterHouseDiscussio$.subscribe(data => {
      const counterHouseDiscussio: any = data;
      this.counterHouseDiscussio = counterHouseDiscussio.status;
      // console.log('кількість дискусій', this.counterHouseDiscussio)
    });
  }

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    // await this.counterService.getHouseNewMessage(this.selectedFlatId);
    this.counterService.counterHouseNewMessage$.subscribe(data => {
      const counterHouseNewMessage: any = data;
      this.counterHouseNewMessage = counterHouseNewMessage.status;
      // console.log('кількість повідомлень оселі', this.counterHouseNewMessage)
    });
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  getFlatAcces(): void {
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
