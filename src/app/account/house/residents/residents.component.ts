import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';


// переклад календаря
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
// переклад календаря

export class Rating {
  constructor(
    public ratingComment: string = '',
    public ratingValue: string = '',
    public ratingDate: string = '',
  ) { }
}
interface Subscriber {
  acces_flat_chats: any;
  acces_flat_features: any;
  acces_agent: any;
  acces_comunal_indexes: any;
  acces_citizen: any;
  acces_agreement: any;
  acces_discuss: any;
  acces_subs: any;
  acces_filling: any;
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  tell: number;
  photo: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  acces_services: any;
  acces_admin: any;
  acces_comunal: any;
  acces_added: any;
}
@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss'],

  // переклад календаря
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS], },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  // переклад календаря
})

export class ResidentsComponent implements OnInit {

  rating: Rating = new Rating();
  helpMenu: boolean = false;
  helpInfo: number = 0;

  openHelpMenu(helpInfoIndex: number) {
    this.helpInfo = helpInfoIndex;
    this.helpMenu = !this.helpMenu;
  }

  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  selectedSubscriber: Subscriber | undefined;
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  loading = false;
  statusMessageChat: any;
  isCopied = false;
  indexPage: number = 0;
  indexMenu: number = 1;
  indexPersonMenu: number = 1;
  ownerInfo: any
  ownerPage: boolean = false;
  statusMessage: string | undefined;

  minDate!: string;
  maxDate!: string;
  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private datePipe: DatePipe,
  ) {
    this.setMinMaxDate(35);
  }

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

  ngOnInit(): void {
    this.selectFlat()
    this.selectSubscriber()
  }

  selectFlat() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      console.log(this.selectedFlatId)
      if (this.selectedFlatId) {
        const offs = 0;
        this.getSubs(selectedFlatId, offs).then(() => {
          if (this.subscribers.length > 0) {
            if (this.selectedSubscriber) {
              const foundSubscriber = this.subscribers.find(subscriber => subscriber.user_id === this.selectedSubscriber?.user_id);
              this.selectedSubscriber = foundSubscriber || this.subscribers[0];
            } else {
              this.selectedSubscriber = this.subscribers[0];
            }
          }
        });
        this.getOwner(selectedFlatId, offs)
      }
    });
  }

  selectSubscriber() {
    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
          this.getRating(selectedSubscriber);
        }
      }
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/citizen/get/citizen';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscribers: Subscriber[] = response
        .filter(user_id => user_id !== null)
        .map((user_id: any) => ({
          user_id: user_id.user_id,
          firstName: user_id.firstName,
          lastName: user_id.lastName,
          surName: user_id.surName,
          tell: user_id.tell,
          photo: user_id.img,
          instagram: user_id.instagram,
          telegram: user_id.telegram,
          viber: user_id.viber,
          facebook: user_id.facebook,
          acces_services: user_id.acces_services,
          acces_admin: user_id.acces_admin,
          acces_comunal: user_id.acces_comunal,
          acces_added: user_id.acces_added,
          acces_filling: user_id.acces_filling,
          acces_subs: user_id.acces_subs,
          acces_discuss: user_id.acces_discuss,
          acces_agreement: user_id.acces_agreement,
          acces_citizen: user_id.acces_citizen,
          acces_comunal_indexes: user_id.acces_comunal_indexes,
          acces_agent: user_id.acces_agent,
          acces_flat_features: user_id.acces_flat_features,
          acces_flat_chats: user_id.acces_flat_chats,
        }));
      this.subscribers = newSubscribers;
    } catch (error) {
      console.error(error);
    }
    if (!this.selectedSubscriber) {
      const selectedSubscriberId = localStorage.getItem('selectedSubscriber');
      const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === selectedSubscriberId);
      if (selectedSubscriber) {
        this.selectedSubscriber = selectedSubscriber;
      }
    }
  }

  async getOwner(selectedFlatId: any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userObject = JSON.parse(userJson);
      const user_id = userObject.user_id;
      const data = {
        auth: JSON.parse(userJson!),
        user_id: user_id,
        flat_id: selectedFlatId,
        offs: offs,
      };
      try {
        const response = await this.http.post(serverPath + '/citizen/get/ycitizen', data).toPromise() as any[];
        const ownerInfo = response.find(item => item.flat.flat_id.toString() === selectedFlatId)?.owner;
        if (ownerInfo) {
          this.ownerPage = true;
          this.ownerInfo = ownerInfo;
          this.getRatingOwner(this.ownerInfo.user_id)
        } else {
          console.log('Owner для flat_id ' + selectedFlatId + ' не знайдено.');
          this.ownerPage = false;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  createChat(selectedSubscriber: any): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedSubscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: selectedSubscriber.user_id,
      };
      this.http.post(serverPath + '/chat/add/chatFlat', data)
        .subscribe((response: any) => {
          if (response) {
            this.indexPage = 3;
          } else if (response.status === false) {
            this.statusMessageChat = true;
            console.log('чат вже створено')
          }
          this.selectedSubscriber = selectedSubscriber;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  copyTell() {
    const tell = this.selectedSubscriber?.tell.toString();

    if (tell) {
      navigator.clipboard.writeText(tell)
        .then(() => {
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 2000);
        })
        .catch((error) => {
          this.isCopied = false;
        });
    }
  }

  addAccess(subscriber: any): void {
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {

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
            setTimeout(() => {
              this.statusMessage = 'Доступи надано';
              setTimeout(() => {
                this.statusMessage = '';
              }, 1500);
            }, 500);

          } else {
            setTimeout(() => {
              this.statusMessage = 'Помилка збереження';
              setTimeout(() => {
                this.statusMessage = '';
              }, 1500);
            }, 500);
          }
        },
      );

    } else {
      console.log('Авторизуйтесь');
    }
  }

  sendRating(selectedSubscriber: any) {
    const userJson = localStorage.getItem('user');
    const formattedDate = this.datePipe.transform(this.rating.ratingDate, 'yyyy-MM-dd');

    if (userJson && selectedSubscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedSubscriber.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue
      };
      console.log(data)
      this.http.post(serverPath + '/rating/add/userrating', data)
        .subscribe((response: any) => {
          console.log(response)
          if (response) {
            console.log('відгук надіслано')
          } else if (response.status === false) {
            console.log('помилка')
          }
          this.selectedSubscriber = selectedSubscriber;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  sendRatingOwner() {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: this.ownerInfo.user_id,
        date: this.rating.ratingDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue
      };
      console.log(data)
      this.http.post(serverPath + '/rating/add/flatrating', data)
        .subscribe((response: any) => {
          console.log(response)
          if (response) {
            console.log('відгук надіслано')
          } else if (response.status === false) {
            console.log('помилка')
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  async getRating(selectedSubscriber: any): Promise<any> {
    console.log(11111)
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/usermarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedSubscriber.user_id,
    };

    console.log(data)

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  }

  async getRatingOwner(user_id: any): Promise<any> {
    console.log(22222)
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/usermarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
    };

    console.log(data)

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  }

}
