import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { SelectedFlatService } from '../services/selected-flat.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  template: '{{ selectedFlatId }}'
})
export class AccountComponent implements OnInit {
    loading = false;

    formErrors: any = {
      house: '',
    };

    reloadPageWithLoader() {
      this.loading = true;
      setTimeout(() => {
        location.reload();
      }, 500);
    }

    public selectedFlatId: any | null;
    houses: { id: number, name: string }[] = [];
    addressHouse: FormGroup<{ flat_id: FormControl<any>; }> | undefined;

    selectHouse = new FormGroup({
      house: new FormControl('виберіть оселю')
    });

    constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService, private selectedFlatService: SelectedFlatService) { }

    ngOnInit(): void {
      this.dataService.getData().subscribe((data: any) => {
        console.log(data);
      });

      const houseJson = localStorage.getItem('house');
      if (houseJson) {
        this.selectHouse.setValue({ house: JSON.parse(houseJson).flat_id });
      }

      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
          .subscribe(
            (response: any | undefined) => {
              this.houses = response.ids.map((item: { flat_id: any; }, index: number) => ({
                id: index + 1,
                name: item.flat_id
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
    }
}
