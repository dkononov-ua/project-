import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/MM/YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

registerLocaleData(localeUk);

@Component({
  selector: 'app-uagree-download',
  templateUrl: './uagree-download.component.html',
  styleUrls: ['./uagree-download.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class UagreeDownloadComponent implements OnInit {
  houseData: any;
  userData: any;

  isMonthDisabled = true;
  isYearDisabled = true;
  isRentDataDisabled = true;
  isCityDisabled = true;
  isStreetDisabled = true;
  isApartmentNumberDisabled = true;
  isHouseNumberDisabled = true;
  isApartmentSizeDisabled = true;
  isCheckboxPenalty = true;
  isRentPriceDisabled = true;
  isCheckboxChecked = false;
  selectedFlatAgree: any;
  selectedAgreement: any;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      this.selectedAgreement = await this.getAgree(this.selectedFlatAgree);
    });
    this.loadData();
    this.displayCurrentDate();
  }

  loadData(): void {
    this.dataService.getData().subscribe(
      (response: any) => {
        this.houseData = response.houseData;
        this.userData = response.userData;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async getAgree(selectedFlatAgree: string): Promise<any> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/agreement/get/saveyagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === selectedFlatAgree);
      return selectedAgreement || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  displayCurrentDate(): void {
    const currentDate = moment().format('YYYY-MM-DD');
  }

  printContainer(): void {
    const printContainer = document.querySelector('.print-container');
    if (!printContainer) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      const headContent = `
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Discussio Agree</title>
          <style>
          input {
            border: none;
            border-radius: 0;
            width: 70%;
            height: 10px;
          }

          p {
            font-size: 12px;
            font-family: 'Montserrat', sans-serif;
          }

          ul {
            font-weight: 600;
            font-size: 12px;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
          }

          li {
            font-size: 12px;
            font-weight: 400;
            font-family: 'Montserrat', sans-serif;
          }

          h5 {
            font-size: 14px;
          }

          mat-label {
            font-size: 12px;
          }

          .print-container {
            font-family: 'Montserrat', sans-serif;
            width: 90%;
            margin: 0;
            padding: 10px 20px;
          }

          .print-container {
            display: block;
          }

          .agree {
            width: 100%;
            padding: 10px 20px;
          }

          .box {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
          }

          .title-group {
            display: flex;
          }
          .logo {
            width: 6rem;
            height: 6rem;
          }

          .title {
            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 1.2em;
          }
          .accent {
            font-weight: 600;
          }
          .container-agree {
            display: flex;
            flex-direction: column;
          }
          .wrapper-group {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
          }
          .agree-wrapper {
            width: 49%;
            display: flex;
            align-items: baseline;
            flex-direction: column;
            justify-content: flex-start;
          }

          .item-agree {
            width: 100%;
            font-weight: 600;
            border-radius: 10px;
            padding: 2px;
            margin: 2px 5px;
          }

          .container-fluid {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
          }

          .field-box {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            margin-top: 20px;
          }

          .input-box {
            display: flex;
            width: 100%;
            height: 20px !important;
            align-items: center;
            border-bottom: 1px solid black;
            padding: 0px 10px;
            position: relative;
          }

          .signature-box {
            display: flex;
            flex-wrap: wrap;
          }

          .input-box-signature {
            display: flex;
            width: 100%;
            height: 40px !important;
            align-items: center;
            padding: 0px 10px;
            position: relative;
          }

          .signature {
            color: rgb(54, 54, 54);
            width: 30%;
            height: 30px;
            padding: 0px 10px;
            font-size: 8px;
            margin-left: 5px;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
          }

          .mb-2 {
            margin-bottom: 20px;
          }

          .text {
            font-size: 14px;
          }

          .item-description-agree {
          }

          .about {
            width: 100%;
            min-height: 200px;
            border-top: 1px solid gray;
            border-bottom: 1px solid gray;
          }

          </style>

        </head>
      `;
      const bodyContent = `
        <body>
          ${printContainer.outerHTML}
        </body>
      `;
      doc.write(`<html>${headContent}${bodyContent}</html>`);
      doc.close();

      iframe.onload = () => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      };
    }
  }

  printPage(): void {
    this.printContainer();
  }

}

