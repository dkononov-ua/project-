import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-agree-step',
  templateUrl: './agree-step.component.html',
  styleUrls: ['./agree-step.component.scss'],
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

export class AgreeStepComponent implements OnInit {
  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  numSendAgree: number = 0;
  offs: number = 0;
  // показ карток
  card_info: boolean = false;
  indexPage: number = 0;
  numConcludedAgree: any;
  selectedAgree: any;
  page: any;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }
  selectedFlatId: string | any;
  counterFound: number = 0;
  agreementIds: any
  startX = 0;
  constructor(
    private http: HttpClient,
    private router: Router,
    private selectedFlatIdService: SelectedFlatService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        this.getSelectedFlatID();
      }
    })
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
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
    // console.log(direction)
    if (direction === 'right') {
      if (this.indexPage === 0) {
        this.router.navigate(['/house/house-info']);
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
    const url = this.serverPath + '/agreement/get/agreements';
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
    const url = this.serverPath + '/agreement/get/saveagreements';
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
    const url = this.serverPath + '/agreement/get/act';
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
    const url = this.serverPath + '/acceptsubs/get/CountSubs';
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

