import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
@Component({
  selector: 'app-uagree-menu',
  templateUrl: './uagree-menu.component.html',
  styleUrls: ['./uagree-menu.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
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

  // показ карток
  card_info: boolean = false;
  indexPage: number = 3;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  numConcludedAgree: any;
  selectedAgree: any;
  page: any;
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
    await this.getConcludedAgree();
    await this.getSendAgree();
    await this.getAcceptSubsCount();
  }

  async getSendAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;

    const url = serverPath + '/agreement/get/yagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: this.offs,
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as any;
      if (response) {
        this.numSendAgree = response.length;
      } else {
        this.numSendAgree = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getConcludedAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    const user_id = JSON.parse(userData!).inf.user_id;
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: this.offs,
    };
    console.log(data)

    try {
      const response: any = (await this.http.post(serverPath + '/agreement/get/saveyagreements', data).toPromise()) as any;
      console.log(response)
      if (response) {
        this.responseAgree = response;
        this.loading = false;
        const agreementIds = response.map((item: { flat: { agreement_id: any; }; }) => item.flat.agreement_id);
        this.agreementIds = agreementIds;
        this.numConcludedAgree = response.length;
      } else {
        this.numConcludedAgree = 0;
      }

    } catch (error) {
      console.error(error);
      this.loading = false;
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
