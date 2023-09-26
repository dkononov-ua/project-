import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath } from 'src/app/shared/server-config';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class PhotoComponent implements OnInit {
  loading = false;
  filename: string | undefined;
  selectedFile: any;
  flatImg: any = [{ img: "housing_default.svg" }];
  selectedFlatId: any;
  images: string[] = [];
  currentPhotoIndex: number = 0;


  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.getSelectedFlat();
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    setTimeout(() => {
      this.onUpload();
      this.reloadPageWithLoader();
    },);
  }

  onUpload(): void {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
    formData.append('flat_id', this.selectedFlatId);

    const headers = { 'Accept': 'application/json' };
    this.http.post(serverPath + '/img/uploadflat', formData, { headers }).subscribe(
      (data: any) => {
        this.images.push(serverPath + '/img/flat/' + data.filename);
      },
      (error: any) => {
        console.log(error);
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
    const selectedFlat = this.selectedFlatId;
    console.log(selectImg)

    if (userJson && selectImg && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        img: selectImg,
      };

      this.http.post(serverPath + '/flatinfo/deleteFlatImg', data)
        .subscribe(
          (response: any) => {
            this.flatImg = this.flatImg.filter((item: { img: any; }) => item.img !== selectImg.img);
            this.reloadPageWithLoader();
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
