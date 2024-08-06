import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as ServerConfig from 'src/app/config/path-config';
import { Agree } from '../../../../interface/info';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { ConfirmActionsComponent } from 'src/app/components/agreements/confirm-actions/confirm-actions.component';

@Component({
  selector: 'app-agree-user-review',
  templateUrl: './agree-user-review.component.html',
  styleUrls: ['./agree-user-review.component.scss'],
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
export class AgreeUserReviewComponent implements OnInit {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.route.params.subscribe(params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
    });
    this.getSendAgree();
  }

  confirmActions(agreement: any) {
    const dialogRef = this.dialog.open(ConfirmActionsComponent, {
      data: { actions: 'reject', flat_id: agreement.flat.flat_id, owner_firstName: agreement.flat.owner_firstName, owner_lastName: agreement.flat.owner_lastName }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        await this.removeAgreement(agreement);
      }
    });
  }

  async getSendAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = this.serverPath + '/agreement/get/yagreements';
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
    const url = this.serverPath + '/agreement/delete/yagreement';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: agreement.flat.flat_id,
      agreement_id: agreement.flat.agreement_id
    };
    try {
      const response = await this.http.post(url, data).toPromise();
      if (response) {
        this.sharedService.setStatusMessage('Угода видалена');
        setTimeout(() => {
          location.reload();
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




