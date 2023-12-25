import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';

@Component({
  selector: 'app-agree-menu',
  templateUrl: './agree-menu.component.html',
  styleUrls: ['./agree-menu.component.scss'],
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
export class AgreeMenuComponent implements OnInit {
  numSendAgree: number = 0;
  offs: number = 0;


  // показ карток
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  numConcludedAgree: any;
  selectedAgree: any;
  page: any;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  selectedFlatId: string | any;
  counterFound: number = 0;
  agreementIds: any

  constructor(
    private http: HttpClient,
    private router: Router,
    private selectedFlatIdService: SelectedFlatService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      console.log(params['indexPage'])

      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
    this.getSelectedFlatID();
  }

  getSelectedFlatID() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        await this.getSendAgree();
        await this.getConcludedAgree();
        await this.getAcceptSubsCount();
        await this.getActAgree();
      }
    });
  }

  async getSendAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/agreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
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
    const url = serverPath + '/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: this.offs,
    };
    try {
      const response: any = (await this.http.post(url, data).toPromise()) as any;
      if (response) {
        const agreementIds = response.map((item: { flat: { agreement_id: any; }; }) => item.flat.agreement_id);
        this.agreementIds = agreementIds;
        this.numConcludedAgree = response.length;
      } else {
        this.numConcludedAgree = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getActAgree(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/act';
    const offs = 0; // Поточне значення offs

    // Масив для зберігання результатів перевірки існування акта
    const actExistsArray = [];

    if (this.agreementIds) {
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
          // Додаємо результат до масиву
          actExistsArray.push({
            agreement_id: agreementId,
            exists: response.length > 0
          });
        }
        // Виводимо результати
      } catch (error) {
        console.error(error);
        return null;
      }
    }

  }


  // Перегляд статистики комунальних
  goToAgreeCreate() {
    if (this.counterFound !== 0) {
      this.router.navigate(['/agree-create/']);
    }
  }

  // Перегляд статистики комунальних
  goToActCreate() {
    if (this.counterFound !== 0) {
      this.router.navigate(['/house/act-create']);
    }
  }

  // Перегляд статистики комунальних
  goToAgreeReview() {
    if (this.numSendAgree !== 0) {
      this.router.navigate(['/house/agree-review']);
    }
  }

  // Перегляд статистики комунальних
  goToConcluded() {
    if (this.numConcludedAgree !== 0) {
      this.router.navigate(['/house/agree-concluded']);
    }
  }


  // Дискусії
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountSubs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };

    try {
      const response: any = await this.http.post(url, data).toPromise() as any;
      this.counterFound = response.status;
    }
    catch (error) {
      console.error(error)
    }
  }



}
