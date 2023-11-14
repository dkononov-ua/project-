import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { promises } from 'dns';
import { AgreeDeleteComponent } from '../agree-delete/agree-delete.component';
import { serverPath, serverPathPhotoUser, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';

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
  selector: 'app-agree-review',
  templateUrl: './agree-review.component.html',
  styleUrls: ['./agree-review.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class AgreeReviewComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatId: any;
  deletingFlatId: string | null = null;
  offer: boolean = true;
  statusMessage: string | undefined;

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
    const url = serverPath + '/agreement/get/agreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
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
  }

  async openDialog(agree: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/delete/agreement';
    const dialogRef = this.dialog.open(AgreeDeleteComponent, {
      data: {
        flatId: agree.flat.flat_id,
        subscriberId: agree.flat.subscriber_id,
        firstName: agree.flat.subscriber_firstName,
        lastName: agree.flat.subscriber_lastName,
        agreementId: agree.flat.agreement_id,
        offer: 4,
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
            this.agree = this.agree.filter(item => item.flat.subscriber_id !== agree.flat.subscriber_id);
          }, 0);
        } catch (error) {
          console.error(error);
        }

      }
    });
  }

  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/user_default.svg';
  }
}

