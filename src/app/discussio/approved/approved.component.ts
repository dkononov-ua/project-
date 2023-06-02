  import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';


  interface subscription {
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

  export class ApprovedComponent implements OnInit {
    subscriptions: subscription[] = [];
    selectedFlatId: string | any;
    userId: string | any;

    constructor(
      private http: HttpClient,
      private router: Router,
    ) { }

    ngOnInit(): void {
      this.getSubscribedFlats();
    }

    goToFlatPage(flatId: string) {
      this.router.navigate(['house/:parameters', flatId]);
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
        const newsubscriptions = response.map((flat: any) => {
          return {
            flat_id: flat.flat.flat_id,
            flatImg: flat.img,
            price_m: flat.flat.price_m,
          };
        });

        this.subscriptions = [...this.subscriptions, ...newsubscriptions];
      } catch (error) {
        console.error(error);
      }
    }
  }
