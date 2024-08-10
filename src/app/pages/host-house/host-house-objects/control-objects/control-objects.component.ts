import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { objects } from '../../../../data/objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { animations } from '../../../../interface/animation';
import * as ServerConfig from 'src/app/config/path-config';
import { LyDialog } from '@alyle/ui/dialog';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { StatusMessageService } from 'src/app/services/status-message.service';
interface ObjectInfo {
  name: string | undefined;
  about: string | undefined;
  number: number | undefined;
  condition: string | undefined;
  photo: File | undefined;
}
@Component({
  selector: 'app-control-objects',
  templateUrl: './control-objects.component.html',
  styleUrls: ['./../objects.component.scss'],
  animations: [
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class ControlObjectsComponent implements OnInit, OnDestroy {

  acces_filling: number = 1;
  houseData: any;

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  infoObjects: any;

  objectInfo: ObjectInfo = {
    name: '',
    about: '',
    number: 1,
    condition: '',
    photo: undefined,
  };

  selectCondition: { [key: number]: string } = {
    0: 'Новий',
    1: 'Задовільний',
    2: 'Пошкоджений',
    3: 'Несправний',
  }

  objects = objects;
  flat_objects!: any;
  selectedFlatId!: string | null;
  selectedCard: boolean = false;
  defaultIcon = '../../../assets/icon-objects/add_circle.png';
  about: boolean = false;
  selectedSortOption: any;

  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private location: Location,
    private sharedService: SharedService,
    private statusMessageService: StatusMessageService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.getSelectedFlatId();
    this.checkUserAuthorization();
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
      this.getHouseAcces();
    } else {
      this.sharedService.logoutHouse();
    }
  }

  // перевірка на доступи
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_filling = this.houseData.acces.acces_filling;
      if (this.acces_filling === 1) {
        this.getInfo();
      } else {
        this.statusMessageService.setStatusMessage('У вас немає доступу');
        setTimeout(() => {
          this.router.navigate(['/house/objects/about']);
          this.statusMessageService.setStatusMessage('');
        }, 1500);
      }
    } else {
      this.getInfo();
    }
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (this.selectedFlatId && userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/get/filling', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response) {
          this.flat_objects = response.status;
          localStorage.setItem('flat_objects', JSON.stringify(this.flat_objects));
        } else {
          localStorage.removeItem('flat_objects');
        }
      } catch (error) {
        console.log(error)
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return this.serverPath + '/img/filling/' + flat.img;
    } else {
      return 'assets/icon-objects/default.filling.png';
    }
  }

  selectCard(flat: any): void {
    if (this.selectedCard === flat.filling_id) {
      this.selectedCard = false;
    } else {
      this.selectedCard = flat.filling_id;
    }
  }

  getIconUrl(type: string, name: string): string {
    const selectedTypeObj = this.objects.find(obj => obj.type === type);
    if (selectedTypeObj) {
      const selectedObj = selectedTypeObj.object.find(obj => obj.name === name);
      return selectedObj ? selectedObj.iconUrl : this.defaultIcon;
    } else {
      return this.defaultIcon;
    }
  }

  async deleteObject(flat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const selectedFlat = this.selectedFlatId;
    if (userJson && flat && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        filling_id: flat.filling_id
      };
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/deletefilling', data).toPromise();
        if (response.status === 'Видалення було успішне') {
          this.flat_objects = this.flat_objects.filter((item: { filling_id: any; }) => item.filling_id !== flat.filling_id);
          this.statusMessageService.setStatusMessage('Видалено');
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('');
          }, 1500);
        } else {
          this.statusMessageService.setStatusMessage('Помилка видалення');
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('');
          }, 1500);
        }
      } catch (error) {
        console.log(error)
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  }

  // сортування за типом
  sortData() {
    const infoObjects = localStorage.getItem('flat_objects');
    if (infoObjects) {
      this.infoObjects = JSON.parse(infoObjects);
      if (this.selectedSortOption !== '') {
        const filteredData = this.infoObjects.filter((item: any) => item.type_filling === this.selectedSortOption);
        this.flat_objects = filteredData;
      } else {
        this.flat_objects = this.infoObjects;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
