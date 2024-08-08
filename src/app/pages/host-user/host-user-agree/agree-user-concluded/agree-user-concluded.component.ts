import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as ServerConfig from 'src/app/config/path-config';
import { Agree } from '../../../../interface/info';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-agree-user-concluded',
  templateUrl: './agree-user-concluded.component.html',
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

export class AgreeUserConcludedComponent implements OnInit {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatAgree: any;
  responseAgree: any;
  statusMessage: string | undefined;
  agreementIds: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        await this.getAgree();
      }
    })
  }

  async getAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = this.serverPath + '/agreement/get/saveyagreements';
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
    const url = this.serverPath + '/agreement/get/yAct';
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

