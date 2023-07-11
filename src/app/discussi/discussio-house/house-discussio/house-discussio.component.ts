import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Subject, Subscription, interval, switchMap, takeUntil } from 'rxjs';


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
      transition('* => void', [
        animate('1200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
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
  isChatOpen: boolean = false;
  houseData: any;
  userData: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.route.params.subscribe(params => {
      this.selectedSubscriber = params['selectedSubscriber'] || null;
      if (!this.selectedSubscriber && this.subscribers.length > 0) {
        this.selectedSubscriber = this.subscribers[0];
        this.getFlatMessages();
      }
    });

    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        this.getSubs(selectedFlatId, offs).then(() => {
          this.updateSelectedSubscriber();
          this.getFlatMessages();
        });
      }
    });

    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
          this.getFlatMessages();
        }
      } else if (!this.selectedSubscriber && this.subscribers.length > 0) {
        this.selectedSubscriber = this.subscribers[0];
        this.getFlatMessages();
      }
    });
  }

  async loadData(): Promise<void> {
    this.dataService.getData().subscribe((response: any) => {
      this.houseData = response.houseData;
      this.userData = response.userData;

      this.loading = false;
    }, (error) => {
      console.error(error);
      this.loading = false;
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
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
          photo: user_id.img,
          instagram: user_id.instagram,
          telegram: user_id.telegram,
          viber: user_id.viber,
          facebook: user_id.facebook
        }));
      this.subscribers = newSubscribers;
      this.selectedFlatId = selectedFlatId;
    } catch (error) {
      console.error(error);
    }
  }

  updateSelectedSubscriber(): void {
    if (!this.selectedSubscriber && this.subscribers.length > 0) {
      this.selectedSubscriber = this.subscribers[0];
    }
  }

  handleGenerateAgreement() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onSelectionChange(): void {
    this.selectedFlatIdService.setSelectedFlatId(this.selectedFlatId);
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
      this.http.post('http://localhost:3000/subs/delete/subs', data)
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

  createChat(subscriber: any): void {
    this.isChatOpen = true;
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: subscriber,
      };
      console.log(subscriber)
      this.http.post('http://localhost:3000/chat/add/chatFlat', data)
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  getFlatMessages(): void {
    this.isChatOpen = true;
  }

  closeChat(): void {
    this.isChatOpen = false;
  }


}
