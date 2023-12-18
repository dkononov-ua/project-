import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UagreeDeleteComponent } from '../uagree-delete/uagree-delete.component';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Agree } from '../../../../interface/info';
@Component({
  selector: 'app-uagree-details',
  templateUrl: './uagree-details.component.html',
  styleUrls: ['./uagree-details.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class UagreeDetailsComponent implements OnInit {

  serverPath = serverPath;
  path_logo = path_logo;

  selectedFlatId: string | null = null;
  agree: Agree[] = [];
  loading: boolean = false;
  isCheckboxChecked = false;
  selectedAgreement: any;
  selectedFlatAgree: any;
  statusMessage: string | undefined;
  deletingFlatId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<any> {
    this.route.params.subscribe(params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
    });
    await this.getAgree();
    this.loading = false;
  }

  async getAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const data = { auth: JSON.parse(userJson!), user_id: user_id, offs: 0 };
    try {
      const response = (await this.http.post(serverPath + '/agreement/get/yagreements', data).toPromise()) as any;
      if (response) {
        this.selectedAgreement = response[0];
      } else { this.selectedAgreement = []; }
    } catch (error) { console.error(error); }
  }

  async agreeAgreement(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        agreement_id: this.selectedAgreement.flat.agreement_id,
        flat_id: this.selectedAgreement.flat.flat_id,
        user_id: this.selectedAgreement.flat.subscriber_id,
        i_agree: true,
      };
      this.loading = true;
      try {
        const response = (await this.http.post(serverPath + '/agreement/accept/agreement', data).toPromise()) as any;
        if (response.status === 'Договір погоджено') {
          this.statusMessage = 'Умови угоди ухвалені!';
          setTimeout(() => {
            this.router.navigate(['/user/uagree-menu'], { queryParams: { indexPage: 3 } });
          }, 3000);
        } else {
          this.statusMessage = 'Помилка ухвалення умов угоди угоди.';
          setTimeout(() => { this.loading = false; this.statusMessage = ''; }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Помилка на сервері, спробуйте пізніше.';
        setTimeout(() => { location.reload }, 2000);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UagreeDeleteComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.removeAgreement();
      }
    });
  }

  async removeAgreement(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/delete/yagreement';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: this.selectedAgreement.flat.flat_id,
      agreement_id: this.selectedAgreement.flat.agreement_id
    };

    try {
      const response = await this.http.post(url, data).toPromise();
      this.deletingFlatId = this.selectedAgreement.flat.flat_id;
      setTimeout(() => {
        this.deletingFlatId = null;
        setTimeout(() => {
          this.router.navigate(['/user/uagree-menu'], { queryParams: { indexPage: 2 } });
        }, 400);
      }, 100);
    } catch (error) {
      console.error(error);
    }
  }

  goBack() {
    this.router.navigate(['/user/uagree-menu'], { queryParams: { indexPage: 2 } });
  }
}

