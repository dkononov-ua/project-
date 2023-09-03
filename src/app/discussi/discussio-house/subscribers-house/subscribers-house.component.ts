import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { CustomPaginatorIntl } from '../../../shared/custom-paginator';
import { MatDialog } from '@angular/material/dialog';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { DeleteSubComponent } from '../delete-sub/delete-sub.component';

interface UserInfo {
  animals: string | undefined;
  area_of: number | undefined;
  area_to: number | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  city: string | undefined;
  country: string | undefined;
  day_counts: number | undefined;
  days: number | undefined;
  distance_green: number | undefined;
  distance_metro: number | undefined;
  distance_parking: number | undefined;
  distance_shop: number | undefined;
  distance_stop: number | undefined;
  family: boolean | undefined;
  firstName: string | undefined;
  flat: string | undefined;
  house: string | undefined;
  img: string | undefined;
  lastName: string | undefined;
  looking_man: boolean | undefined;
  looking_woman: boolean | undefined;
  man: boolean | undefined;
  mounths: number | undefined;
  option_pay: number | undefined;
  price_of: number | undefined;
  price_to: number | undefined;
  purpose_rent: number | undefined;
  region: string | undefined;
  repair_status: string | undefined;
  room: boolean | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  students: boolean | undefined;
  user_id: string | undefined;
  weeks: number | undefined;
  woman: boolean | undefined;
  years: number | undefined;
}

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
  selector: 'app-subscribers-house',
  templateUrl: './subscribers-house.component.html',
  styleUrls: ['./subscribers-house.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})

export class SubscribersHouseComponent implements OnInit {

  offs: number = 0;
  pageEvent: PageEvent | undefined;
  selectedUser: UserInfo | any;

  isFeatureEnabled: boolean = false;
  toggleMode(): void {
    this.isFeatureEnabled = !this.isFeatureEnabled;
  }

  onPageChange(event: PageEvent) {
    this.pageEvent = event;
    this.offs = event.pageIndex * event.pageSize;
    this.getSubs(this.selectedFlatId, this.offs);
  }

  selectedFlatId: string | any;
  subscribers: Subscriber[] = [];
  selectedSubscriberId: string | null = null;


  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      this.getSubs(this.selectedFlatId, this.offs);
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/subs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
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

      this.http.post('http://localhost:3000/subs/accept', data)
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

  onSubscriberSelect(subscriber: Subscriber): void {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUser = subscriber;
    this.selectedSubscriberId = subscriber.user_id;
  }

  async openDialog(subscriberId: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/subs/delete/subs';

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

