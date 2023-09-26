import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { serverPath } from 'src/app/shared/server-config';


interface Subscriber {
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  photo: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}

@Component({
  selector: 'app-house-residents',
  templateUrl: './house-residents.component.html',
  styleUrls: ['./house-residents.component.scss']
})
export class HouseResidentsComponent implements OnInit {
  serverPath = serverPath;

  isOnline = true;
  isOffline = false;

  subscribers: Subscriber[] = [];
  selectedSubscriber: Subscriber | null = null;
  selectedFlatId: any;
  selectedSubscriberId: string | null = null;


  setSelectedSubscriber(subscriber: Subscriber): void {
    this.selectedSubscriber = subscriber;
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        this.getSubscribers(selectedFlatId, offs);
      }
    });

    if (this.subscribers.length > 0) {
      this.setSelectedSubscriber(this.subscribers[0]);
    }
  }

  onSubscriberSelect(subscriber: Subscriber): void {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedSubscriber = subscriber;
    this.selectedSubscriberId = subscriber.user_id;
  }

  async getSubscribers(selectedFlatId: string, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/citizen/get/citizen';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscribers: Subscriber[] = response
        .filter(item => item !== null)
        .map((item: any) => ({
          user_id: item.user_id,
          firstName: item.firstName,
          lastName: item.lastName,
          surName: item.surName,
          photo: item.img,
          instagram: item.instagram,
          telegram: item.telegram,
          viber: item.viber,
          facebook: item.facebook
        }));

      this.subscribers = newSubscribers;
    } catch (error) {
      console.error(error);
    }
  }

  approveSubscriber(subscriber: Subscriber): void {
    const selectedFlatId = this.selectedFlatIdService.getSelectedFlatId();
    const userJson = localStorage.getItem('user');

    if (userJson && selectedFlatId && subscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlatId,
        user_id: subscriber.user_id
      };

      this.http.post(serverPath + '/subs/accept', data)
        .subscribe(
          (response: any) => {
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('User, flat, or subscriber not found');
    }
  }

  removeSubscriber(subscriberId: string): void {
    const userJson = localStorage.getItem('user');
    const selectedFlat = this.selectedFlatIdService.getSelectedFlatId();
    const selectedSubscriberId = subscriberId;

    if (userJson && subscriberId && selectedFlat && selectedSubscriberId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: subscriberId
      };

      this.http.post(serverPath + '/citizen/delete/citizen', data)
        .subscribe(
          (response: any) => {
            this.subscribers = this.subscribers.filter(item => item.user_id !== subscriberId);
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('Користувач, квартира або абонент не знайдені');
    }
  }

}
