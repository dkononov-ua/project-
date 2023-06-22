import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { forkJoin } from 'rxjs';

interface FlatInfoResponse {
  flat_id: number;
  flat: {
    flat_id: number;
    // other properties of the flat object
  };
  // other properties of the response object
}

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
  rentedHouses!: { id: number; name: string; }[];

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
    this.loadHouses();
    this.setupSelectHouseListener();
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
                    flat_id: [response.flat_id], // Fix: Use response.flat_id instead of response.flat.flat_id
                  });
                } else {
                  this.addressHouse.patchValue({ flat_id: response.flat_id }); // Fix: Use response.flat_id instead of response.flat.flat_id
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

      const userJson = localStorage.getItem('user');
      if (userJson) {
        const flatInfo$ = this.http.post<FlatInfoResponse>('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId });
        const reload$ = new Promise<void>((resolve) => setTimeout(() => {
          location.reload();
          resolve();
        }, 1300));

        forkJoin([flatInfo$, reload$]).subscribe(([response]) => {
          if (response !== null) {
            const flatId = response.hasOwnProperty('flat_id') ? response.flat_id : null;
            if (flatId) {
              if (this.addressHouse === undefined) {
                this.addressHouse = this.fb.group({
                  flat_id: [flatId],
                });
              } else {
                this.addressHouse.patchValue({ flat_id: flatId });
              }
            }
          }
        }, (error: any) => {
          console.error(error);
        });
      } else {
        console.log('user not found');
      }

      this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);
    } else if (this.selectedRentedFlatId) {
      console.log('Ви вибрали орендовану оселю з ID:', this.selectedRentedFlatId);
      localStorage.setItem('house', JSON.stringify({ flat_id: this.selectedRentedFlatId }));

      const userJson = localStorage.getItem('user');
      if (userJson) {
        const flatInfo$ = this.http.post<FlatInfoResponse>('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedRentedFlatId });
        const reload$ = new Promise<void>((resolve) => setTimeout(() => {
          location.reload();
          resolve();
        }, 1300));

        forkJoin([flatInfo$, reload$]).subscribe(([response]) => {
          if (response !== null) {
            if (this.addressHouse === undefined) {
              this.addressHouse = this.fb.group({
                flat_id: [response.flat_id],
              });
            } else {
              this.addressHouse.patchValue({ flat_id: response.flat_id });
            }
          }
        }, (error: any) => {
          console.error(error);
        });
      } else {
        console.log('user not found');
      }

      this.selectedFlatService.setSelectedFlatId(this.selectedRentedFlatId);
    } else {
      console.log('Нічого не вибрано');
    }
  }
}


