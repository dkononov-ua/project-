import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
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
  selector: 'app-agree-concluded',
  templateUrl: './agree-concluded.component.html',
  styleUrls: ['./agree-concluded.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class AgreeConcludedComponent implements OnInit {
  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatId: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      const offs = 0;
      this.getAgree(selectedFlatId, offs);
    });

    this.route.params.subscribe(params => {
      this.agree = params['selectedFlatAgree'] || null;
    });
  }

  async getAgree(selectedFlatId: string | null, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      this.agree = response;
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
    this.selectedFlatId = selectedFlatId;
  }
}



