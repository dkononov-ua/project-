import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Agree } from 'src/app/interface/info';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-uagree-step',
  templateUrl: './uagree-step.component.html',
  styleUrls: ['./uagree-step.component.scss'],
  animations: [
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
  ],
})
export class UagreeStepComponent {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  loading: boolean = true;
  selectedFlatAgree: any;
  responseAgree: any;
  offs: number = 0;
  numSendAgree: number = 0;
  agreementIds: any[] | undefined;
  counterDiscussi: number = 0;
  agree: Agree[] = [];

  // показ карток
  card_info: boolean = false;
  indexPage: number = 1;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  numConcludedAgree: any;
  selectedAgree: any;
  page: any;
  countTrueExists: number = 0;
  startX = 0;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
    await this.getSendAgree();
    await this.getAcceptSubsCount();
    await this.getAgree();
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }
  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    console.log(direction)
    if (direction === 'right') {
      if (this.indexPage === 0) {
        this.router.navigate(['/user/info']);
      } else if (this.indexPage === 3 && this.numSendAgree === 0) {
        this.indexPage = 1;
      } else {
        this.indexPage--;
      }
    } else {
      if (this.indexPage === 0) {
        this.indexPage++;
      } else if (this.indexPage === 1 && this.numSendAgree !== 0) {
        this.indexPage++;
      } else if (this.indexPage === 1 && this.numSendAgree === 0) {
        this.indexPage = 3;
      } else if (this.indexPage === 2 && this.numConcludedAgree !== 0) {
        this.indexPage++;
      }
    }
  }

  async getSendAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: this.offs,
    };
    try {
      const response = (await this.http.post(serverPath + '/agreement/get/yagreements', data).toPromise()) as any;
      if (response) {
        this.numSendAgree = response.length;
      } else {
        this.numSendAgree = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/get/saveyagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };
    try {
      const response:any = (await this.http.post(url, data).toPromise()) as Agree[];
      // console.log(response)
      if (response && response[0].status !== 'Авторизуйтесь') {
        const agreementIds = response.map((item: { flat: { agreement_id: any; }; }) => item.flat.agreement_id);
        this.agreementIds = agreementIds;
        this.agree = response;
        this.numConcludedAgree = response.length;
        await this.getActAgree();
      }
      else {
        this.numConcludedAgree = 0;
        console.log('Авторизуйтесь')
        this.sharedService.logout();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getActAgree(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/get/yAct';
    try {
      if (this.agreementIds) {
        // Використовуємо map для отримання масиву промісів
        const promises = this.agreementIds.map(async (agreementId) => {
          const data = {
            auth: JSON.parse(userJson!),
            agreement_id: agreementId,
            user_id: user_id,
          };

          // Виконуємо запит для кожного agreement_id
          const response = await this.http.post(url, data).toPromise() as any[];

          // Шукаємо угоду за agreement_id у масиві this.agree
          const agreement = this.agree.find((agreement) => agreement.flat.agreement_id === agreementId);

          if (agreement) {
            // Оновлюємо існуючу угоду, додаючи інформацію про наявність акту
            agreement.exists = response.length > 0;
            if (agreement.exists) {
              this.countTrueExists++;
            }
          }
        });
        await Promise.all(promises);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Дискусії
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountYsubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response: any = await this.http.post(url, data).toPromise() as any;
      this.counterDiscussi = response.status;
    }
    catch (error) {
      console.error(error)
    }
  }

}

