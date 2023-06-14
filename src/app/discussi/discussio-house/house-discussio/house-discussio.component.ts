import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';

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
  selector: 'app-house-discussio',
  templateUrl: './house-discussio.component.html',
  styleUrls: ['./house-discussio.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1600ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
})
export class HouseDiscussioComponent implements OnInit {
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  isOnline = true;
  isOffline = false;
  selectedSubscriber: Subscriber | undefined;
  loading = false;


  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      console.log(selectedFlatId);
      if (selectedFlatId) {
        const offs = 0;
        this.getSubs(selectedFlatId, offs);
      }
    });

    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      console.log(subscriberId);
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          console.log(selectedSubscriber);
          this.selectedSubscriber = selectedSubscriber;
        }
      }
    });
  }

handleGenerateAgreement() {
  this.loading = true;
  // Ваш код для формування угоди

  setTimeout(() => {
    this.loading = false;
  }, 2000); // 2 секунди
}

  onSelectionChange(): void {
    this.selectedFlatIdService.setSelectedFlatId(this.selectedFlatId);
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };
    console.log(data)
    console.log(selectedFlatId)
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)

      const newSubscribers: Subscriber[] = response
        .filter(user_id => user_id !== null)
        .map((user_id: any) => ({
          user_id: user_id.user_id,
          firstName: user_id.firstName,
          lastName: user_id.lastName,
          surName: user_id.surName,
          photo: user_id.img,
          instagram: user_id.instagram,
          telegram: user_id.telegram,
          viber: user_id.viber,
          facebook: user_id.facebook
        }));
      console.log(this.subscribers)
      this.subscribers = newSubscribers;

    } catch (error) {
      console.error(error);
    }

    this.selectedFlatId = selectedFlatId;
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
      console.log(data);
      this.http.post('http://localhost:3000/subs/accept', data)
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  removeSubscriber(subscriber: Subscriber): void {
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {
      const data = { auth: JSON.parse(userJson), subscriber_id: subscriber.user_id };
      console.log(data)
      this.http.post('http://localhost:3000/subs/delete/subs', data)
        .subscribe(
          (response: any) => {
            console.log(response);
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
