import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { objects } from '../objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

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
  styleUrls: ['./add-objects.component.scss']
})
export class AddObjectsComponent implements OnInit {

  objectInfo: ObjectInfo = {
    name: '',
    about: '',
    number: 1,
    condition: '',
    photo: undefined,
  };

  selectCondition = {
    0: 'Новий',
    1: 'Задовільний',
    2: 'Пошкоджений',
    3: 'Несправний',
  };

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;
  objects = objects;
  filteredObjects: any[] = [];
  selectedType!: string;
  selectedObject: any;
  selectedFlatId!: string | null;
  selectedFile: any;
  userImg: any;
  fillingImg: any;
  option: number = 2;

  minValue: number = 0;
  maxValue: number = 99;

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.loadObjects();
        // this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedFlatId && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/img/object', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
      }).toPromise() as any;

      if (response) {
      }
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
    setTimeout(() => {
      this.saveObject();
    },);
  }

  // saveObject(): void {
  //   const userJson = localStorage.getItem('user');

  //   const data = {
  //     type_filling: this.selectedType,
  //     name_filling: this.selectedObject,
  //     number_filling: this.objectInfo.number,
  //     condition_filling: this.objectInfo.condition,
  //     about_filling: this.objectInfo.description,
  //   };

  //   if (!this.selectedFile) {
  //     console.log('Файл не обраний. Завантаження не відбудеться.');
  //     return;
  //   }

  //   const formData: FormData = new FormData();
  //   formData.append('file', this.selectedFile, this.selectedFile.name);
  //   formData.append('obj', data);
  //   formData.append('auth', JSON.stringify(JSON.parse(userJson!)));

  //   const headers = { 'Accept': 'application/json' };
  //   this.http.post('http://localhost:3000/img/uploaduser', formData, { headers }).subscribe(
  //     (data: any) => {
  //       setTimeout(() => {
  //         this.reloadPageWithLoader();
  //       },);
  //     },
  //     error => console.log(error)
  //   );
  // }

  // saveObject(): void {
  //   const userJson = localStorage.getItem('user');

  //   if (
  //     this.selectedType === undefined ||
  //     this.selectedObject === undefined ||
  //     this.objectInfo.number === undefined ||
  //     this.objectInfo.condition === undefined ||
  //     this.objectInfo.description === undefined ||
  //     this.selectedFile === undefined
  //   ) {
  //     console.log('Поля не можуть бути undefined.');
  //     return;
  //   }

  //   const formData: FormData = new FormData();
  //   formData.append('file', this.selectedFile, this.selectedFile.name);
  //   formData.append('type_filling', this.selectedType);
  //   formData.append('name_filling', this.selectedObject);
  //   formData.append('number_filling', this.objectInfo.number.toString());
  //   formData.append('condition_filling', this.objectInfo.condition);
  //   formData.append('about_filling', this.objectInfo.description);
  //   formData.append('auth', JSON.stringify(JSON.parse(userJson!)));

  //   const headers = { 'Accept': 'application/json' };
  //   this.http.post('http://localhost:3000/img/uploaduser', formData, { headers }).subscribe(
  //     (data: any) => {
  //       setTimeout(() => {
  //         this.reloadPageWithLoader();
  //       });
  //     },
  //     error => console.log(error)
  //   );
  // }


  saveObject(): void {
    const userJson = localStorage.getItem('user');

    const data = {
      type_filling: this.selectedType,
      name_filling: this.selectedObject,
      number_filling: this.objectInfo.number,
      condition_filling: this.objectInfo.condition,
      about_filling: this.objectInfo.about,
    };

    if (!this.selectedFile) {
      console.log('Файл не обраний. Завантаження не відбудеться.');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));

    const headers = { 'Accept': 'application/json' };
    this.http.post('http://localhost:3000/img/object', formData, { headers }).subscribe(
      (uploadResponse: any) => {
        console.log(data)
        this.http.post('http://localhost:3000/flatinfo/add/object', data).subscribe(
          (addObjectResponse: any) => {
            setTimeout(() => {
              // this.reloadPageWithLoader();
              this.option = 1;
            });
          },
          (addError: any) => {
            console.log(addError);
          }
        );
      },
      (uploadError: any) => {
        console.log(uploadError);
      }
    );
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

}
