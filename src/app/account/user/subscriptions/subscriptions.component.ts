import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface subscription {
  flat_id: string;
  flatImg: any;
  price_m: number;
}
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: subscription[] = [];
  selectedFlatId: string | any;
  userId: string | any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getSubscribedFlats();
  }

  async getSubscribedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    console.log(user_id)
    const url = 'http://localhost:3000/subs/get/ysubs';
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
