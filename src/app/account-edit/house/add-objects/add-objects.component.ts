import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { objects } from '../../../shared/objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/shared/server-config';

import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';

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
  styleUrls: ['./add-objects.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class AddObjectsComponent implements OnInit {
  path_logo = path_logo;
  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
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
  customObject: any;
  selectedFlatId!: string | null;
  selectedFile: any;
  userImg: any;
  fillingImg: any;
  selectedIconUrl: string = '';
  selectedCard: boolean = false;
  indexPage: number = 0;

  minValue: number = 0;
  maxValue: number = 99;
  defaultIcon = '../../../assets/icon-objects/add_circle.png';
  statusMessage: string | undefined;

  helpInfo: boolean = false;
  photoData: any;
  cropped?: string;
  about: boolean = false;
  addAbout () {
    this.about = !this.about;
  }
  openHelp() {
    this.helpInfo = !this.helpInfo;
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.loadObjects();
        this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedFlatId && userJson) {
      const response = await this.http.post(serverPath + '/flatinfo/get/filling', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
      }).toPromise() as any;
      if (response) {
        this.flat_objects = response.status;
      }
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return serverPath + '/img/filling/' + flat.img;
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

  saveObject(): void {
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

    if (photoData && userJson && data && this.selectedType && this.selectedObject || this.customObject) {
      photoData.append("inf", JSON.stringify(data));
      photoData.append('auth', userJson!);

      const headers = { 'Accept': 'application/json' };
      this.http.post(serverPath + '/img/uploadFilling', photoData, { headers }).subscribe(
        (uploadResponse: any) => {
          if (uploadResponse.status === 'Збережено') {
            this.selectedObject = '';
            this.objectInfo.number = 1;
            this.customObject = '';
            this.objectInfo.about = '';
            setTimeout(() => {
              this.statusMessage = "Об'єкт додано до списку";
              setTimeout(() => {
                this.statusMessage = '';
                this.selectedObject = '';
                this.objectInfo.number = 1;
                this.customObject = '';
                this.objectInfo.about = '';
                this.getInfo()
              }, 1500);
            }, 1000);
          } else {
            setTimeout(() => {
              this.statusMessage = 'Дані не збережено';
              this.reloadPageWithLoader()
            }, 2000);
          }
        },
        (uploadError: any) => {
          console.log(uploadError);
        }
      );
    } else if (!photoData && userJson && data && this.selectedType && this.selectedObject || this.customObject) {
      const formData: FormData = new FormData();
      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      } else {
        formData.append('file', 'no_photo');
      }
      formData.append("inf", JSON.stringify(data));
      formData.append('auth', userJson!);

      const headers = { 'Accept': 'application/json' };
      this.http.post(serverPath + '/img/uploadFilling', formData, { headers }).subscribe(
        (uploadResponse: any) => {
          if (uploadResponse.status === 'Збережено') {
            this.customObject = '';
            setTimeout(() => {
              this.statusMessage = "Об'єкт додано до списку";
              setTimeout(() => {
                this.statusMessage = '';
                this.getInfo()
              }, 1500);
            }, 1000);
          } else {
            setTimeout(() => {
              this.statusMessage = 'Дані не збережено';
              this.reloadPageWithLoader()
            }, 2000);
          }
        },
        (uploadError: any) => {
          console.log(uploadError);
        }
      );

    } else {
      console.log('Внесіть данні')
    }

  }

  deleteObject(flat: any): void {
    const userJson = localStorage.getItem('user');
    const selectedFlat = this.selectedFlatId;

    if (userJson && flat && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        filling_id: flat.filling_id
      };

      this.http.post(serverPath + '/flatinfo/deletefilling', data)
        .subscribe(
          (response: any) => {
            this.flat_objects = this.flat_objects.filter((item: { filling_id: any; }) => item.filling_id !== flat.filling_id);
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
