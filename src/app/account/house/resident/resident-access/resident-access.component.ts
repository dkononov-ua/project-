import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
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

  loading = false;
  statusMessage: string | undefined;
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
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
    this.getSelectedFlat();
    this.selectResidents();
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
      this.http.post(serverPath + '/citizen/add/access', data).subscribe(
        (response: any) => {
          if (response.status == ')') {
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
        },
      );
    } else {
      console.log('Авторизуйтесь');
    }
  }

}
