import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-comun-stat-all',
  templateUrl: './comun-stat-all.component.html',
  styleUrls: ['./comun-stat-all.component.scss'],
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
export class ComunStatAllComponent implements OnInit {

  flatInfo: any;
  selectedMonth!: any;
  selectedYear!: any;
  selectedFlatId!: string | null;
  loading: boolean = true;
  statsAll: any;
  totalNeedPay: number | undefined;
  totalPaid: number | undefined;
  difference: number | undefined;

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedMonth = localStorage.getItem('selectedMonth');
      this.selectedYear = localStorage.getItem('selectedYear');
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getInfoComun()
          .then(() => {

            this.loading = false;
          })
          .catch((error) => {
            console.error('Error', error);
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    });
  }

  async getInfoComun(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const selectedYear = localStorage.getItem('selectedYear');
    let selectedMonth = localStorage.getItem('selectedMonth');

    if (selectedMonth && selectedYear && userJson) {
      const response = await this.http.post('http://localhost:3000/comunal/get/comunalAll', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        when_pay_y: JSON.parse(selectedYear),
        when_pay_m: JSON.parse(selectedMonth)
      }).toPromise() as any;

      if (response) {
        localStorage.setItem('comunal_inf', JSON.stringify(response));

        this.statsAll = response.comunal.map((item: {
          tariff: any;
          consumed: any;
          howmuch_pay: any;
          calc_howmuch_pay: any;
          comunal_name: any
        }, index: number) => ({
          id: index + 1,
          name: item.comunal_name,
          needPay: item.calc_howmuch_pay,
          paid: item.howmuch_pay,
          consumed: item.consumed,
          tariff: item.tariff,
        }));

        this.flatInfo = this.statsAll;
        this.calculateTotals()

      } else {
        console.log('user not found');
      }
    }
  }

  calculateTotals() {
    this.totalNeedPay = 0;
    this.totalPaid = 0;
    this.difference = 0;

    for (const utility of this.statsAll) {
      const needPay = parseFloat(utility.needPay);
      if (!isNaN(needPay)) {
        this.totalNeedPay += needPay;
      }

      const paid = parseFloat(utility.paid);
      if (!isNaN(paid)) {
        this.totalPaid += paid;
      }

      utility.difference = needPay - paid;
    }

    this.difference = this.totalNeedPay - this.totalPaid;
  }
}

