import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from './services/shared.service';
import { CheckBackendService } from './services/check-backend.service';
import { StatusMessageService } from './services/status-message.service';
import { animations } from '../app/interface/animation';
import { NavigationEnd, Router } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { filter } from 'rxjs';
import { UpdateMetaTagsService } from './services/updateMetaTags.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.bot5,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.appearance,
    animations.fadeIn,
  ],
})

export class AppComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  firstPath: string = ServerConfig.firstPath;
  secondPath: string = ServerConfig.secondPath;
  // ***

  statusMessage: string = '';
  currentLocation: string = '';
  loading: boolean = true;
  statusServer: string = '';

  images = [
    '../assets/bg-img/1.svg',
    '../assets/bg-img/2.svg',
    '../assets/bg-img/3.svg',
    '../assets/bg-img/4.svg',
  ];

  currentImageIndex = 0;
  nextBG: boolean = true;
  authorization: boolean = false;

  changeBG() {
    setInterval(() => {
      this.nextBG = false;
      setTimeout(() => {
        this.nextBG = true;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      }, 100);
    }, 20000);
  }

  get currentImage() {
    return this.images[this.currentImageIndex];
  }

  isMobile: boolean = false;
  subscriptions: any[] = [];
  menu: boolean = false;
  isHomePage = false;

  constructor(
    private http: HttpClient,
    private location: Location,
    private sharedService: SharedService,
    private checkBackendService: CheckBackendService,
    private statusMessageService: StatusMessageService,
    private router: Router,
    private loaderService: LoaderService,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isHomePage = this.location.path() === '';
    });
    this.updateMetaTagsInService();
    await this.getStatusLoader();
    this.checkBackendService.startCheckServer();
    this.currentLocation = this.location.path();
    this.getStatusServer();
    this.getCheckDevice();
    this.getServerPath();
    this.getStatusMessage();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Діскусіо - розміщення оголошень. Здача осель в оренду. Активація профілів орендарів для пошуку житла.',
      description: 'Платформа для управління нерухомістю. Потрібно орендувати оселю? Пошук оселі та пошук орендарів. Знайдемо оселю та орендаря. Сформуємо угоду.',
      keywords: 'нерухомість, пошук орендаря, оренда, пошук оселі, управління нерухомістю, Діскусіо, діскусіо, діскус',
      image: '',
    }
    this.updateMetaTagsService.updateMetaTags(data)
  }

  // підписка на оновлення шляху серверу
  async getStatusServer() {
    this.subscriptions.push(
      this.sharedService.statusServer$.subscribe((status: string) => {
        this.statusServer = status;
        // console.log(this.statusServer);
        if (this.statusServer === 'Перемикаємось на резервний інтернет') {
          this.sharedService.setStatusMessage('Зачекайте');
          this.loading = true;
          setTimeout(() => {
            this.sharedService.setStatusMessage('Перемикаємось на резервний інтернет');
          }, 1000);
        } else if (this.statusServer === 'Перемикаємось на основний інтернет') {
          this.loading = true;
          this.sharedService.setStatusMessage('Зачекайте');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Перемикаємось на основний інтернет');
          }, 1000);
        } else {
          this.loading = false;
          if (this.statusMessage) {
            this.sharedService.setStatusMessage('');
          }
        }
      })
    );
  }

  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
        if (!this.isMobile) {
          this.changeBG();
        }
      })
    );
  }

  // підписка на статус для показу користувачу
  async getStatusMessage() {
    this.subscriptions.push(
      this.statusMessageService.statusMessage$.subscribe((message: string) => {
        // console.log(message);
        this.statusMessage = message;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
        if (this.serverPath) {
          await this.getUserInfo();
        }
      })
    );
  }

  // Отримання статусу лоадера
  async getStatusLoader() {
    this.subscriptions.push(
      this.loaderService.loading$.subscribe((status: boolean) => {
        // console.log(status)
        this.loading = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // перевірка користувача на авторизацію, виконується кожен раз при перезавантаженні сторінки
  async getUserInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/auth', JSON.parse(userJson)).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.authorization = true;
        } else {
          this.authorization = false;
          this.sharedService.logout();
        }
      } catch (error) {
        this.authorization = false;
        this.sharedService.logout();
      }
    }
  }


}
