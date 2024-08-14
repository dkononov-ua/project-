import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { AgreeDeleteComponent } from '../agree-delete/agree-delete.component';
import * as ServerConfig from 'src/app/config/path-config';
import { Agree } from '../../../../interface/info';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-agree-concluded',
  templateUrl: './agree-concluded.component.html',
  styleUrls: ['./../../../../style/agree/agree_menu.scss'],
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

  offs: number = 0;
  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  counterHouseSubscribers: number = 0;
  counterHouseSubscriptions: number = 0;
  counterHouseDiscussio: number = 0;
  counterHouseNewMessage: number = 0;
  counterHouseSendAgree: number = 0;
  counterHouseConcludedAgree: number = 0;
  houseConcludedAgreeIds: any = [];
  houseSendAgree: any = [];
  actExistsArray: any = [];
  counterActExistsArray: number = 0;

  acces_agreement: number = 1;
  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  selectedFlatId!: string | null;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  deletingFlatId: string | null = null;

  agreements: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService,
    private statusMessageService: StatusMessageService,
    private counterService: CounterService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.loadDataFlat();
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getSelectParam();
    } else {
      this.authorization = false;
    }
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  getSelectParam() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        if (flatId) {
          this.selectedFlatId = flatId || this.selectedFlatId || null;
        } else {
          this.sharedService.logoutHouse();
        }
      })
    );
  }

  // Беру дані своєї оселі з локального сховища
  async loadDataFlat(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_agreement = this.houseData.acces.acces_agreement;
      if (this.acces_agreement === 1) {
        this.getCheckedAgreements();
      } else {
        this.statusMessageService.setStatusMessage('Немає доступу до угод оселі');
        setTimeout(() => {
          this.router.navigate(['/house/agree/about']);
          this.statusMessageService.setStatusMessage('');
        }, 1500);
      }
    } else {
      this.getCheckedAgreements();
    }
  }

  // Перевіряємо чи сформовані акти передачі оселі по ухваленим угодам
  getCheckedAgreements() {
    this.subscriptions.push(
      this.counterService.actExistsArray$.subscribe(data => {
        this.agreements = data;
      })
    );
  }

  async openDialog(agree: any): Promise<void> {
    console.log(agree)
    const userJson = localStorage.getItem('user');
    const url = this.serverPath + '/agreement/delete/act';
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
            this.sharedService.setStatusMessage('Акт видалений');
            setTimeout(() => {
              this.counterService.getHouseConcludedAgree(this.selectedFlatId, 0);
              this.sharedService.setStatusMessage('');
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
    const url = this.serverPath + '/agreement/delete/agreement';
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
            this.sharedService.setStatusMessage('Угода видалена');
            setTimeout(() => {
              location.reload();
            }, 500);
          } else {
            this.sharedService.setStatusMessage('Помилка видалення');
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
    const url = this.serverPath + '/citizen/add/agreeSit';
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
          console.log(response)
          this.sharedService.setStatusMessage('Мешканець доданий до оселі');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Переходимо до мешканців оселі');
            setTimeout(() => {
              this.router.navigate(['/house/residents/resident']);
              this.sharedService.setStatusMessage('');
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



