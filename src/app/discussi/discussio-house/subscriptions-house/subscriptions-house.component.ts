import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { CustomPaginatorIntl } from '../custom-paginator';

// interface Subscriber {
//   user_id: string;
//   firstName: string;
//   lastName: string;
//   surName: string;
//   photo: string;
//   instagram: string;
//   telegram: string;
//   viber: string;
//   facebook: string;
// }

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
  user_id: string | undefined;
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
  selector: 'app-subscriptions-house',
  templateUrl: './subscriptions-house.component.html',
  styleUrls: ['./subscriptions-house.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})
export class SubscriptionsHouseComponent implements OnInit {
  subscribers: Subscriber[] = [];

  selectedFlatId: string | any;
  offs: number = 0;
  pageEvent: PageEvent | undefined;
  selectedUser: Subscriber | any;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  statusMessage: any;

  purpose: { [key: number]: string } = {
    0: 'Переїзд',
    1: 'Відряджання',
    2: 'Подорож',
    3: 'Пожити в іншому місті',
    4: 'Навчання',
    5: 'Особисті причини',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    5: 'На території будинку',
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

  constructor(private selectedFlatIdService: SelectedFlatService, private http: HttpClient) { }

  ngOnInit(): void {

    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      const offs = 0;
      this.getSubs(selectedFlatId, offs);
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/usersubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)
      // const newSubscribers: Subscriber[] = response
      //   .filter(item => item !== null)
      //   .map((item: any) => ({
      //     user_id: item.user_id,
      //     firstName: item.firstName,
      //     lastName: item.lastName,
      //     surName: item.surName,
      //     photo: item.img,
      //     instagram: item.instagram,
      //     telegram: item.telegram,
      //     viber: item.viber,
      //     facebook: item.facebook
      //   }));

      this.subscribers = response;
    } catch (error) {
      console.error(error);
    }

    this.selectedFlatId = selectedFlatId;
  }

  selectUser(selectedUser: Subscriber) {
    this.selectedUser = selectedUser;
    console.log(this.selectedUser);
  }

  removeSubscriber(subscriber: Subscriber): void {
    const userJson = localStorage.getItem('user');
    const selectedFlat = this.selectedFlatId;
    if (userJson && subscriber && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: subscriber.user_id
      };

      this.http.post('http://localhost:3000/usersubs/delete/ysubs', data)
        .subscribe(
          (response: any) => {
            this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
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

