import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

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
  filename: string | undefined;
  selectedFile: any;
  flatImg: any = [{ img: "housing_default.svg" }];
  selectedFlatId: any;
  images: string[] = [];

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) {  }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      console.log(this.selectedFlatId);
      if (this.selectedFlatId !== null) {
        this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          this.flatImg = response.imgs;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  };

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    const formData: FormData = new FormData();
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
    }, 1000);
  }
}
