import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { SharedService } from 'src/app/services/shared.service';
import { MissingParamsService } from '../missing-params.service';
import { DataService } from 'src/app/services/data.service';

interface FlatInfo {
  students: boolean;
  woman: boolean;
  man: boolean;
  family: boolean;
  bunker: string | undefined;
  animals: string | undefined;
  option_pay: number;
  price_d: number;
  price_m: number;
  about: string | undefined;
  private: boolean;
  rent: number;
  room: number;
  price_f: number;
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [animations.left, animations.left1, animations.left2,],
})

export class AboutComponent implements OnInit {
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
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

  flatInfo: FlatInfo = {
    students: false,
    woman: false,
    man: false,
    family: false,
    bunker: undefined,
    animals: 'Неважливо',
    option_pay: 1,
    price_d: 0,
    price_m: 0,
    price_f: 0.1,
    about: undefined,
    private: false,
    rent: 0,
    room: 0,
  };

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

  openHelpPhoto() {
    this.helpPhoto = !this.helpPhoto;
  }

  isLoadingImg: boolean = false;

  filename: string | undefined;
  selectedFile: any;
  flatImg: any = [{ img: "housing_default.svg" }];
  images: string[] = [];
  currentPhotoIndex: number = 0;
  selectedPhoto: boolean = false;
  reloadImg: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private _dialog: LyDialog,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        this.getSelectParam();
      }
    })
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      if (this.selectedFlatId) {
        this.getInfo();
      }
    });
  }

  async saveInfo(rent: any): Promise<void> {
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
        about: this.flatInfo.about || undefined,
        private: this.flatInfo.private || false,
        rent: rent,
        room: this.flatInfo.room || 0,
      }
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 1) {
          this.updateFlatInfo();
          this.missingParamsService.checkResponse(response);
          // якщо ми хочемо активувати але в нас не заповненні обов'язкові параметри
          if (response && response.rent) {
            this.flatInfo.rent = 0;
          } else {
            // якщо ми хочемо активувати і є всі параметри
            this.sharedService.setStatusMessage('Оголошення розміщено');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оновлюємо інформацію');
              setTimeout(() => {
                this.router.navigate(['/house']);
                this.sharedService.setStatusMessage('');
              }, 1000);
            }, 1500);
          }
        } else if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 0) {
          this.updateFlatInfo();
          setTimeout(() => {
            this.sharedService.setStatusMessage('Параметри успішно збережені');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оновлюємо інформацію');
              setTimeout(() => {
                // this.router.navigate(['/house']);
                this.sharedService.setStatusMessage('');
                location.reload();
              }, 1000);
            }, 1500);
          }, 500);
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
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

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  ngAfterViewInit() {
    this.textArea.nativeElement.style.height = 'auto';
    this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  clearInfo(): void {
    this.flatInfo = {
      students: false,
      woman: false,
      man: false,
      family: false,
      bunker: '',
      animals: 'Неважливо',
      option_pay: 0,
      price_d: 0,
      price_m: 0,
      price_f: 0,
      about: '',
      private: false,
      rent: 0,
      room: 0,

    };
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
            this.flatInfo = response.about;
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
