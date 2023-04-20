import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  public selectedFlatId$ = new BehaviorSubject<any>(undefined);

  house = {
    flat_id: '',
  };

  houses: { id: string, name: string }[] = [];
  public selectedFlatId: any | null;
  selectHouse: any;
  addressHouse: FormGroup<{ flat_id: FormControl<any>; country: FormControl<any>; region: FormControl<any>; city: FormControl<any>; street: FormControl<any>; houseNumber: FormControl<any>; apartment: FormControl<any>; flat_index: FormControl<any>; private: FormControl<any>; rent: FormControl<any>; live: FormControl<any>; who_live: FormControl<any>; subscribers: FormControl<any>; }> | undefined;
  fb: any;

  constructor(private http: HttpClient, private dataService: DataService) {  }

  ngOnInit(): void {
    console.log('Пройшла перевірка користувача');
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            this.house.flat_id = response.houseData.flat.flat_id;
          } else {
            console.error('houseData field is missing from server response');
          }
        });
      }
    }
  }

  onSubmitDeleteHouse(): void {
    const selectedFlatId = this.selectHouse.get('house')?.value;
    const houseJson = localStorage.getItem('house');
    if (houseJson) {
      console.log(JSON.parse(houseJson))
    }

    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/deleteflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
    location.reload();
  }
}
