import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteAgreeHComponent } from '../delete-agree-h/delete-agree-h.component';
import { MatDialog } from '@angular/material/dialog';
import { promises } from 'dns';
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
  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatId: any;
  deletingFlatId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      const offs = 0;
      this.getAgree(offs);
    });

    this.route.params.subscribe(params => {
      this.agree = params['selectedFlatAgree'] || null;
    });
  }

  async getAgree(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/agreement/get/agreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: offs,
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      console.log(response)
      this.agree = response;
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }

  }

  async openDialog(agree: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/agreement/delete/agreement';

    const dialogRef = this.dialog.open(DeleteAgreeHComponent);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && this.selectedFlatId && userJson) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: agree.flat.flat_id,
          user_id: agree.flat.subscriber_id,
          agreement_id: agree.flat.agreement_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.deletingFlatId = agree.flat.flat_id;
          setTimeout(() => {
            this.agree = this.agree.filter(item => item.flat.flat_id !== item.flat.flat_id);
            this.deletingFlatId = null;
            console.log(response)
          }, 0);
        } catch (error) {
          console.error(error);
        }

      }
    });
  }
}
