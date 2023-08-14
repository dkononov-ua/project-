  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
  import { DataService } from 'src/app/services/data.service';
  import { SelectedFlatService } from 'src/app/services/selected-flat.service';

  @Component({
    selector: 'app-housing-selection',
    templateUrl: './housing-selection.component.html',
    styleUrls: ['./housing-selection.component.scss']
  })
  export class HousingSelectionComponent implements OnInit {
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

    selectHouse = new FormGroup({
      house: new FormControl('виберіть оселю')
    });
    images: any;
    selectedRentedFlatId: any;

    constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, private selectedFlatService: SelectedFlatService) { }

    ngOnInit(): void {
      this.loadImages();
      this.loadHouses();
      this.setupSelectHouseListener();
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

              if (this.flatImg !== undefined && Array.isArray(this.flatImg) && this.flatImg.length > 0) {
                this.images = [];
                for (const img of this.flatImg) {
                  this.images.push('http://localhost:3000/img/flat/' + img.img);
                }
              } else {
                this.images = ['http://localhost:3000/housing_default.svg'];
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

    loadHouses(): void {
      this.loadOwnedHouses();
      this.loadRentedHouses();
    }

    loadOwnedHouses(): void {
      const userJson = localStorage.getItem('user');
      const houseJson = localStorage.getItem('house');

      if (userJson !== null) {
        this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
          .subscribe(
            (response: any) => {
              this.houses = response.ids.map((item: { flat_id: any }, index: number) => ({
                id: index + 1,
                name: item.flat_id,
              }));

              this.houses.forEach((house: { id: any, name: any }) => {
              });

              if (houseJson) {
                const selectedFlatId = JSON.parse(houseJson).flat_id;
                const selectedHouseExists = this.houses.some((house: { name: any }) => house.name === selectedFlatId);

                if (selectedHouseExists) {
                  this.selectHouse.setValue({ house: selectedFlatId });
                } else {
                  console.log('House does not exist');
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
        this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
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

    setupSelectHouseListener(): void {
      const userJson = localStorage.getItem('user');

      this.selectHouse.get('house')?.valueChanges.subscribe(selectedFlatId => {
        if (selectedFlatId) {
          localStorage.removeItem('house');
          localStorage.setItem('house', JSON.stringify({ flat_id: selectedFlatId }));

          this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson!), flat_id: selectedFlatId })
            .subscribe(
              (response: any) => {
                if (response !== null) {
                  if (this.addressHouse === undefined) {
                    this.addressHouse = this.fb.group({
                      flat_id: [response.flat_id],
                    });
                  } else {
                    this.addressHouse.patchValue({ flat_id: response.flat_id });
                  }
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
                  if (this.addressHouse === undefined) {
                    this.addressHouse = this.fb.group({
                      flat_id: [response.flat_id],
                    });
                  } else {
                    this.addressHouse.patchValue({ flat_id: response.flat_id });
                  }
                }
              },
              (error: any) => {
                console.error(error);
              }
            );
        } else {
          console.log('user not found');
        }

        this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);

        setTimeout(() => {
          location.reload();
        }, 500);
      } else if (this.selectedRentedFlatId) {
        console.log('Ви вибрали орендовану оселю з ID:', this.selectedRentedFlatId);
        localStorage.setItem('house', JSON.stringify({ flat_id: this.selectedRentedFlatId }));

        this.selectedFlatId = this.selectedRentedFlatId;
        const userJson = localStorage.getItem('user');
        if (userJson) {
          this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedRentedFlatId })
            .subscribe(
              (response: any) => {
                if (response !== null) {
                  if (this.addressHouse === undefined) {
                    this.addressHouse = this.fb.group({
                      flat_id: [response.flat_id],
                    });
                  } else {
                    this.addressHouse.patchValue({ flat_id: response.flat_id });
                  }
                }
              },
              (error: any) => {
                console.error(error);
              }
            );
        } else {
          console.log('user not found');
        }

        this.selectedFlatService.setSelectedFlatId(this.selectedRentedFlatId);

        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        this.loading = false;
        console.log('Нічого не вибрано');
      }
    }

  }
