import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { LyDialog } from '@alyle/ui/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { MissingParamsService } from '../missing-params.service';
import { DataService } from 'src/app/services/data.service';
import { HouseInfo } from 'src/app/interface/info';
import { HouseConfig } from 'src/app/interface/param-config';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
  ],
})

export class AboutComponent implements OnInit, OnDestroy {
  minValue: number = 0;
  maxValue: number = 1000000;
  loading = false;

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  flatInfo: HouseInfo = HouseConfig;

  selectedFlatId!: string | null;
  descriptionVisibility: { [key: string]: boolean } = {};
  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }
  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  helpRent: boolean = false;
  helpRoom: boolean = false;
  helpPhoto: boolean = false;
  helpPriority: boolean = false;
  statusMessage: string | undefined;

  openHelpRent() {
    this.helpRent = !this.helpRent;
  }

  openHelpRoom() {
    this.helpRoom = !this.helpRoom;
  }

  openHelpPriority() {
    this.helpPriority = !this.helpPriority;
  }

  isMobile = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private _dialog: LyDialog,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    await this.getSelectedFlatId();
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
        if (this.selectedFlatId) {
          this.getInfo();
        } else {
          this.sharedService.logoutHouse();
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.removeItem('houseData');
          localStorage.setItem('houseData', JSON.stringify(response));
          this.sharedService.setStatusMessage('Оновлюємо інформацію...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      if (this.flatInfo.option_pay === 2) {
        this.flatInfo.price_m = 1;
        this.flatInfo.price_d = 1;
      }
      const data = {
        students: this.flatInfo.students || undefined,
        woman: this.flatInfo.woman || undefined,
        man: this.flatInfo.man || undefined,
        family: this.flatInfo.family || undefined,
        bunker: this.flatInfo.bunker || undefined,
        animals: this.flatInfo.animals || 'Неважливо',
        option_pay: this.flatInfo.option_pay || 0,
        price_d: this.flatInfo.price_d,
        price_m: this.flatInfo.price_m,
        price_s: this.flatInfo.price_s || undefined,
        about: this.flatInfo.about || undefined,
        private: this.flatInfo.private || false,
        rent: false,
        room: this.flatInfo.room || 0,
      }
      // console.log(data)
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        // console.log(response)
        if (response && response.status === 'Параметри успішно додані') {
          this.sharedService.setStatusMessage('Параметри успішно збережено');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.missingParamsService.checkResponse(response);
          }, 1500);
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }, 500);
        }

      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    } else {
      this.loading = false;
      console.log('user not found, the form is blocked');
    }
  }

  async getInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId }).toPromise();
        // console.log(response)
        if (response && response.about) {
          this.flatInfo = response.about;
        } else {
          console.log('about not found in response.');
        }
      } catch (error) {
        this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
          location.reload();
        }, 1500);
      }
    } else {
      console.log('user not found');
    }
  };

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
