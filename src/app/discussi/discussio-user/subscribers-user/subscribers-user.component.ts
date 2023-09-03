import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CustomPaginatorIntl } from '../../../shared/custom-paginator';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-subscribers-user',
  templateUrl: './subscribers-user.component.html',
  styleUrls: ['./subscribers-user.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})

export class SubscribersUserComponent implements OnInit {

  offs: number = 0;
  pageEvent: PageEvent | undefined;
  subscriptions: subscription[] = [];
  userId: string | any;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getSubscribedFlats(this.offs);
  }

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.offs = event.pageIndex * event.pageSize;
    this.getSubscribedFlats(this.offs);
  }

  async getSubscribedFlats(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/usersubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: offs,
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
        };});
        this.subscriptions = newsubscriptions;
    } catch (error) {
      console.error(error);
    }
  }

  approveSubscriber(flatId: string): void {
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

  async openDialog(flatId: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/usersubs/delete/subs';

    const dialogRef = this.dialog.open(DeleteSubsComponent);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: flatId,
          user_id: user_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscriptions = this.subscriptions.filter(item => item.flat_id !== flatId);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}


