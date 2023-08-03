import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject, debounceTime } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface FlatInfo {
  comunal_company: string | undefined;
  comunal_name: string | undefined;
  comunal_address: string | undefined;
  comunal_site: string | undefined;
  comunal_phone: string | undefined;
  iban: string | undefined;
  edrpo: string | undefined;
  personalAccount: string | undefined;
  comunal_before: number | undefined;
  comunal_now: number;
  howmuch_pay: number;
  about_pay: string | undefined;
  tariff: number;
  consumed: number;
  calc_howmuch_pay: number;
  calc_tariff_square: number;
}
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})
export class PaymentHistoryComponent implements OnInit {

  flatInfo: FlatInfo = {
    comunal_company: '',
    comunal_name: '',
    comunal_address: '',
    comunal_site: '',
    comunal_phone: '',
    iban: '',
    edrpo: '',
    personalAccount: '',
    comunal_before: 0,
    comunal_now: 0,
    howmuch_pay: 0,
    about_pay: '',
    tariff: 0,
    consumed: 0,
    calc_howmuch_pay: 0,
    calc_tariff_square: 0,
  };

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;
  disabled: boolean = true;
  disabledNot: boolean = true;
  area: any;
  selectedOption: any;
  tariff_square: any;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  houses: { id: number, name: string }[] = [];
  selectedMonth: any;
  selectedYear: number | undefined;
  public selectedComunal: any | null;
  selectedFlatId!: string | null;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dataService: DataService,
    private http: HttpClient,
    private hostComunComponent: HostComunComponent,
    private selectedFlatService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.selectedMonth = localStorage.getItem('selectedMonth');
        this.getInfoComun(this.selectedMonth);
        this.getInfoFlat();
        this.calculateConsumed();
        this.calculatePay();
      }
    });
  }

  getInfoFlat() {
    this.dataService.getData().subscribe((data: any) => {
      this.area = data.houseData.param.area;
      this.selectedOption = data.houseData.param.option_flat;
    });
  }

  async getInfoComun(selectedMonth: string): Promise<any> {

    const userJson = localStorage.getItem('user');
    const selectedYear = localStorage.getItem('selectedYear');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;

    if (selectedYear && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: comunalName,
        when_pay_y: JSON.parse(selectedYear)
      }).toPromise() as any;
      if (response) {
        console.log(response)
        localStorage.setItem('comunal_inf', JSON.stringify(response));
      } else {
        console.error(false);
      }
    } else {
      console.log('user not found');
    }
    this.selectedYear = selectedYear ? JSON.parse(selectedYear) : null;
    this.selectedMonth = selectedMonth ? JSON.parse(selectedMonth) : null;
    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);

    if (userJson && com_inf) {
      const selectMonth = com_inf.comunal.find((selectMonth: any) => {
        return selectMonth.when_pay_y === String(this.selectedYear) &&
          selectMonth.when_pay_m === this.selectedMonth &&
          selectMonth.comunal_name === comunalName;
      });

      if (selectMonth) {
        this.flatInfo = selectMonth;
      }
    } else {
      console.log('user not found');
    }
  }

  saveInfo(): void {
    const comunal_name = localStorage.getItem('comunal_name');
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {
      this.http.post('http://localhost:3000/comunal/add/comunal', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        comunal_name: JSON.parse(comunal_name!).comunal,
        when_pay_y: JSON.parse(localStorage.getItem('selectedYear')!),
        when_pay_m: JSON.parse(localStorage.getItem('selectedMonth')!),
        comunal: this.flatInfo,
      })
        .subscribe((response: any) => {
          console.log(response)

          this.disabled = true;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  calculateConsumed(): void {
    if (this.flatInfo.comunal_before !== undefined && this.flatInfo.comunal_now !== undefined) {
      this.flatInfo.consumed = this.flatInfo.comunal_now - this.flatInfo.comunal_before;
    } else {
      this.flatInfo.consumed = 0;
    }
  }

  calculatePay(): void {
    if (this.flatInfo.tariff !== undefined && this.flatInfo.consumed !== undefined) {
      this.flatInfo.calc_howmuch_pay = this.flatInfo.tariff * this.flatInfo.consumed;
    } else {
      this.flatInfo.calc_howmuch_pay = 0;
    }
  }

  calculatePaySquare(): void {
    if (this.tariff_square !== undefined && this.area !== undefined) {
      this.flatInfo.calc_tariff_square = this.tariff_square * this.area;
    } else {
      this.flatInfo.calc_tariff_square = 0;
    }
  }

  copy(): void {
    localStorage.setItem('copiedData', JSON.stringify(this.flatInfo));
    console.log('Data copied successfully!');
  }

  paste(): void {
    const copiedData = localStorage.getItem('copiedData');
    if (copiedData) {
      const parsedData: FlatInfo = JSON.parse(copiedData);
      this.flatInfo = { ...parsedData };
      console.log('Data pasted successfully!');
    } else {
      console.log('No data found to paste.');
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open('Дані збережено', 'Закрити', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    if (this.disabled === false)
      this.flatInfo = {
        comunal_company: '',
        comunal_name: '',
        comunal_address: '',
        comunal_site: '',
        comunal_phone: '',
        iban: '',
        edrpo: '',
        personalAccount: '',
        comunal_before: 0,
        comunal_now: 0,
        howmuch_pay: 0,
        about_pay: '',
        tariff: 0,
        consumed: 0,
        calc_howmuch_pay: 0,
        calc_tariff_square: 0,
      };
  }
}
