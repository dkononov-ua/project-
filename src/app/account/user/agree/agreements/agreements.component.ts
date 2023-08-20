import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAgreeComponent } from '../delete-agree/delete-agree.component';

interface subscription {
  flat: {
    flat_id: string;
    price: number;
    agreementDate: string;
    owner_lastName: string;
    subscriber_firstName: string;
    subscriber_lastName: string;
    subscriber_surName: string;
    subscriber_img: string;
    photo: string;
    instagram: string;
    telegram: string;
    viber: string;
    facebook: string;
    subscriber_id: string;
    agreement_id: any;
    street: string;
    city: string;
    region: string;
    area: string;
    floor: string;
    year: number;
    month: number;
    about: string;
    agreement_type: number;
    apartment: number;
    days: number;
    houseNumber: number;
    max_penalty: number;
    owner_email: string;
    owner_firstName: string;
    owner_id: string;
    owner_img: string;
    owner_surName: string;
    owner_tell: number;
    penalty: number;
    rent_due_data: number;
  }
  img: [any];
}

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent implements OnInit {
  subscriptions: subscription[] = [];
  userId: string | any;
  flatId: any;
  deletingFlatId: string | null = null;
  selectedFlatId: any;
  selectedFlatAgree: any;
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
    });

    this.getSubscribedFlats();
  }

  openDialog(subscriber: any): void {
    const dialogRef = this.dialog.open(DeleteAgreeComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.removeAgreement(subscriber);
        location.reload();
      }
    });
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
    const url = 'http://localhost:3000/agreement/get/yagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)
      this.subscriptions = response;
      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  }

  async removeAgreement(subscriber: any): Promise<void> {
    this.selectedFlatId = subscriber.flat.flat_id;
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/agreement/delete/yagreement';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: subscriber.flat.flat_id,
      agreement_id: subscriber.flat.agreement_id
    };

    try {
      const response = await this.http.post(url, data).toPromise();
      this.deletingFlatId = subscriber.flat.flat_id;
      setTimeout(() => {
        this.subscriptions = this.subscriptions.filter(subscriber => subscriber.flat.flat_id !== subscriber.flat.flat_id);
        this.deletingFlatId = null;
      }, 0);
    } catch (error) {
      console.error(error);
    }
  }
}



