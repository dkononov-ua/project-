import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { CounterService } from 'src/app/services/counter.service';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { StatusDataService } from 'src/app/services/status-data.service';
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  animations: [
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.swichCard,
  ],
})
export class UserPageComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***

  loading: boolean = false;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  counterUserNewAgree: any;

  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private counterService: CounterService,
    private location: Location,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );

    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );

    this.getInfoUser();
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getCounterAgree();
      await this.getUserDiscussioCount();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
    }
  }

  // перевірка підписників оселі
  async getUserSubscribersCount() {
    this.subscriptions.push(
      this.counterService.counterUserSubscribers$.subscribe(data => {
        this.counterUserSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок оселі
  async getUserSubscriptionsCount() {
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        this.counterUserSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій оселі
  async getUserDiscussioCount() {
    this.subscriptions.push(
      this.counterService.counterUserDiscussio$.subscribe(data => {
        this.counterUserDiscussio = Number(data);
      })
    );
  }

  getCounterAgree() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
      if (counterUserNewAgree) {
        this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
      } else {
        this.counterUserNewAgree = 0;
      }
    } else {
      this.counterUserNewAgree = 0;
    }
  }

  getInfoUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe(
        (response) => {
          if (response.status === true) {
            this.statusDataService.setUserData(response.cont, 0);
          } else {
            this.sharedService.logout();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

}
