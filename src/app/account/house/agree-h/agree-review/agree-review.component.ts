import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { AgreeDeleteComponent } from '../agree-delete/agree-delete.component';
import { serverPath, serverPathPhotoUser, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Agree } from '../../../../interface/info';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-agree-review',
  templateUrl: './agree-review.component.html',
  styleUrls: ['./agree-review.component.scss'],
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
    private router: Router,
    private sharedService: SharedService,
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
      const response: any = (await this.http.post(url, data).toPromise()) as Agree[];
      if (response === false) {
        this.sharedService.setStatusMessage('Надісланих угод немає');
        setTimeout(() => {
          this.router.navigate(['/house/agree/menu']);
          this.sharedService.setStatusMessage('');
        }, 300);
      } else {
        this.agree = response;
      }
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
          this.loading = true;
          const response: any = await this.http.post(url, data).toPromise();
          console.log()
          if (response.status === true) {
            this.sharedService.setStatusMessage('Угода скасована');
            this.deletingFlatId = agree.flat.flat_id;
            setTimeout(() => {
              location.reload();
            }, 300);
          } else {
            this.sharedService.setStatusMessage('Помилка скасування');
            setTimeout(() => {
              location.reload();
            }, 300);
          }
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

