import { animations } from '../../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';

import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { SharedService } from 'src/app/services/shared.service';
import { DataService } from 'src/app/services/data.service';
import { MissingParamsService } from '../missing-params.service';
import { MenuService } from 'src/app/services/menu.service';
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.appearance,

  ],
})

export class PhotoComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  isLoadingImg: boolean = false;

  loading = true;
  filename: string | undefined;
  selectedFile: any;
  flatImg: any = [{ img: "housing_default.svg" }];
  selectedFlatId: any;
  images: string[] = [];
  currentPhotoIndex: number = 0;
  statusMessage: string | undefined;
  selectedPhoto: boolean = false;
  reloadImg: boolean = false;
  downloadedPhoto: any;
  totalPhoto: number = 0;

  selectPhoto(photo: any): void {
    if (this.selectedPhoto === photo) {
      this.selectedPhoto = false;
    } else {
      this.selectedPhoto = photo;
      this.scrollToSelectedPhoto(photo);
    }
  }

  async setToogleMenu() {
    this.menuService.toogleMenuEditHouse(false)
  }

  scrollToSelectedPhoto(selectedPhoto: any) {
    const selectedPhotoElement = this.elementRef.nativeElement.querySelector(`[data-img="${selectedPhoto}"]`);
    if (selectedPhotoElement) {
      selectedPhotoElement.scrollIntoView({ behavior: 'smooth' });
    }
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
    private _dialog: LyDialog,
    private elementRef: ElementRef,
    private dataService: DataService,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
    private menuService: MenuService,
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

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== null) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId }).toPromise();
        if (Array.isArray(response.imgs) && response.imgs.length > 0) {
          this.flatImg = response.imgs;
          this.flatImg.reverse();
          if (this.reloadImg) {
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              this.reloadImg = false;
            }, 1500);
          }
          this.countFilterPhoto();
        } else {
          this.flatImg = [{ img: "housing_default.svg" }];
        }
      } catch (error) {
        // this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        // setTimeout(() => {
        //   this.sharedService.setStatusMessage('');
        //   location.reload();
        // }, 1500);
      }
    } else {
      console.log('user not found');
    }
  };

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterPhoto(): number {
    const totalFields = 20;
    if (this.flatImg) {
      this.downloadedPhoto = this.flatImg.length;
      this.totalPhoto = parseFloat(((this.downloadedPhoto / totalFields) * 100).toFixed(2));
    }
    return this.downloadedPhoto || 0;
  }

  openCropperDialog(event: Event) {
    this._dialog.open<CropImgComponent, Event>(CropImgComponent, {
      data: event,
      width: 400,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        const blob = this.dataURItoBlob(result.dataURL!);
        const formData = new FormData();
        formData.append('file', blob, result.name!);
        this.onUpload(formData);
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

  async onUpload(formData: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && formData) {
      formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
      formData.append('flat_id', this.selectedFlatId);
      const headers = { 'Accept': 'application/json' };
      try {
        const response: any = await this.http.post(this.serverPath + '/img/uploadflat', formData, { headers }).toPromise();
        if (response.status === 'Збережено') {
          this.reloadImg = true;
          this.sharedService.setStatusMessage('Фото додано');
          this.updateFlatInfo();
        } else {
          this.sharedService.setStatusMessage('Помилка завантаження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            location.reload();
          }, 1500);
        }
      } catch (error) {
        this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
          location.reload();
        }, 1500);
      }
    }
  }

  prevPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    if (this.currentPhotoIndex < this.flatImg.length - 1) {
      this.currentPhotoIndex++;
    }
  }

  async deleteObject(selectImg: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && selectImg && selectImg !== "housing_default.svg" && this.selectedFlatId) {

      const data = {
        auth: JSON.parse(userJson),
        flat_id: Number(this.selectedFlatId),
        img: selectImg,
      };

      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/deleteFlatImg', data).toPromise();
        // console.log(response)
        if (response.status === 'Видалення було успішне' || response.status === 'Параметри успішно додані') {
          this.sharedService.setStatusMessage('Видалено');
          this.updateFlatInfo();
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка видалення');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              location.reload();
            }, 1500);
          }, 500);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка на сервері, повторіть спробу');
        setTimeout(() => { location.reload }, 2000);
      }
    }
  }

  async saveInfo(): Promise<void> {
    this.missingParamsService.checkResponse(true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}





