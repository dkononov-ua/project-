import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../interface/animation';
import { SelectedFlatService } from '../services/selected-flat.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.bot,
    animations.top1,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  authorization: boolean = false;
  authorizationHouse: boolean = false;
  selectedFlatId!: number | null;
  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];

  scrollToAnchor(): void {
    setTimeout(() => {
      const element = this.el.nativeElement.querySelector(`#content`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }

  constructor(
    private el: ElementRef,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
  ) {  }

  async ngOnInit(): Promise<void> {
    this.scrollToAnchor();
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectedFlat();
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на пристрій
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
      })
    );
  }

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (this.selectedFlatId) {
          this.authorizationHouse = true;
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  // Перехід до оселі
  goToHouse() {
    if (this.authorizationHouse) {
      setTimeout(() => {
        this.router.navigate(['/house']);
      }, 100);
    } else {
      this.sharedService.setStatusMessage('Переходимо до вибору оселі');
      setTimeout(() => {
        this.router.navigate(['/house/house-control/selection-house']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
