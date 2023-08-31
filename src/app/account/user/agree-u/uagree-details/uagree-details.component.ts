import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UagreeDeleteComponent } from '../uagree-delete/uagree-delete.component';

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
    about: string;
  };
  img: string[];
}

@Component({
  selector: 'app-uagree-details',
  templateUrl: './uagree-details.component.html',
  styleUrls: ['./uagree-details.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],

})
export class UagreeDetailsComponent implements OnInit {
  selectedFlatId: string | null = null;
  agree: Agree[] = [];
  loading: boolean = false;
  isCheckboxChecked = false;
  selectedAgreement: any;
  selectedFlatAgree: any;
  statusMessage: string | undefined;
  deletingFlatId: string | null = null;
  agreement: Agree[] = [];

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
    this.onChange()
  }

  async getAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/agreement/get/yagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      this.agree = response;
    } catch (error) {
      console.error(error);
    }
  }

  onChange(): void {
    if (this.selectedFlatAgree) {
      this.selectedAgreement = this.agree.find((agreement) => agreement.flat.flat_id === this.selectedFlatAgree);
      this.selectedFlatId = this.selectedFlatAgree
      if (this.selectedAgreement) {
      }
    } else {
      console.log('Nothing selected');
    }
  }

  agreeAgreement(a: any): void {
    this.loading = true;

    const selectedFlatId = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        agreement_id: this.selectedAgreement.flat.agreement_id,
        flat_id: selectedFlatId,
        user_id: this.selectedAgreement.flat.subscriber_id,
        i_agree: true,
      };

      this.http.post('http://localhost:3000/agreement/accept/agreement', data)
        .subscribe(
          (response: any) => {
            setTimeout(() => {
              this.loading = true;
              setTimeout(() => {
                this.statusMessage = 'Умови угоди ухвалені!';
                setTimeout(() => {
                  this.router.navigate(['/user/uagree-concluded']);
                }, 4000);
              }, 100);
            }, 3000);
          },
          (error: any) => {
            console.error(error);
            setTimeout(() => {
              this.loading = false;
              this.statusMessage = 'Помилка ухвалення умов угоди угоди.';
            }, 3000);
          }
        );
    } else {
      console.log('User, flat, or subscriber not found');
      this.loading = false;
    }
  }

  openDialog(agreement: any): void {
    const dialogRef = this.dialog.open(UagreeDeleteComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.removeAgreement(agreement);
      }
    });
  }

  async removeAgreement(agreement: any): Promise<void> {
    this.selectedFlatId = agreement.flat.flat_id;
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/agreement/delete/yagreement';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: agreement.flat.flat_id,
      agreement_id: agreement.flat.agreement_id
    };

    try {
      const response = await this.http.post(url, data).toPromise();
      this.deletingFlatId = agreement.flat.flat_id;
      setTimeout(() => {
        this.agreement = this.agreement.filter(item => item.flat.flat_id !== agreement.flat.flat_id);
        this.deletingFlatId = null;
        setTimeout(() => {
          this.router.navigate(['/user/uagree-review']);
        }, 400);

      }, 100);
    } catch (error) {
      console.error(error);
    }
  }
}

