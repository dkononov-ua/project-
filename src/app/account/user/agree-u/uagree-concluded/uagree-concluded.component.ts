import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Agree } from '../../../../interface/info';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-uagree-concluded',
  templateUrl: './uagree-concluded.component.html',
  styleUrls: ['./uagree-concluded.component.scss'],
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

export class UagreeConcludedComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatAgree: any;
  responseAgree: any;
  statusMessage: string | undefined;
  agreementIds: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<any> {
    await this.getAgree();
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
        // console.log(this.agree)
        await this.getActAgree();
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
      for (const agreementId of this.agreementIds) {
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
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/housing_default.svg';
  }
}

