import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { AgreeDeleteComponent } from '../agree-delete/agree-delete.component';
import { serverPath, serverPathPhotoUser, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Agree } from '../../../../interface/info';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-agree-concluded',
  templateUrl: './agree-concluded.component.html',
  styleUrls: ['./agree-concluded.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.top2,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class AgreeConcludedComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatId: any;
  deletingFlatId: string | null = null;

  agreementIds: any;
  offs: number = 0;
  numConcludedAgree: any;
  statusMessage: string | undefined;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<any> {
    this.getSelectedFlatID();
    this.loading = false;
  }

  getSelectedFlatID() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        await this.getConcludedAgree();
        await this.getActAgree();
      }
    });
  }

  async getConcludedAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: this.offs,
    };
    try {
      const response: any = (await this.http.post(url, data).toPromise()) as any;
      // console.log(response)
      if (response) {
        this.agree = response;
        this.numConcludedAgree = response.length;
        const agreementIds = response.map((item: { flat: { agreement_id: any; }; }) => item.flat.agreement_id);
        this.agreementIds = agreementIds;

      } else {
        this.loading = true;
        this.statusMessage = 'Ухвалених угод немає';
        this.numConcludedAgree = 0;
        setTimeout(() => {
          this.router.navigate(['/house/agree-menu'], { queryParams: { indexPage: 1 } });
          this.loading = false;
        }, 300);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getActAgree(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/act';
    const offs = 0; // Поточне значення offs
    try {
      for (const agreementId of this.agreementIds) {
        const data = {
          auth: JSON.parse(userJson!),
          flat_id: this.selectedFlatId,
          agreement_id: agreementId,
          offs
        };

        // Виконуємо запит для кожного agreement_id
        const response = await this.http.post(url, data).toPromise() as any[];
        // console.log(response)

        // Шукаємо угоду за agreement_id у масиві this.agree
        const agreement = this.agree.find((agreement) => agreement.flat.agreement_id === agreementId);

        if (agreement) {
          // Оновлюємо існуючу угоду, додаючи інформацію про наявність акту
          agreement.exists = response.length > 0;
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
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
          if (response) {
            this.statusMessage = 'Акт видалений';
            setTimeout(() => {
              this.getActAgree();
              this.statusMessage = '';
            }, 2000);
          } else {
            console.log('Помилка видалення')
          }
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
          if (response) {
            this.statusMessage = 'Угода видалена';
            setTimeout(() => {
              location.reload();
            }, 500);
          } else {
            this.statusMessage = 'Помилка видалення';
            setTimeout(() => {
              location.reload();
            }, 500);
          }

        } catch (error) {
          console.error(error);
        }

      }
    });
  }

  async openDialog2(agree: any): Promise<void> {
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
          this.loading = true;
          const response = await this.http.post(url, data).toPromise();
          console.log(response)
          this.statusMessage = 'Мешканець доданий до оселі';
          setTimeout(() => {
            this.statusMessage = 'Переходимо до мешканців оселі';
            setTimeout(() => {
              this.router.navigate(['/house/resident'], { queryParams: { indexPage: 2, indexCard: 0 } });
            }, 2000);
          }, 2000);
          // setTimeout(() => {
          //   this.agree = this.agree.filter(item => item.flat.subscriber_id !== agree.flat.subscriber_id);
          //   location.reload;
          // }, 100);
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



