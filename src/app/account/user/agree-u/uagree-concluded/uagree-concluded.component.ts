import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
interface Agree {
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
    year: number;
    area: number;
  };
  img: string[];
}

@Component({
  selector: 'app-uagree-concluded',
  templateUrl: './uagree-concluded.component.html',
  styleUrls: ['./uagree-concluded.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class UagreeConcludedComponent implements OnInit {

  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatAgree: any;
  responseAgree: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<any> {
    this.route.params.subscribe(params => {
      this.selectedFlatAgree = params['agree.flat.agreement_id'] || null;
    });
    await this.getAgree();
  }

  async getAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/agreement/get/saveyagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      console.log(response)
      this.agree = response;
      this.responseAgree = response;
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }

}

