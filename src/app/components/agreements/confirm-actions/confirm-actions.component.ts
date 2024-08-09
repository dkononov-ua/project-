import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { months } from '../../../data/shared'
import { SharedService } from 'src/app/services/shared.service';
import { SendMessageService } from 'src/app/services/chat/send-message.service';
import * as ServerConfig from 'src/app/config/path-config';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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

@Component({
  selector: 'app-confirm-actions',
  templateUrl: './confirm-actions.component.html',
  styleUrls: ['./confirm-actions.component.scss'],
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
export class ConfirmActionsComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedMonth: any;
  selectedYear: any;
  months = months;
  currentMonth: any;
  messageText: string = '';
  userData: any;
  date!: any;
  selectedReject: boolean = false;
  aboutReject: string = '';

  reasonPay: string = '';
  reasonDatePay: string = '';
  reasonPledgePay: string = '';
  reasonValidity: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private sendMessageService: SendMessageService,
  ) {
    // console.log(data)
    this.getDate();
  }

  getDate() {
    this.date = new Date();
    this.date = moment(this.date).format('YYYY-MM-DD HH:mm:ss');
  }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        this.loadData();
      }
    })
  }

  async loadData(): Promise<void> {
    // console.log('loadData')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.userData = JSON.parse(userData);
        // console.log(this.userData)
      } else {
        // console.log('Інформація користувача відсутня')
      }
    } else {
      // console.log('Авторизуйтесь')
    }
  }

  sendMessage(): void {
    const userJson = localStorage.getItem('user');
    // console.log(this.data)
    if (userJson && this.data) {
      this.messageText = `${this.date}
      Умови угоди оселі
      ID ${this.data.flat_id}
      Місто ${this.data.city}
      Вулиця ${this.data.street}
      Будинок ${this.data.houseNumber} відхилено!
      Умови які не влаштовують:
      ${this.reasonPay ? 'Сума оплати\n' : ''}
      ${this.reasonDatePay ? 'Дата оплати\n' : ''}
      ${this.reasonPledgePay ? 'Сума залогу\n' : ''}
      ${this.reasonValidity ? 'Термін дії\n' : ''}
      ${this.aboutReject}`;
      // console.log(this.messageText)
      this.sharedService.setStatusMessage('Відправляємо повідомлення');
      this.sendMessageService.sendMessageUser(this.messageText, this.data.flat_id)
        .subscribe(response => {
          if (response.status === true) {
            setTimeout(() => {
              this.sharedService.setStatusMessage('Повідомлення відправлено');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 1500);
            }, 1000);
          }
        },
          error => { console.error(error); }
        );
      this.messageText = '';
    }
  }
}





