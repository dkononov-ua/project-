import { Component, OnDestroy, OnInit } from '@angular/core';
import { animations } from '../../interface/animation';
import * as ServerConfig from 'src/app/config/path-config';
import { SelectedFlatService } from '../../services/selected-flat.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    animations.top2,
    animations.bot3,
    animations.left1,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  indexPage: number = 0;
  selectedFlatId!: string | null;
  openSearchHouse: boolean = false;
  loading: boolean = false;
  startX = 0;

  goBack(): void {
    this.location.back();
  }
  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private location: Location,
    private sharedService: SharedService,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.updateMetaTagsInService();
    await this.getCheckDevice();
    await this.getServerPath();
    await this.getSelectedFlatId();
    this.checkUserAuthorization();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Пошук - Discussio™. Пошук житла, квартири, будинку, орендаря, орендарів',
      description: 'Знайти оселю вам допоможе Discussio пошук оселі. Знайти орендарів вам допоможе Discussio пошук орендарів.',
      keywords: 'Пошук житла, квартири, будинку, орендаря, орендарів, перевірені, оселі, орендарі, кімнати, кімната, сусід',
      image: '',
    }
    this.updateMetaTagsService.updateMetaTags(data)
  }

  // перевірка на девайс
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

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.checkHouseAuthorization();
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на авторизацію оселі
  async checkHouseAuthorization() {
    const houseData = localStorage.getItem('houseData');
    if (this.selectedFlatId && houseData) {
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
    } else {
      this.authorizationHouse = false;
      this.houseData = false;
    }
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
    if (direction === 'right') {
      this.router.navigate(['/search-house']);
    } else {
      if (this.selectedFlatId) {
        this.router.navigate(['/search-tenants']);
      } else {
        this.router.navigate(['/user/info']);
      }
    }
  }

  goToSearchTenants() {
    this.router.navigate(['/search-tenants']);
    // if (this.selectedFlatId) {
    //   this.authorizationHouse = true;
    //   this.router.navigate(['/search-tenants/filter']);
    // } else {
    //   this.authorizationHouse = false;
    //   this.sharedService.getAuthorizationHouse();
    // }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
