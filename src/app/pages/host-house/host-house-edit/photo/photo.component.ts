import { animations } from '../../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';

import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { SharedService } from 'src/app/services/shared.service';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
  ],
})

export class PhotoComponent implements OnInit {

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

  selectPhoto(photo: any): void {
    if (this.selectedPhoto === photo) {
      this.selectedPhoto = false;
    } else {
      this.selectedPhoto = photo;
      this.scrollToSelectedPhoto(photo);
    }
  }

  scrollToSelectedPhoto(selectedPhoto: any) {
    const selectedPhotoElement = this.elementRef.nativeElement.querySelector(`[data-img="${selectedPhoto}"]`);
    if (selectedPhotoElement) {
      selectedPhotoElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private _dialog: LyDialog,
    private elementRef: ElementRef,
    private dataService: DataService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectedFlat();
    this.loading = false;
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('houseData', JSON.stringify(response));
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  getSelectedFlat() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== null) {
      this.http.post(this.serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe(
          (response: any) => {
            if (Array.isArray(response.imgs) && response.imgs.length > 0) {
              this.flatImg = response.imgs;
              this.flatImg.reverse();
              if (this.reloadImg) {
                setTimeout(() => {
                  this.sharedService.setStatusMessage('');
                  this.reloadImg = false;
                }, 1500);
              }
            } else {
              this.flatImg = [{ img: "housing_default.svg" }];
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user not found');
    }
  };

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

  onUpload(formData: any): void {
    const userJson = localStorage.getItem('user');
    if (!formData) {
      console.log('Файл не обраний. Завантаження не відбудеться.');
      return;
    }
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
    formData.append('flat_id', this.selectedFlatId);
    const headers = { 'Accept': 'application/json' };
    this.http.post(this.serverPath + '/img/uploadflat', formData, { headers }).subscribe(
      async (data: any) => {
        this.images.push(this.serverPath + '/img/flat/' + data.filename);
        this.loading = false;
        if (data.status === 'Збережено') {
          this.reloadImg = true;
          this.flatImg = [];
          this.sharedService.setStatusMessage('Фото додано');
          await this.getInfo();
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка завантаження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 1500);
          }, 500);
        }
      },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
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

  deleteObject(selectImg: any): void {
    const userJson = localStorage.getItem('user');
    if (userJson && selectImg && selectImg !== "housing_default.svg" && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        img: selectImg,
      };

      this.http.post(this.serverPath + '/flatinfo/deleteFlatImg', data)
        .subscribe(
          (response: any) => {
            if (response.status == 'Видалення було успішне') {
              this.sharedService.setStatusMessage('Видалено');
              setTimeout(() => {
                const deletedIndex = this.flatImg.findIndex((item: { img: any; }) => item.img === selectImg);
                this.flatImg = this.flatImg.filter((item: { img: any; }) => item.img !== selectImg);
                if (this.currentPhotoIndex > deletedIndex) {
                  this.currentPhotoIndex--;
                }
                this.getInfo();
                setTimeout(() => {
                  this.sharedService.setStatusMessage('');
                }, 1500);
              }, 1500);
            } else {
              setTimeout(() => {
                this.sharedService.setStatusMessage('Помилка видалення');
                setTimeout(() => {
                  this.sharedService.setStatusMessage('');
                }, 1500);
              }, 500);
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user or subscriber not found');
    }
  }




}





