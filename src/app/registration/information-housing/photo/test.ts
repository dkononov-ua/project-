import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { log } from 'console';
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
  ],
  template: '{{ selectedFlatId }}'
})

export class PhotoComponent implements OnInit {
  public selectedFlatId: any | null;

  isDisabled?: boolean;
  addressHouse: any;
  selectedFiles: any[] = [];
  userForm: any;
  public flatId: string | undefined;
  public imageUrl: string | undefined;
  flatImg: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private dataService: DataService, private hostComponent: HostComponent) {
    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId: any) => {
      this.selectedFlatId = selectedFlatId;
      console.log(222)
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            if (response !== null) {

              this.addressHouse = this.fb.group({
                flat_id: [response.flat.flat_id, []],
              });
              this.flatImg = response.imgs[24].img;
            }
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('user not found');
      }
      this.initializeForm();

    });
  }

  ngOnInit(): void {
  }

  private initializeForm(): void {
    this.addressHouse = this.fb.group({});
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  onUpload(): void {
    const userJson = localStorage.getItem('user');
    const formData: FormData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file', this.selectedFiles[i], this.selectedFiles[i].name);
    }
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
    formData.append('flat_id', this.selectedFlatId);
    console.log(this.selectedFlatId)

    const headers = { 'Accept': 'application/json' };
    this.http.post('http://localhost:3000/img/uploadflat', formData, { headers }).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }
}
