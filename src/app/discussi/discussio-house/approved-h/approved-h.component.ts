import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../chose-subscribers.service';

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
  selector: 'app-approved-h',
  templateUrl: './approved-h.component.html',
  styleUrls: ['./approved-h.component.scss']
})
export class ApprovedHComponent implements OnInit {
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
  }

  onSubscriberSelect(subscriber: Subscriber): void {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedSubscriber = subscriber;
    this.selectedSubscriberId = subscriber.user_id;
    console.log(subscriber.user_id)
  }

  async getSubscribers(selectedFlatId: string, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
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

      this.http.post('http://localhost:3000/subs/accept', data)
        .subscribe(
          (response: any) => {
            console.log(response);
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
    console.log(subscriberId)

    if (userJson && subscriberId && selectedFlat && selectedSubscriberId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: subscriberId
      };

      this.http.post('http://localhost:3000/acceptsubs/delete/subs', data)
        .subscribe(
          (response: any) => {
            console.log(response);
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
