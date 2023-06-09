import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss']
})
export class AccountSelectionComponent implements OnInit {

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
    this.loadImages();
    this.loadHouses();
    this.loadUserImage();
  }

  loadImages(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null && houseJson !== null) {
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
            this.images = ['http://localhost:3000/housing_default.svg'];
          }
        } else {
          console.error('houseData field is missing from server response');
        }

        if (this.images.length > 0) {
          const selectedFlatId = JSON.parse(houseJson).flat_id;
          this.selectHouse.setValue({ house: selectedFlatId });
          this.selectedFlatId = selectedFlatId;
          this.selectedFlatService.setSelectedFlatId(selectedFlatId);
        }
      });
    }
  }

  loadHouses(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');

    if (userJson !== null) {
      this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            this.houses = response.ids.map((item: { flat_id: any; }, index: number) => ({
              id: index + 1,
              name: item.flat_id,
            }));

            if (houseJson) {
              const selectedFlatId = JSON.parse(houseJson).flat_id;
              const selectedHouseExists = this.houses.some((house: { name: any; }) => house.name === selectedFlatId);

              if (selectedHouseExists) {
                this.selectHouse.setValue({ house: selectedFlatId });
              } else {
                console.log('Selected house does not exist in the list of houses');
              }
            } else if (this.houses.length > 0) {
              const firstHouse = this.houses[0].name;
              this.selectHouse.setValue({ house: firstHouse });
              localStorage.setItem('house', JSON.stringify({ flat_id: firstHouse }));
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user not found');
    }
  }

  setupSelectHouseListener(): void {
    const userJson = localStorage.getItem('user');

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
        this.selectedFlatService.setSelectedFlatId(selectedFlatId);
      } else {
        console.log('Нічого не вибрано');
      }
    });
  }

  loadUserImage(): void {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }
        });
    }
  }

}
