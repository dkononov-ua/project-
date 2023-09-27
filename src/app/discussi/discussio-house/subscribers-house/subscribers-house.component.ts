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
  selector: 'app-subscribers-house',
  templateUrl: './subscribers-house.component.html',
  styleUrls: ['./subscribers-house.component.scss'],
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

export class SubscribersHouseComponent implements OnInit {

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
  cardNext: number = 0;
  selectedCard: boolean = false;
  isFeatureEnabled: boolean = false;
  toggleMode(): void {
    this.isFeatureEnabled = !this.isFeatureEnabled;
  }

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
    1: 'З котячими',
    2: 'З собачими',
    3: 'З собачими/котячими',
    4: 'Є багато різного',
    5: 'Щось цікавіше',
  }

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.offs = event.pageIndex * event.pageSize;
    this.getSubs(this.selectedFlatId, this.offs);
  }
  selectedSubscriberId: string | null = null;
  indexPage: number = 0;


  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private updateComponent: UpdateComponentService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      this.getSubs(this.selectedFlatId, this.offs);
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/subs/get/subs';
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

  onSubscriberSelect(subscriber: Subscriber): void {
    this.indexPage = 1;
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUser = subscriber;
    this.selectedSubscriberId = subscriber.user_id;
  }

  async openDialog(subscriber: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/subs/delete/subs';

    const dialogRef = this.dialog.open(DeleteSubComponent, {
      data: {
        user_id: subscriber.user_id,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        component_id: 1,
      }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriber.user_id && this.selectedFlatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          user_id: subscriber.user_id
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
          this.selectedUser = undefined;
          this.updateComponent.triggerUpdate();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  approveSubscriber(subscriber: Subscriber): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');

    if (userJson && subscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: subscriber.user_id,
      };

      this.http.post(serverPath + '/subs/accept', data)
        .subscribe(
          (response: any) => {
            this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
            this.updateComponent.triggerUpdate();
            this.selectedUser = undefined;
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user or subscriber not found');
    }
  }

}

