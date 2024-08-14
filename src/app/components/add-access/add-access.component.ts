import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

interface Subscriber {
  acces_flat_chats: boolean;
  acces_flat_features: boolean;
  acces_agent: boolean;
  acces_comunal_indexes: boolean;
  acces_citizen: boolean;
  acces_agreement: boolean;
  acces_discuss: boolean;
  acces_subs: boolean;
  acces_filling: boolean;
  acces_services: boolean;
  acces_admin: boolean;
  acces_comunal: boolean;
  acces_added: boolean;
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  tell: number;
  photo: string;
  img: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  mail: string;
}

@Component({
  selector: 'app-add-access',
  templateUrl: './add-access.component.html',
  styleUrls: ['./add-access.component.scss']
})

export class AddAccessComponent implements OnInit {

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

  loading = false;
  statusMessage: string | undefined;

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedSubscriber: Subscriber[] | any;
  subscribers: Subscriber[] = [];
  minDate!: string;
  maxDate!: string;
  helpMenu: boolean = false;
  helpInfo: number = 0;
  selectedFlatId: string | any;
  allResidents: any;

  openHelpMenu(helpInfoIndex: number) {
    this.helpInfo = helpInfoIndex;
    this.helpMenu = !this.helpMenu;
  }

  // Перевірка на можливість надіслати відгук
  setMinMaxDate(daysBeforeToday: number) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - daysBeforeToday);
    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // Логіка встановлення доступів для користувачів
  accesCheck() {
    if (this.selectedSubscriber) {
      if (!this.selectedSubscriber.acces_added) {
        this.selectedSubscriber.acces_admin = false;
      }
      if (!this.selectedSubscriber.acces_comunal_indexes) {
        this.selectedSubscriber.acces_comunal = false;
      }
      if (!this.selectedSubscriber.acces_agent) {
        this.selectedSubscriber.acces_agreement = false;
      }
    }
  }
  subscriptions: any[] = [];
  isMobile: boolean = false;
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private sharedService: SharedService,
    private cardsDataHouseService: CardsDataHouseService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    this.getSelectedFlatId();
    this.checkUserAuthorization();
  }

  // перевірка на девайс
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

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        if (flatId) {
          this.selectedFlatId = flatId || this.selectedFlatId || null;
        } else {
          this.sharedService.logoutHouse();
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.checkHouseAuthorization();
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на авторизацію оселі
  async checkHouseAuthorization() {
    const houseData = localStorage.getItem('houseData');
    if (this.selectedFlatId && houseData) {
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      if (this.acces_added === 1) {
        this.selectResidents();
      }
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
      this.acces_agreement = this.houseData.acces.acces_agreement;
    } else {
      this.selectResidents();
    }
  }

  // Дії якщо я обрав мешканця
  async selectResidents(): Promise<any> {
    this.subscriptions.push(
      this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
        if (data) {
          this.selectedSubscriber = data;
        } else {
          this.selectedSubscriber = undefined;
        }
      })
    );
  }

  // Надаю доступ
  async addAccess(subscriber: any): Promise<void> {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {
      if (!this.selectedSubscriber?.acces_added) {
        this.selectedSubscriber!.acces_admin = false;
      }
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: subscriber.user_id,
        acces_added: this.selectedSubscriber?.acces_added,
        acces_admin: this.selectedSubscriber?.acces_admin,
        acces_services: this.selectedSubscriber?.acces_services,
        acces_filling: this.selectedSubscriber?.acces_filling,
        acces_comunal: this.selectedSubscriber?.acces_comunal,
        acces_subs: this.selectedSubscriber?.acces_subs,
        acces_discuss: this.selectedSubscriber?.acces_discuss,
        acces_agreement: this.selectedSubscriber?.acces_agreement,
        acces_citizen: this.selectedSubscriber?.acces_citizen,
        acces_comunal_indexes: this.selectedSubscriber?.acces_comunal_indexes,
        acces_agent: this.selectedSubscriber?.acces_agent,
        acces_flat_features: this.selectedSubscriber?.acces_flat_features,
        acces_flat_chats: this.selectedSubscriber?.acces_flat_chats,
      };
      try {
        const response: any = await this.http.post(this.serverPath + '/citizen/add/access', data).toPromise() as any[];
        if (response.status === ')') {
          this.sharedService.setStatusMessage('Зміни внесено');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Орендар має перезайти в оселю');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Після цього зміни втуплять в силу');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
                this.loading = false;
              }, 1500);
            }, 1500);
          }, 1500);
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              location.reload();
            }, 1500);
          }, 500);
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }


}
