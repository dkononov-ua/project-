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
  public selectedFlatId: any | null;
  houses: { id: number, name: string }[] = [];
  addressHouse: FormGroup | undefined;
  selectHouse = new FormGroup({
    house: new FormControl('виберіть оселю')
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.loadHouses();
    this.setupSelectHouseListener();
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

  onSelectionChange() {
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

      this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);

    } else {
      console.log('Нічого не вибрано');
    }
  }
}

