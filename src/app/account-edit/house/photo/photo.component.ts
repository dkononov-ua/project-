import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HostComponent } from '../host/host.component';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})

export class PhotoComponent implements OnInit {

  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  public selectedFlatId: any;
  filename: string | undefined;

  selectedFile: any;
  addressHouse: any;
  flatImg: any = [{ img: "housing_default.svg" }];
  images: string[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private dataService: DataService, private hostComponent: HostComponent) {
    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId: any) => {
      this.selectedFlatId = selectedFlatId;
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            if (response !== null) {
              this.addressHouse = this.fb.group({
                flat_id: [response.flat.flat_id, []],
              });
              if (response.imgs === 'Картинок нема') {
              } else {
                this.flatImg = response.imgs;
                for (const img of this.flatImg) {
                  this.images.push('http://localhost:3000/img/flat/' + img.img);
                }
              }

            }
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('user not found');
      }
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    this.loading = true;

    const userJson = localStorage.getItem('user');
    const formData: FormData = new FormData();

    console.log(this.selectedFile)

    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
    formData.append('flat_id', this.selectedFlatId);

    const headers = { 'Accept': 'application/json' };
    this.http.post('http://localhost:3000/img/uploadflat', formData, { headers }).subscribe(
      (data: any) => {
        console.log(data);
        this.images.push('http://localhost:3000/img/flat/' + data.filename);
      },
      (error: any) => {
        console.log(error);
      }
    );
    setTimeout(() => {
      location.reload();
    }, 1000); // Затримка в 1 секунду
  }
}
