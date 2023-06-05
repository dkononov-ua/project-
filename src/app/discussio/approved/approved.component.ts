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
        animate('1500ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
  ]
})
export class ApprovedComponent implements OnInit, OnDestroy {
  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  subscriptions: ApprovedSubscription[] = [];
  selectedFlatId: string | null = null;
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
    console.log(user_id)
    const url = 'http://localhost:3000/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };
    console.log(data)

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)
      const newSubscriptions = response.map((flat: any) => {
        return {
          flat_id: flat.flat.flat_id,
          flatImg: flat.img,
          price_m: flat.flat.price_m,
        };
      });

      this.subscriptions = newSubscriptions;
    } catch (error) {
      console.error(error);
    }
  }

  selectFlatId(flatId: string) {
    this.loading = true;

    this.choseSubscribeService.chosenFlatId = flatId;
    this.selectedFlatId = flatId; // Додано цей рядок
  }


  private restoreSelectedFlatId() {
    const selectedFlatId = this.choseSubscribeService.chosenFlatId;
    if (selectedFlatId) {
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
}
