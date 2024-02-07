import { animations } from '../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';

import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  animations: [animations.left, animations.left1, animations.left2,],

})

export class PhotoComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  loading = true;
  filename: string | undefined;
  selectedFile: any;
  flatImg: any = [{ img: "housing_default.svg" }];
  selectedFlatId: any;
  images: string[] = [];
  currentPhotoIndex: number = 0;
  statusMessage: string | undefined;
  selectedPhoto: boolean = false;

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
  ) { }

  ngOnInit(): void {
    this.getSelectedFlat();
    this.loading = false;
  }

  updateFlatInfo () {
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
      this.http.post(serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe(
          (response: any) => {
            if (Array.isArray(response.imgs) && response.imgs.length > 0) {
              this.flatImg = response.imgs;
              this.flatImg.reverse();
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
    console.log(formData)
    this.http.post(serverPath + '/img/uploadflat', formData, { headers }).subscribe(
      (data: any) => {
        this.images.push(serverPath + '/img/flat/' + data.filename);
        this.loading = false;
        if (data.status === 'Збережено') {
          // this.statusMessage = 'Фото додано';
          // setTimeout(() => {
            this.statusMessage = 'Фото додано';
            setTimeout(() => {
              this.statusMessage = '';
              this.updateFlatInfo();
              this.reloadPageWithLoader();
              // this.router.navigate(['/housing-parameters/host/address']);
            }, 1500);
          // }, 1000);
        } else {
          setTimeout(() => {
            this.statusMessage = 'Помилка завантаження';
            setTimeout(() => {
              this.statusMessage = '';
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

      this.http.post(serverPath + '/flatinfo/deleteFlatImg', data)
        .subscribe(
          (response: any) => {
            if (response.status == 'Видалення було успішне') {
              setTimeout(() => {
                this.statusMessage = 'Видалено';
                const deletedIndex = this.flatImg.findIndex((item: { img: any; }) => item.img === selectImg);
                this.flatImg = this.flatImg.filter((item: { img: any; }) => item.img !== selectImg);
                if (this.currentPhotoIndex > deletedIndex) {
                  this.currentPhotoIndex--;
                }
                this.getInfo();
                setTimeout(() => {
                  this.statusMessage = '';
                }, 1500);
              }, 500);
            } else {
              setTimeout(() => {
                this.statusMessage = 'Помилка видалення';
                setTimeout(() => {
                  this.statusMessage = '';
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





