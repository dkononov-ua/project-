import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';
import { ChangeComunService } from '../change-comun.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { Subscriber } from 'src/app/interface/info';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharingInfoComponent } from 'src/app/components/sharing-info/sharing-info.component';
import { ViewComunService } from 'src/app/pages/host-user/host-user-discus/discus/view-comun.service';

@Component({
  selector: 'app-comun-stat-month',
  templateUrl: './comun-stat-month.component.html',
  styleUrls: ['./comun-stat-month.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
  ],
})
export class ComunStatMonthComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  messageText: string = '';
  residents: Subscriber[] = [];
  selectedSubscriberID: any;
  selectedSubscriber: Subscriber[] | any;

  open_consumed: boolean = false;
  chatExists: any;
  openConsumed() {
    this.open_consumed = !this.open_consumed;
  }
  open_tariff: boolean = false;
  openTariff() {
    this.open_tariff = !this.open_tariff;
  }
  open_howmuch_pay: boolean = true;
  openHowmuchPay() {
    this.open_howmuch_pay = !this.open_howmuch_pay;
  }
  open_difference: boolean = true;
  openDifference() {
    this.open_difference = !this.open_difference;
  }
  open_payed: boolean = true;
  openPayed() {
    this.open_payed = !this.open_payed;
  }

  open_table: boolean = true;
  openTable() {
    this.open_table = !this.open_table;
  }


  months = [
    { id: 0, name: 'Січень' },
    { id: 1, name: 'Лютий' },
    { id: 2, name: 'Березень' },
    { id: 3, name: 'Квітень' },
    { id: 4, name: 'Травень' },
    { id: 5, name: 'Червень' },
    { id: 6, name: 'Липень' },
    { id: 7, name: 'Серпень' },
    { id: 8, name: 'Вересень' },
    { id: 9, name: 'Жовтень' },
    { id: 10, name: 'Листопад' },
    { id: 11, name: 'Грудень' }
  ];

  displayedColumns: string[] = ['id', 'name', 'consumed', 'tariff', 'needPay', 'paid', 'difference'];
  selectedMonthID: { id: number, name: string } = { id: 0, name: '' };

  flatInfo: any;
  loading: boolean = true;
  statsAll: any;
  totalNeedPay: number | undefined;
  totalPaid: number | undefined;
  difference: any;
  selectedMonthStats: any;
  noInformationMessage: boolean = false;

  selectedFlatId!: string | null;
  selectedComun!: string | null;
  selectedYear: any;
  selectedMonth!: string | null;

  selectedView: any;
  selectedName: string | null | undefined;
  overpaymentText: any;
  currentIndex: number = 0;


  animal!: string;
  name!: string;


  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private selectedViewComun: ViewComunService,
    private sharedService: SharedService,
    private sendMessageService: SendMessageService,
    private choseSubscribersService: ChoseSubscribersService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { this.flatInfo = []; }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectParam();
    if (this.selectedFlatId && this.selectedComun) {
      this.loading = false;
      if (this.selectedFlatId && this.selectedYear && this.selectedMonth) {
        this.getInfoComun();
      } else {
        console.error('Some are missing.');
      }
    } else if (!this.selectedFlatId) {
      this.sharedService.setStatusMessage('Для перегляду статистики треба спочатку обрати оселю');
      setTimeout(() => {
        this.router.navigate(['/house/house-control/selection-house']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }

  getSelectParam() {
    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
      if (this.selectedView) {
        this.selectedFlatId = this.selectedView;
        this.getInfoComun();
      } else {
        this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
          this.selectedFlatId = flatId;
          if (flatId) {
            this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
              this.selectedComun = selectedComun || this.selectedComun;
              this.getInfoComun();
              this.getResidents(this.selectedFlatId, 0);
            }); this.selectedComun
          } else {
            this.selectedComun = null;
          }
        });
      }
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
      this.getInfoComun();
    });

    this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
      this.selectedMonth = selectedMonth || this.selectedMonth;
      this.getInfoComun();
    });
  }

  async getInfoComun(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedMonth && this.selectedYear && userJson) {
      const response = await this.http.post(this.serverPath + '/comunal/get/comunalAll', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        when_pay_y: this.selectedYear,
        when_pay_m: this.selectedMonth,
      }).toPromise() as any;

      if (response) {
        this.noInformationMessage = false;
        const selectedMonthStats = response.comunal.find((item: any) => item.when_pay_m === this.selectedMonth);
        if (selectedMonthStats) {
          this.statsAll = response.comunal
            .filter((item: any) => item.when_pay_m === this.selectedMonth)
            .map((item: any, index: number) => ({
              id: index + 1,
              name: item.comunal_name,
              needPay: item.calc_howmuch_pay,
              paid: item.howmuch_pay,
              consumed: item.consumed,
              tariff: item.tariff,
            }));

          this.flatInfo = this.statsAll;
          this.calculateTotals();
        } else {
          this.noInformationMessage = true;
          console.log('No data found for selected month.');
        }
      } else {
        console.log('User not found.');
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

      utility.difference = (paid - needPay).toFixed(2);
    }

    this.difference = (this.totalNeedPay - this.totalPaid).toFixed(2);
    if (this.difference > 0) {
      this.overpaymentText = 'Борг';
      this.difference = Math.abs(this.difference);
    } else {
      this.overpaymentText = 'Переплата';
      this.difference = Math.abs(this.difference);
    }
  }

  nextMonth() {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    if (this.currentIndex < 11) {
      const previousMonth = this.months[this.currentIndex + 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
    } else if (this.currentIndex === 11) {
      this.currentIndex = 0;
      this.changeMonthService.setSelectedMonth('Січень');
      const yearChange = Number(this.selectedYear) + 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }

  prevMonth(): void {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    if (this.currentIndex > 0) {
      const previousMonth = this.months[this.currentIndex - 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
    } else if (this.currentIndex === 0) {
      this.currentIndex = 11;
      this.changeMonthService.setSelectedMonth('Грудень');
      const yearChange = Number(this.selectedYear) - 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }

  // Отримую мешканців
  async getResidents(selectedFlatId: string | any, offs: number): Promise<any> {
    // console.log('getResidents')
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, offs: offs, };
    try {
      const response = await this.http.post(this.serverPath + '/citizen/get/citizen', data).toPromise() as any[];
      if (response) {
        this.residents = response;
        localStorage.setItem('allResidents', JSON.stringify(response));
      } else {
        localStorage.removeItem('allResidents');
      }
    } catch (error) { console.error(error); }
  }

  openDialog(residents: any): void {
    const dialogRef = this.dialog.open(SharingInfoComponent, {
      data: { residents },
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && result.resident.user_id) {
        this.checkChatExistence(result.resident.user_id);
      } else {

      }
    });
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  async selectResident(resident: any) {
    this.choseSubscribersService.setSelectedSubscriber(resident.user_id);
    if (resident.user_id) {
      this.checkChatExistence(resident.user_id);
    }
  }

  // Перевірка на існування чату
  async checkChatExistence(resident_id: string): Promise<any> {
    // console.log('checkChatExistence')

    const userJson = localStorage.getItem('user');
    if (userJson && resident_id) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, offs: 0 };
      try {
        const response = await this.http.post(this.serverPath + '/chat/get/flatchats', data).toPromise() as any;
        if (resident_id && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { user_id: any }) => chat.user_id === resident_id);
          this.chatExists = chatExists;
          if (this.chatExists) {
            this.sendMessage(resident_id)
          } else {
            this.createChat(resident_id);
          }
        }
        else {
          this.createChat(resident_id);
          // console.log('чат не існує');
        }
      } catch (error) { console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

  // Створюю чат
  async createChat(resident_id: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && resident_id) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: resident_id, };
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatFlat', data).toPromise();
        if (response.status === true) {
          this.sharedService.setStatusMessage('Створюємо чат');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відправляємо повідомлення');
            this.sendMessage(resident_id);
            // this.router.navigate(['/chat']);
            this.sharedService.setStatusMessage('');
          }, 2000);
        } else if (response.status === 'Чат вже існує') {
          this.sharedService.setStatusMessage('Чат вже існує');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відправляємо повідомлення');
            this.sendMessage(resident_id);
            // this.sharedService.setStatusMessage('Переходимо до чату');
            // this.choseSubscribersService.setSelectedSubscriber(resident_id);
            // setTimeout(() => {
            //   this.sharedService.setStatusMessage('');
            //   this.router.navigate(['/chat-house'], { queryParams: { user_id: resident_id } });
            // }, 2000);
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Немає доступу');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
        }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  sendMessage(resident_id: string): void {
    // console.log('sendMessage')
    if (this.selectedFlatId && resident_id) {
      this.messageText = `#Статистика#${this.selectedMonth}#${this.selectedYear}# Перегляньте будь ласка. Нараховано загалом: ${this.totalNeedPay?.toFixed(2)}₴  Сплачено загалом: ${this.totalPaid?.toFixed(2)}₴`
      this.sharedService.setStatusMessage('Відправляємо повідомлення');
      this.sendMessageService.sendMessage(this.messageText, this.selectedFlatId, resident_id)
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

