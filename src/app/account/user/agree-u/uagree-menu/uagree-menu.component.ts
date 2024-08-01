import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as ServerConfig from 'src/app/config/path-config';
import { Agree } from 'src/app/interface/info';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-uagree-menu',
  templateUrl: './uagree-menu.component.html',
  styleUrls: ['./uagree-menu.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.bot,
  ],
})
export class UagreeMenuComponent implements OnInit, OnDestroy {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  loading: boolean = true;
  selectedFlatAgree: any;
  responseAgree: any;
  offs: number = 0;
  numSendAgree: number = 0;
  agreementIds: any[] | undefined;
  counterUserDiscussio: number = 0;
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
  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private counterService: CounterService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
  }

  // підписка на шлях до серверу
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
        if (this.serverPath) {
          await this.getSendAgree();
          await this.getUserDiscussioCount();
          await this.getAgree();
        }
      })
    );
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
      const response = (await this.http.post(this.serverPath + '/agreement/get/yagreements', data).toPromise()) as any;
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
    const url = this.serverPath + '/agreement/get/saveyagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };
    try {
      const response: any = (await this.http.post(url, data).toPromise()) as Agree[];
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
        // console.log('Авторизуйтесь')
        // this.sharedService.logout();
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

  // перевірка дискусій користувача
  async getUserDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserDiscussio$.subscribe(data => {
      const counterUserDiscussio: any = data;
      this.counterUserDiscussio = counterUserDiscussio;
      // console.log('кількість дискусій', this.counterUserDiscussio)
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }
}
