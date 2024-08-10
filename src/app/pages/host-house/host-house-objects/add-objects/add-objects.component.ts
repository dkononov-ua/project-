import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { objects } from '../../../../data/objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { animations } from '../../../../interface/animation';
import * as ServerConfig from 'src/app/config/path-config';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
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
  selector: 'app-add-objects',
  templateUrl: './add-objects.component.html',
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

export class AddObjectsComponent implements OnInit {

  acces_filling: number = 1;
  houseData: any;

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  checkObj: any;
  infoObjects: any;

  reloadPageWithLoader() {
    location.reload();
  }

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

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  objects = objects;
  flat_objects!: any;
  filteredObjects: any[] = [];
  selectedType!: string;
  selectedObject: any;
  customObject: string = '';
  selectedFlatId!: string | null;
  selectedFile: any;
  userImg: any;
  fillingImg: any;
  selectedIconUrl: string = '';
  selectedCard: boolean = false;
  minValue: number = 0;
  maxValue: number = 99;
  defaultIcon = '../../../assets/icon-objects/add_circle.png';
  statusMessage: string | undefined;
  photoData: any;
  cropped?: string;
  about: boolean = false;
  selectedSortOption: any;

  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
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
        this.loadObjects();
      } else {
        this.statusMessageService.setStatusMessage('У вас немає доступу');
        setTimeout(() => {
          this.router.navigate(['/house/objects/about']);
          this.statusMessageService.setStatusMessage('');
        }, 1500);
      }
    } else {
      this.loadObjects();
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return this.serverPath + '/img/filling/' + flat.img;
    } else {
      return 'assets/icon-objects/default.filling.png';
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

  loadObjects() {
    if (this.selectedType) {
      const selectedTypeObj = this.objects.find(obj => obj.type === this.selectedType);
      this.filteredObjects = selectedTypeObj ? selectedTypeObj.object : [];
      this.selectedObject = null;
    } else {
      this.filteredObjects = [];
      this.selectedObject = null;
    }
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = '100px';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  openCropperDialog(event: Event) {
    this._dialog.open<CropImgComponent, Event>(CropImgComponent, {
      data: event,
      width: 400,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        this.cropped = result.dataURL;
        this._cd.markForCheck();
        const blob = this.dataURItoBlob(result.dataURL!);
        const photoData = new FormData();
        photoData.append('file', blob, result.name!);
        this.photoData = photoData;
      }
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  checkObject() {
    if (this.selectedType && this.selectedObject) {
      this.checkObj = true;
    } else if (this.selectedType && this.customObject && this.customObject.length >= 3) {
      this.checkObj = true;
    } else {
      this.checkObj = false;
    }
  }


  async saveObject(): Promise<void> {
    const photoData = this.photoData;
    const userJson = localStorage.getItem('user');
    const data = {
      type_filling: this.selectedType,
      name_filling: this.selectedObject === 0 ? this.customObject : this.selectedObject,
      number_filling: this.objectInfo.number,
      condition_filling: this.objectInfo.condition,
      about_filling: this.objectInfo.about,
      flat_id: this.selectedFlatId,
    };
    if (photoData && userJson && data && this.selectedType && this.checkObj) {
      photoData.append("inf", JSON.stringify(data));
      photoData.append('auth', userJson!);
      const headers = { 'Accept': 'application/json' };
      try {
        const response: any = await this.http.post(this.serverPath + '/img/uploadFilling', photoData, { headers }).toPromise();
        if (response.status === 'Збережено') {
          this.statusMessageService.setStatusMessage("Об'єкт додано до списку");
          this.selectedObject = '';
          this.objectInfo.number = 1;
          this.customObject = '';
          this.objectInfo.about = '';
          this.cropped = '';
          this.selectedFile = null;
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('');
          }, 1500);
        } else {
          this.statusMessageService.setStatusMessage('Дані не збережено');
          setTimeout(() => { this.reloadPageWithLoader() }, 1500);
        }
      } catch (error) { console.error(error); }
    } else if (userJson && data && this.selectedType && this.checkObj) {
      const formData: FormData = new FormData();
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      } else { formData.append('file', 'no_photo'); }
      formData.append("inf", JSON.stringify(data));
      formData.append('auth', userJson!);
      const headers = { 'Accept': 'application/json' };
      try {
        const response: any = await this.http.post(this.serverPath + '/img/uploadFilling', formData, { headers }).toPromise();
        if (response.status === 'Збережено') {
          this.customObject = '';
          this.selectedObject = '';
          this.objectInfo.number = 1;
          this.objectInfo.about = '';
          this.statusMessageService.setStatusMessage("Об'єкт додано до списку");
          setTimeout(() => {
            this.statusMessageService.setStatusMessage('');
          }, 1500);
        } else { setTimeout(() => { this.statusMessageService.setStatusMessage('Дані не збережено'); this.reloadPageWithLoader() }, 2000); }
      } catch (error) { console.error(error); }
    } else { console.log('Внесіть данні') }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
