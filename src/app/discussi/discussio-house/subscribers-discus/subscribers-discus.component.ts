import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { CustomPaginatorIntl } from '../../../shared/custom-paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSubComponent } from '../delete-sub/delete-sub.component';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
import { UpdateComponentService } from 'src/app/services/update-component.service';
interface Subscriber {
  animals: string | undefined;
  area_of: number | undefined;
  area_to: number | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  city: string | undefined;
  country: string | undefined;
  day_counts: number | undefined;
  days: number | undefined;
  distance_green: number | undefined;
  distance_metro: number | undefined;
  distance_parking: number | undefined;
  distance_shop: number | undefined;
  distance_stop: number | undefined;
  family: boolean | undefined;
  firstName: string | undefined;
  flat: string | undefined;
  house: string | undefined;
  img: string | undefined;
  lastName: string | undefined;
  looking_man: boolean | undefined;
  looking_woman: boolean | undefined;
  man: boolean | undefined;
  mounths: number | undefined;
  option_pay: number | undefined;
  price_of: number | undefined;
  price_to: number | undefined;
  purpose_rent: number | undefined;
  region: string | undefined;
  repair_status: string | undefined;
  room: boolean | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  students: boolean | undefined;
  user_id: string;
  weeks: number | undefined;
  woman: boolean | undefined;
  years: number | undefined;
  surName: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}
@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  animations: [
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
  ],
})

export class SubscribersDiscusComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  offs: number = 0;
  pageEvent: PageEvent | undefined;
  selectedUser: Subscriber | any;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  statusMessage: any;
  statusMessageChat: any;
  cardNext: number = 0;
  selectedCard: boolean = false;
  selectedSubscriberId: string | null = null;
  indexPage: number = 1;
  chatExists = false;
  ratingTenant: number | undefined;

  purpose: { [key: number]: string } = {
    0: 'Переїзд',
    1: 'Відряджання',
    2: 'Подорож',
    3: 'Навчання',
    4: 'Особисті причини',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    1: 'На території',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
  }

  animals: { [key: number]: string } = {
    0: 'Без тварин',
    1: 'З тваринами',
    2: 'Тільки котики',
    3: 'Тільки песики',
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private updateComponent: UpdateComponentService,
  ) { }

  ngOnInit(): void {
    this.getSelectedFlatID();
  }

  getSelectedFlatID () {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        this.getSubs(this.selectedFlatId, this.offs);
      } else {
        console.log('Оберіть оселю');
      }
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.subscribers = response;
    } catch (error) {
      console.error(error);
    }
  }

  async onSubscriberSelect(subscriber: Subscriber): Promise<void> {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUser = subscriber;
    this.checkChatExistence(this.selectedUser.user_id);
    this.indexPage = 2;
    this.getRating(subscriber)
  }

  async openDialog(subscriber: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/acceptsubs/delete/subs';

    const dialogRef = this.dialog.open(DeleteSubComponent, {
      data: {
        user_id: subscriber.user_id,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        component_id: 3,
      }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriber.user_id && this.selectedFlatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          user_id: subscriber.user_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
          this.indexPage = 1;
          this.selectedUser = undefined;
          this.updateComponent.triggerUpdate();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  async createChat(selectedUser: any): Promise<void> {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedUser) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: selectedUser.user_id,
      };
      this.http.post(serverPath + '/chat/add/chatFlat', data)
        .subscribe((response: any) => {
          if (response) {
            this.indexPage = 3;
          } else if (response.status === false) {
            this.statusMessageChat = true;
            console.log('чат вже створено')
          }
          this.selectedUser = selectedUser;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  async checkChatExistence (selectedUser: any): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    if (userJson && selectedUser) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: this.offs
      };
      try {
        const response = await this.http.post(url, data).toPromise() as any;
        if (this.selectedFlatId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { user_id: any }) => chat.user_id === selectedUser);
          this.chatExists = chatExists;
        }
        else {
          console.log('чат не існує');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.offs = event.pageIndex * event.pageSize;
    this.getSubs(this.selectedFlatId, this.offs);
  }

  async getRating(selectedUser: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      if (response && Array.isArray(response.status)) {
        let totalMarkTenant = 0;
        response.status.forEach((item: { mark: number; }) => {
          if (item.mark) {
            totalMarkTenant += item.mark;
            this.ratingTenant = totalMarkTenant;
          }
        });
      } else if (response.status === false) {
        this.ratingTenant = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

}

