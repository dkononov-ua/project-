import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UagreeDeleteComponent } from '../uagree-delete/uagree-delete.component';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Agree } from '../../../../interface/info';
@Component({
  selector: 'app-uagree-review',
  templateUrl: './uagree-review.component.html',
  styleUrls: ['./uagree-review.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})
export class UagreeReviewComponent implements OnInit {
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  agree: Agree[] = [];
  userId: string | any;
  flatId: any;
  deletingFlatId: string | null = null;
  selectedFlatId: any;
  selectedFlatAgree: any;
  subResponse: any;
  statusMessage: string | undefined;

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
    this.getSendAgree();
  }

  openDialog(agreement: any): void {
    const dialogRef = this.dialog.open(UagreeDeleteComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.removeAgreement(agreement);
      }
    });
  }

  async getSendAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/get/yagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      if (response) {
        this.agree = response;
      } else {
        this.agree = [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async removeAgreement(agreement: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/delete/yagreement';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: agreement.flat.flat_id,
      agreement_id: agreement.flat.agreement_id
    };
    try {
      const response = await this.http.post(url, data).toPromise();
      if (response) {
        this.statusMessage = 'Угода видалена';
        setTimeout(() => {
          this.getSendAgree();
          this.statusMessage = '';
        }, 2000);
      } else {
        console.log('Помилка видалення')
      }
    } catch (error) {
      console.error(error);
    }
  }

  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/housing_default.svg';
  }
}




