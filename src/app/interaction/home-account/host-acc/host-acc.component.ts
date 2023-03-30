import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-host-acc',
  templateUrl: './host-acc.component.html',
  styleUrls: ['./host-acc.component.scss']
})
export class HostAccComponent implements OnInit {

  public selectedFlatId: any | null;
  houses: { id: number, name: string }[] = [];
  selectHouse = new FormGroup({
    house: new FormControl('виберіть оселю')
  });
  addressHouse: FormGroup<{ flat_id: FormControl<any>; }> | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  ngOnInit(): void {
    this.spinner.show();

    // Імітація запиту на сервер
    setTimeout(() => {
      // ховаємо лоадер після отримання даних
      this.spinner.hide();
    }, 2000);

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
            this.spinner.hide();
          },
          (error: any) => {
            console.error(error);
            this.spinner.hide();
          }
        );
    } else {
      console.log('user not found');
      this.spinner.hide();
    }

    this.selectHouse.get('house')?.valueChanges.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        console.log('Ви вибрали оселю з ID:', selectedFlatId);

        localStorage.removeItem('house');
        localStorage.setItem('house', JSON.stringify({ flat_id: selectedFlatId }));
        const userJson = localStorage.getItem('user');
        if (userJson) {
          this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
            .subscribe(
              (response: any) => {
                console.log(response);
                if (response !== null) {
                  this.addressHouse = this.fb.group({
                    flat_id: [response.flat.flat_id, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
                  });
                }
              },
              (error: any) => {
                console.error(error);
              }
            );
          this.selectedFlatId = selectedFlatId;
        } else {
          console.log('user not found');
        }
      } else {
        console.log('Нічого не вибрано');
      }
    });
  }

  initializeForm(): void {
    this.addressHouse = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]]
    });
  }


}
