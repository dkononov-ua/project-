import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSubComponent } from '../delete-sub/delete-sub.component';
import { PageEvent } from '@angular/material/paginator';


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
  img: string;
}

@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
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
    ])
  ],

})
export class SubscribersDiscusComponent implements OnInit {
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  isOnline = true;
  isOffline = false;
  selectedSubscriber: Subscriber | undefined;
  loading = false;
  isChatOpen: boolean = false;
  houseData: any;
  userData: any;
  selectedSubscriberId: string | null = null;
  pageEvent: PageEvent | undefined;
  offs: number = 0;



  deletingSubscriberId: string | null = null;

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.offs = event.pageIndex * event.pageSize;
    this.getAllSubs(this.selectedFlatId, this.offs);
  }

  isFeatureEnabled: boolean = false;
  toggleMode(): void {
    this.isFeatureEnabled = !this.isFeatureEnabled;
  }

  setSelectedSubscriber(subscriber: Subscriber): void {
    this.selectedSubscriber = subscriber;
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId
      if (this.selectedFlatId) {
        const offs = 0;
        this.getAllSubs(this.selectedFlatId, offs).then(() => {
          this.getSelectedSubs();
        });
      }
    });
  }

  getSelectedSubs() {
    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
        }
      } else if (!this.selectedSubscriber && this.subscribers.length > 0) {
        this.selectedSubscriber = this.subscribers[0];
      }
    }
    )
  }

  async getAllSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
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

  createChat(selectedSubscriber: any): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedSubscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: selectedSubscriber.user_id,
      };
      this.toggleMode()

      this.http.post('http://localhost:3000/chat/add/chatFlat', data)
        .subscribe((response: any) => {
          this.selectedSubscriber = selectedSubscriber;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  onSubscriberSelect(subscriber: Subscriber): void {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedSubscriber = subscriber;
    this.selectedSubscriberId = subscriber.user_id;
  }

  async openDialog(subscriberId: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/delete/subs';

    const dialogRef = this.dialog.open(DeleteSubComponent);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriberId && this.selectedFlatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          user_id: subscriberId
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscribers = this.subscribers.filter(item => item.user_id !== subscriberId);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }


}

