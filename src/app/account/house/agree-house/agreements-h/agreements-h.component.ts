import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface Subscriber {
  flat: {
    agreementDate: string;
    agreement_id: string;
    apartment: string;
    city: string;
    flat_id: string;
    houseNumber: string;
    max_penalty: string;
    month: number;
    owner_email: string;
    owner_firstName: string;
    owner_id: string;
    owner_lastName: string;
    owner_surName: string;
    owner_tell: string;
    owner_img: string;
    penalty: string;
    price: string;
    rent_due_data: number;
    street: string;
    subscriber_email: string;
    subscriber_firstName: string;
    subscriber_id: string;
    subscriber_lastName: string;
    subscriber_surName: string;
    subscriber_tell: string;
    subscriber_img: string;
    year: number;
    area: number;
  };
  img: string[];
}

@Component({
  selector: 'app-agreements-h',
  templateUrl: './agreements-h.component.html',
  styleUrls: ['./agreements-h.component.scss'],
})


export class AgreementsHComponent implements OnInit {
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;

  constructor(private selectedFlatIdService: SelectedFlatService, private http: HttpClient) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      const offs = 0;
      this.getSubs(selectedFlatId, offs);
    });
  }

  toggleSelectFlat(flatId: string): void {
    if (this.selectedFlatId === flatId) {
      this.selectedFlatId = null;
    } else {
      this.selectedFlatId = flatId;
    }
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/agreement/get/agreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      console.log(response)
      this.subscribers = response;
    } catch (error) {
    }

    this.selectedFlatId = selectedFlatId;
  }

  removeSubscriber(subscriber: Subscriber): void {

    const userJson = localStorage.getItem('user');
    const selectedFlat = this.selectedFlatId;
    console.log(this.selectedFlatId)
    if (userJson && subscriber) {
      console.log({
        auth: JSON.parse(userJson),
        flat_id: subscriber.flat.flat_id,
        user_id: subscriber.flat.subscriber_id,
        agreement_id: subscriber.flat.agreement_id,
      })
      const data = {

        auth: JSON.parse(userJson),
        flat_id: subscriber.flat.flat_id,
        user_id: subscriber.flat.subscriber_id,
        agreement_id: subscriber.flat.agreement_id,
      };

      this.http.post('http://localhost:3000/agreement/delete/agreement', data)
        .subscribe(
          (response: any) => {
            console.log(response);
            this.subscribers = this.subscribers.filter(item => item.flat.subscriber_id !== item.flat.subscriber_id);
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user or subscriber not found');
    }
  }
}
