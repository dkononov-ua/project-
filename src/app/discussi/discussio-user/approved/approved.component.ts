import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ChoseSubscribeService } from '../chose-subscribe.service';
import { Subscription } from 'rxjs';

interface ApprovedSubscription {
  flat_id: string;
  flatImg: any;
  price_m: number;
}

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ]
})
export class ApprovedComponent implements OnInit, OnDestroy {
  loading = false;
  deletingFlatId: any;
  selectedFlatId: any;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  subscriptions: ApprovedSubscription[] = [];
  private selectedFlatIdSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private choseSubscribeService: ChoseSubscribeService,
  ) { }

  ngOnInit(): void {
    this.getSubscribedFlats();
    this.subscribeToSelectedFlatIdChanges();
    this.restoreSelectedFlatId();
  }

  async getSubscribedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscriptions: ApprovedSubscription[] = response.map((flat: any) => {
        return {
          flat_id: flat.flat.flat_id,
          flatImg: flat.img,
          price_m: flat.flat.price_m,
        };
      });

      this.subscriptions = newSubscriptions;
      if (newSubscriptions.length > 0) {
        this.selectFlatId(newSubscriptions[0].flat_id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  selectFlatId(flatId: string) {
    this.loading = true;

    this.choseSubscribeService.chosenFlatId = flatId;
    this.selectedFlatId = flatId;
  }

  private restoreSelectedFlatId() {
    const selectedFlatId = this.choseSubscribeService.chosenFlatId;
    if (selectedFlatId) {
      this.selectFlatId(selectedFlatId);
    }
  }

  private subscribeToSelectedFlatIdChanges() {
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$.subscribe(
      flatId => {
        this.selectedFlatId = flatId;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.selectedFlatIdSubscription) {
      this.selectedFlatIdSubscription.unsubscribe();
    }
  }

  removeSubscriber(flatId: string): void {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/acceptsubs/delete/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: flatId,
    };

    this.http.post(url, data).subscribe(
      () => {
        this.loading = false;
        this.deletingFlatId = flatId;
        setTimeout(() => {
          this.subscriptions = this.subscriptions.filter(subscriber => subscriber.flat_id !== flatId);
          this.deletingFlatId = null;
        }, 100);
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }
}
