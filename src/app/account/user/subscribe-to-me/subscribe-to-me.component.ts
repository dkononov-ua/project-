import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface subscription {
  flat_id: string;
  flatImg: any;
  price_m: number;
  country: string;
  city: string;
  region: string;
  street: string;
  houseNumber: string;
  apartment: string;
  flat_index: string;
  rooms: number;
  repair_status: string;
  area: number;
  kitchen_area: number;
  balcony: string;
  floor: number;
  distance_metro: number;
  distance_stop: number;
  distance_shop: number;
  distance_green: number;
  distance_parking: number;
  woman: number;
  man: number;
  family: number;
  students: number;
  animals: string;
  price_y: number;
  about: string;
  bunker: string;
}

@Component({
  selector: 'app-subscribe-to-me',
  templateUrl: './subscribe-to-me.component.html',
  styleUrls: ['./subscribe-to-me.component.scss']
})
export class SubscribeToMeComponent implements OnInit {
  subscriptions: subscription[] = [];
  userId: string | any;
  flatId: any;
  deletingFlatId: string | null = null;
  selectedFlatId: any;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getSubscribedFlats();
  }

  toggleSelectFlat(flatId: string): void {
    if (this.selectedFlatId === flatId) {
      this.selectedFlatId = null;
    } else {
      this.selectedFlatId = flatId;
    }
  }

  async getSubscribedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/usersubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newsubscriptions = response.map((flat: any) => {
        return {
          flat_id: flat.flat.flat_id,
          flatImg: flat.img,
          price_m: flat.flat.price_m,
          country: flat.flat.country,
          city: flat.flat.city,
          street: flat.flat.street,
          region: flat.flat.region,
          houseNumber: flat.flat.houseNumber,
          apartment: flat.flat.apartment,
          flat_index: flat.flat.flat_index,
          rooms: flat.flat.rooms,
          repair_status: flat.flat.repair_status,
          area: flat.flat.area,
          kitchen_area :flat.flat.kitchen_area,
          balcony: flat.flat.balcony,
          floor: flat.flat.floor,
          distance_metro: flat.flat.distance_metro,
          distance_stop: flat.flat.distance_stop,
          distance_shop: flat.flat.distance_shop,
          distance_green: flat.flat.distance_green,
          distance_parking: flat.flat.distance_parking,
          woman: flat.flat.woman,
          man: flat.flat.man,
          family: flat.flat.family,
          students: flat.flat.students,
          animals: flat.flat.animals,
          price_y: flat.flat.price_y,
          about: flat.flat.about,
          bunker: flat.flat.bunker,
        };
      }); this.subscriptions = [...this.subscriptions, ...newsubscriptions];
    } catch (error) {
      console.error(error);
    }
  }


  approveSubscriber(flatId: string): void {
    this.selectedFlatId = flatId;
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;

    if (userJson) {
      const data = {
        auth: JSON.parse(userJson!),
        user_id: user_id,
        flat_id: flatId,
      };

      this.http.post('http://localhost:3000/usersubs/accept', data)
        .subscribe(
          (response: any) => {
            this.subscriptions = this.subscriptions.filter(subscriber => subscriber.flat_id !== flatId);
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user or subscriber not found');
    }
  }

  async removeSubscriber(flatId: string): Promise<void> {
    this.selectedFlatId = flatId;
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/usersubs/delete/subs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: flatId,
    };

    try {
      const response = await this.http.post(url, data).toPromise();
      this.deletingFlatId = flatId;
      setTimeout(() => {
        this.subscriptions = this.subscriptions.filter(subscriber => subscriber.flat_id !== flatId);
        this.deletingFlatId = null;
      }, 0);
    } catch (error) {
      console.error(error);
    }
  }
}

