import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SubsCountService } from 'src/app/services/subs-count.service';

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
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss'],
})
export class SubscribersComponent implements OnInit {
  subscribers: Subscriber[] = [];

  selectedFlatId: string | any;

  constructor(private selectedFlatIdService: SelectedFlatService, private http: HttpClient, private SubsCountService: SubsCountService) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      console.log('Ви вибрали оселю з ID:', selectedFlatId);
      const offs = 0;
      this.getSubs(selectedFlatId, offs);
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

      const newSubscribers = response.map((item: any) => {
        return {
          user_id: item.user_id,
          firstName: item.firstName,
          lastName: item.lastName,
          surName: item.surName,
          photo: item.img,
          instagram: item.instagram,
          telegram: item.telegram,
          viber: item.viber,
          facebook: item.facebook
        };
      });

      this.subscribers = [...this.subscribers, ...newSubscribers];
      const subscribersCount = this.subscribers.length;
      this.SubsCountService.setSubscribersCount(subscribersCount);
    } catch (error) {
      console.error(error);
    }

    this.selectedFlatId = selectedFlatId;
  }
  loadMoreSubs(): void {
    const selectedFlatId = this.selectedFlatId;
    const offs = this.subscribers.length;
    this.getSubs(selectedFlatId, offs);
  }

  approveSubscriber(subscriber: Subscriber): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      console.log(data)
      this.http.post('http://localhost:3000/subs/accept', data)
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  removeSubscriber(subscriber: Subscriber): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
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
      console.log('user not found');
    }
  }

}
