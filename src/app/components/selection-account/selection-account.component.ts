import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { Location } from '@angular/common';
import { serverPath } from 'src/app/shared/server-config';

@Component({
  selector: 'app-selection-account',
  templateUrl: './selection-account.component.html',
  styleUrls: ['./selection-account.component.scss']
})
export class SelectionAccountComponent implements OnInit {
  loading = false;

  formErrors: any = {
    house: '',
  };

  public selectedFlatId: any | null;
  houses: { id: number, name: string }[] = [];
  rentedHouses: { id: number; name: string; }[] = [];
  addressHouse: FormGroup | undefined;
  flatImg: any = [{ img: "housing_default.svg" }];
  userImg: any;
  selectHouse = new FormGroup({ house: new FormControl('виберіть оселю') });
  images: any;
  selectedRentedFlatId: any;


  // user
  openUserMenu: boolean = false;
  hideUserMenu: boolean = true;

  openMenuUser(): void {
    if (!this.openUserMenu) {
      this.hideUserMenu = false;
      this.openFlatMenu = false;
      this.hideFlatMenu = true;
      this.openUserMenu = true;
    } else if (this.openUserMenu) {
      this.openUserMenu = false;
      this.hideUserMenu = true;
    }
  }

  closeMenuUser(): void {
    this.openUserMenu = false;
    this.hideUserMenu = true;
  }

  // flat
  openFlatMenu: boolean = false;
  hideFlatMenu: boolean = true;

  openMenuFlat(): void {
    if (!this.openFlatMenu) {
      this.hideFlatMenu = false;
      this.openUserMenu = false;
      this.hideUserMenu = true;
      this.openFlatMenu = true;
    } else if (this.openFlatMenu) {
      this.openFlatMenu = false;
      this.hideFlatMenu = true;
    }
  }

  closeMenuFlat(): void {
    this.openFlatMenu = false;
    this.hideFlatMenu = true;
  }

  isMenuOpen = false;

  goBack(): void {
    this.location.back();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeMenuUser();
      this.closeMenuFlat();
    }
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dataService: DataService,
    private selectedFlatService: SelectedFlatService,
    private el: ElementRef,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
    this.loadImages();
    this.loadHouses();
    this.loadUserImage();
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  loadImages(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getData().subscribe((response: any) => {
        if (response.houseData) {
          if (response.houseData.imgs !== 'Картинок нема') {
            this.flatImg = response.houseData.imgs;

            if (this.flatImg !== undefined && Array.isArray(this.flatImg) && this.flatImg.length > 0) {
              this.images = [];
              for (const img of this.flatImg) {
                this.images.push(serverPath + '/img/flat/' + img.img);
              }
            } else {
              this.images = [serverPath + '/housing_default.svg'];
            }
          } else {
            this.images = [serverPath + '/housing_default.svg'];
          }
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  loadUserImage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }
        });
    }
  }

  loadHouses(): void {
    this.loadOwnedHouses();
    this.loadRentedHouses();
  }

  loadOwnedHouses(): void {
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            this.houses = response.ids.map((item: { flat_id: any }, index: number) => ({
              id: index + 1,
              name: item.flat_id,
            }));

            this.houses.forEach((house: { id: any, name: any }) => {
            });

            if (this.selectedFlatId) {
              const selectedHouseExists = this.houses.some((house: { name: any }) => house.name === this.selectedFlatId);
              if (selectedHouseExists) {
                this.selectHouse.setValue({ house: this.selectedFlatId });
              } else {
                console.log('Немає оселей');
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
      console.log('User not found');
    }
  }

  loadRentedHouses(): void {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            this.rentedHouses = response.citizen_ids
              .map((item: { flat_id: any }, index: number) => ({
                id: index + 1,
                name: item.flat_id,
              }));

            this.rentedHouses.forEach((house: { id: any, name: any }) => {
            });
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('User not found');
    }
  }

  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/user_default.svg';
  }

}

