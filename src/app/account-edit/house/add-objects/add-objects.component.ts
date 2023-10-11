import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { objects } from '../../../shared/objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/shared/server-config';

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

  helpInfo: boolean = false;
  openHelp() {
    this.helpInfo = !this.helpInfo;
  }

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) { }

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
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveObject(): void {
    const userJson = localStorage.getItem('user');
    const data = {
      type_filling: this.selectedType,
      name_filling: this.selectedObject,
      number_filling: this.objectInfo.number,
      condition_filling: this.objectInfo.condition,
      about_filling: this.objectInfo.about,
      flat_id: this.selectedFlatId,
    };
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

        console.log(2222)
        console.log(uploadResponse)
        if (uploadResponse.status === 'Збережено') {
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
