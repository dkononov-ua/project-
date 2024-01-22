import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Agree } from 'src/app/interface/info';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-uagree-menu',
  templateUrl: './uagree-menu.component.html',
  styleUrls: ['./uagree-menu.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class UagreeMenuComponent {
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

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
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
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      if (response) {
        const agreementIds = response.map((item: { flat: { agreement_id: any; }; }) => item.flat.agreement_id);
        this.agreementIds = agreementIds;
        this.agree = response;
        this.numConcludedAgree = response.length;
        await this.getActAgree();
      }
      else {
        this.numConcludedAgree = 0;
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
