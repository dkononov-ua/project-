import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { AgreeDeleteComponent } from '../agree-delete/agree-delete.component';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';

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
    subscriber_img: string;
    dateAgreeEnd: string;
    dateAgreeStart: string;

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
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatId: any;
  deletingFlatId: string | null = null;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private dialog: MatDialog,

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
    const url = serverPath + '/agreement/get/saveagreements';
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

  async openDialog(agree: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/delete/act';
    const dialogRef = this.dialog.open(AgreeDeleteComponent, {
      data: {
        flatId: agree.flat.flat_id,
        agreementId: agree.flat.agreement_id,
        subscriberId: agree.flat.subscriber_id,
        subscriber_firstName: agree.flat.subscriber_firstName,
        subscriber_lastName: agree.flat.subscriber_lastName,
        offer: 0,
      }
    });

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
          }, 0);
        } catch (error) {
          console.error(error);
        }

      }
    });
  }

  async openDialog1(agree: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/delete/agreement';
    const dialogRef = this.dialog.open(AgreeDeleteComponent, {
      data: {
        flatId: agree.flat.flat_id,
        agreementId: agree.flat.agreement_id,
        subscriberId: agree.flat.subscriber_id,
        subscriber_firstName: agree.flat.subscriber_firstName,
        subscriber_lastName: agree.flat.subscriber_lastName,
        offer: 1,
      }
    });

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
          setTimeout(() => {
            this.agree = this.agree.filter(item => item.flat.subscriber_id !== agree.flat.subscriber_id);
            location.reload;
          }, 100);
        } catch (error) {
          console.error(error);
        }

      }
    });
  }

  async openDialog2(agree: any): Promise<void> {
    console.log(agree)
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/citizen/add/agreeSit';
    const dialogRef = this.dialog.open(AgreeDeleteComponent, {
      data: {
        flatId: agree.flat.flat_id,
        agreementId: agree.flat.agreement_id,
        subscriberId: agree.flat.subscriber_id,
        subscriber_firstName: agree.flat.subscriber_firstName,
        subscriber_lastName: agree.flat.subscriber_lastName,
        offer: 2,
      }
    });

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
          setTimeout(() => {
            this.agree = this.agree.filter(item => item.flat.subscriber_id !== agree.flat.subscriber_id);
            location.reload;
          }, 100);
        } catch (error) {
          console.error(error);
        }

      }
    });
  }
}



