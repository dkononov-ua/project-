import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';

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
  selector: 'app-resident-access',
  templateUrl: './resident-access.component.html',
  styleUrls: ['./resident-access.component.scss']
})

export class ResidentAccessComponent implements OnInit {

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

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        this.getSelectedFlat();
        this.selectResidents();
        this.getHouseAcces();
      }
    })
  }

  // Отримую обрану оселю і виконую запит по її власнику та мешкнцям
  async getSelectedFlat() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      if (selectedFlatId) {
        this.selectedFlatId = selectedFlatId;
      }
    });
  }

  // Дії якщо я обрав мешканця
  async selectResidents(): Promise<any> {
    this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      const allResidents = localStorage.getItem('allResidents');
      if (subscriberId && allResidents) {
        this.allResidents = JSON.parse(allResidents);
        const selectedResidents = this.allResidents.find((subscriber: { user_id: string; }) => subscriber.user_id.toString() === String(subscriberId));
        if (selectedResidents) {
          this.selectedSubscriber = selectedResidents;
        } else {
          this.selectedSubscriber = undefined;
        }
      }
    });
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
        // console.log(response.status)
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

}
