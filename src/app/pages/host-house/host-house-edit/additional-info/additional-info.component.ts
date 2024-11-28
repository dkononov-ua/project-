import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { MenuService } from 'src/app/services/menu.service';
import { DataService } from 'src/app/services/data.service';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { LoaderService } from 'src/app/services/loader.service';

interface FlatInfo {
  osbb_name: string | undefined;
  osbb_phone: string | undefined;
  pay_card: string | undefined;
  wifi: string | undefined;
  info_about: string | undefined;
}

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.appearance,

  ],
})

export class AdditionalInfoComponent implements OnInit, OnDestroy {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;
  totalParam: number = 0;
  activeFilter: number = 0;
  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  flatInfo: FlatInfo = {
    osbb_name: '',
    osbb_phone: '',
    pay_card: '',
    wifi: '',
    info_about: '',
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;
  phonePattern = '^[0-9]{10}$';

  formatCreditCard(event: any) {
    let input = event.target.value;
    input = input.replace(/\D/g, '');

    if (input.length > 16) {
      input = input.slice(0, 16);
    }

    if (input.length > 0) {
      input = input.match(new RegExp('.{1,4}', 'g')).join(' ');
    }

    this.flatInfo.pay_card = input;
  }


  helpRent: boolean = false;
  helpRoom: boolean = false;
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

  async setToogleMenu() {
    this.menuService.toogleMenuEditHouse(false)
  }

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private menuService: MenuService,
    private dataService: DataService,
    private statusMessageService: StatusMessageService,
    private loaderService: LoaderService,

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

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/get/flatinf', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId }).toPromise();
        // console.log(response)
        if (response) {
          this.flatInfo = response[0];
          this.countActiveFilters();
        }
      } catch (error) {
        this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
          location.reload();
        }, 1500);
      }
    }
  };

  // Метод для підрахунку кількості задіяних фільтрів
  countFilter(): number {
    const totalFields = 5;
    let count = 0;
    if (this.flatInfo.info_about) count++;
    if (this.flatInfo.osbb_name) count++;
    if (this.flatInfo.osbb_phone) count++;
    if (this.flatInfo.pay_card) count++;
    if (this.flatInfo.wifi) count++;
    this.totalParam = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  countActiveFilters() {
    this.activeFilter = this.countFilter();
  }

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/flatinf', {
          auth: JSON.parse(userJson),
          new: this.flatInfo,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response.status) {
          this.sharedService.setStatusMessage("Допоміжна інформація збережена");
          setTimeout(() => {
            this.updateFlatInfo();
          }, 1500);
        } else {
          this.sharedService.setStatusMessage("Помилка збереження");
          this.reloadPageWithLoader()
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Оновлюю дані по оселі
  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          this.loaderService.setLoading(true);
          this.statusMessageService.setStatusMessage('Оновлення інформації...');
          localStorage.removeItem('additionalHouseInfo');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  clearInfo(): void {
    this.flatInfo = {
      osbb_name: '',
      osbb_phone: '',
      pay_card: '',
      wifi: '',
      info_about: '',
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
