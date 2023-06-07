import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-account-nav',
  templateUrl: './account-nav.component.html',
  styleUrls: ['./account-nav.component.scss']
})
export class AccountNavComponent implements OnInit {
  loading = false;

  formErrors: any = {
    house: '',
  };

  public selectedFlatId: any | null;
  houses: { id: number, name: string }[] = [];
  addressHouse: FormGroup | undefined;
  flatImg: any = [{ img: "housing_default.svg" }];
  userImg: any;

  selectHouse = new FormGroup({
    house: new FormControl('виберіть оселю')
  });
  images: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            if (response.houseData.imgs !== 'Картинок нема') {
              this.flatImg = response.houseData.imgs;
            }

            if (this.flatImg !== undefined && Array.isArray(this.flatImg) && this.flatImg.length > 0 && response.houseData.imgs !== 'Картинок нема') {
              this.images = [];
              for (const img of this.flatImg) {
                this.images.push('http://localhost:3000/img/flat/' + img.img);
              }
            } else {
              this.images = ['http://localhost:3000/housing_default.svg']; // Ініціалізація масиву зі значенням за замовчуванням
            }

          } else {
            console.error('houseData field is missing from server response');
          }
        });
      }
    }

    if (houseJson) {
      this.selectHouse.setValue({ house: JSON.parse(houseJson).flat_id });
    }

    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            this.houses = response.ids.map((item: { flat_id: any; }, index: number) => ({
              id: index + 1,
              name: item.flat_id,
            }));
            const houseJson = localStorage.getItem('house');
            if (houseJson) {
              this.selectHouse.setValue({ house: JSON.parse(houseJson).flat_id });
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user not found');
    }

    this.selectHouse.get('house')?.valueChanges.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        localStorage.removeItem('house');
        localStorage.setItem('house', JSON.stringify({ flat_id: selectedFlatId }));
        console.log(selectedFlatId);

        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson!), flat_id: selectedFlatId })
          .subscribe(
            (response: any) => {
              if (response !== null) {
                this.addressHouse = this.fb.group({
                  flat_id: [response.flat.flat_id],
                });
              }
            },
            (error: any) => {
              console.error(error);
            }
          );
        this.selectedFlatId = selectedFlatId;
        this.selectedFlatService.setSelectedFlatId(selectedFlatId); // Додано
      } else {
        console.log('Нічого не вибрано');
      }
    });

    // Отримати фото користувача
    if (userJson) {
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }
        });
    }
  }

  onSelectionChange() {
    this.loading = true;

    if (this.selectedFlatId) {
      console.log('Ви вибрали оселю з ID:', this.selectedFlatId);
      localStorage.setItem('house', JSON.stringify({ flat_id: this.selectedFlatId }));

      this.selectedFlatId = this.selectedFlatId;
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe(
            (response: any) => {
              if (response !== null) {
                this.addressHouse = this.fb.group({
                  flat_id: [response.flat.flat_id],
                });
              }
            },
            (error: any) => {
              console.error(error);
            }
          );
      } else {
        console.log('user not found');
      }

      this.selectedFlatService.setSelectedFlatId(this.selectedFlatId); // Додано

    } else {
      console.log('Нічого не вибрано');
    }

    location.reload();
  }
}
