import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../../services/chose-subscribers.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AgreeDeleteComponent } from '../../agree-h/agree-delete/agree-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { animations } from '../../../../interface/animation';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
export class Rating {
  constructor(
    public ratingComment: string = '',
    public ratingValue: string = '',
    public ratingDate: string = '',
  ) { }
}
interface Subscriber {
  acces_flat_chats: boolean;
  acces_flat_features: boolean;
  acces_agent: boolean;
  acces_comunal_indexes: boolean;
  acces_citizen: boolean;
  acces_agreement: boolean;
  acces_discuss: boolean;
  acces_subs: boolean;
  acces_filling: boolean;
  acces_services: boolean;
  acces_admin: boolean;
  acces_comunal: boolean;
  acces_added: boolean;
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  tell: number;
  photo: string;
  img: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  mail: string;
}
@Component({
  selector: 'app-resident-page',
  templateUrl: './resident-page.component.html',
  styleUrls: ['./resident-page.component.scss'],
  // переклад календаря
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS], },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  // переклад календаря
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class ResidentPageComponent implements OnInit {
  rating: Rating = new Rating();
  helpMenu: boolean = false;
  helpInfo: number = 0;
  ratingTenant: number | undefined;
  ratingOwner: number | undefined;
  numberOfReviewsOwner: any;
  reviewsOwner: any;
  page: any;
  card: any;
  menu: any;
  selectMyPage: boolean = false;
  agree: any;
  numConcludedAgree: any;
  agreementData: any;
  selectedSubAgree: any;
  timeToOpenRating: number = 0;
  isCopiedMessage!: string;
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  selectedSubscriber: Subscriber[] | any;
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  loading = false;
  statusMessageChat: any;
  isCopied = false;
  indexPersonMenu: number = 0;
  ownerInfo: any
  iResident: string = '';
  statusMessage: string | undefined;
  minDate!: string;
  maxDate!: string;
  numberOfReviews: any;
  totalDays: any;
  reviews: any;

  statusPermitCreate: boolean = false;
  statusPermitStart: boolean = false;
  statusPermitEnd: boolean = false;
  statusPermitCreateMsg: string = '';
  statusPermitStartMsg: string = '';
  statusPermitEndMsg: string = '';

  indexPage: number = 1;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  goBack(): void {
    this.location.back();
  }
  isMobile = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private location: Location,
    private breakpointObserver: BreakpointObserver,

  ) {
    this.setMinMaxDate(35);
    this.rating.ratingDate = this.formatDate(new Date());
  }

  async ngOnInit(): Promise<void> {
    // перевірка який пристрій
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    await this.getSelectedFlat();
    this.getOwnerPage();
  }

  // Отримую обрану оселю і виконую запит по її власнику та мешкнцям
  async getSelectedFlat() {
    // console.log('getSelectedFlat')
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        const offs = 0;
        await this.getResidents(selectedFlatId, offs);
      } else {
        console.log('Оберіть оселю')
      }
    });
  }

  // Отримую обрану оселю і виконую запит по її власнику та мешкнцям
  async getOwnerPage() {
    this.sharedService.checkOwnerPage$.subscribe(checkOwnerPage => {
      if (checkOwnerPage) {
        this.iResident = checkOwnerPage;
      } else {
        this.iResident = 'false';
      }
    });
  }

  // Отримую мешканців
  async getResidents(selectedFlatId: string | any, offs: number): Promise<any> {
    // console.log('getResidents')
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, offs: offs, };
    try {
      const response = await this.http.post(serverPath + '/citizen/get/citizen', data).toPromise() as any[];
      if (response) {
        this.subscribers = response;
        localStorage.setItem('allResidents', JSON.stringify(response));
        await this.selectResidents();
      } else {
        localStorage.removeItem('allResidents');
      }
    } catch (error) { console.error(error); }
  }

  // Дії якщо я обрав мешканця
  async selectResidents(): Promise<any> {
    this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      const userData = localStorage.getItem('userData');
      if (subscriberId && userData) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id.toString() === String(subscriberId));
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
          await this.getRating(selectedSubscriber);
          await this.getConcludedAgree(selectedSubscriber);
        }
        const userObject = JSON.parse(userData);
        const user_id = userObject.inf.user_id;
        // перевіряю чи я обрав свою сторінку
        if (user_id === subscriberId) {
          this.selectMyPage = true;
          // якщо так то закриваю деякі функції
        } else {
          this.selectMyPage = false;
        }
      }
    });
  }

  // Створюю чат
  async createChat(selectedPerson: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && selectedPerson) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: selectedPerson.user_id, };
      try {
        const response: any = await this.http.post(serverPath + '/chat/add/chatFlat', data).toPromise();
        if (response.status === true) {
          this.sharedService.setStatusMessage('Створюємо чат');
          setTimeout(() => {
            this.router.navigate(['/chat']);
            this.sharedService.setStatusMessage('');
          }, 2000);
        } else if (response.status === 'Чат вже існує') {
          this.sharedService.setStatusMessage('Чат вже існує');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Переходимо до чату');
            this.choseSubscribersService.setSelectedSubscriber(selectedPerson.user_id);
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              this.router.navigate(['/chat-house'], { queryParams: { user_id: selectedPerson.user_id } });
            }, 2000);
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

  // Надсилаю оцінку орендарю
  sendRating(selectedSubscriber: any) {
    // console.log('sendRating')
    const userJson = localStorage.getItem('user');
    const formattedDate = this.datePipe.transform(this.rating.ratingDate, 'yyyy-MM-dd');
    if (userJson && selectedSubscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedSubscriber.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue,
      };
      this.http.post(serverPath + '/rating/add/userRating', data).subscribe((response: any) => {
        let setMark = this.rating.ratingValue.toString();
        if (response.status === true && setMark === '5') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Дякуємо за підтримку гарних людей');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Відгук збережено!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '4') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Добрі стосунки це важливо');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Відгук збережено, дякуємо!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '3') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Стабільність це добре');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Відгук збережено, дякуємо!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '2') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Йой, сподіваємось все налагодиться');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Відгук збережено!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '1') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Напевно є не закриті питання');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Відгук збережено!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === 'Нажаль данну оцінку не змінити') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відгук за обраною датою закритий');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оберіть іншу дату');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else {
          setTimeout(() => {
            this.statusMessage = 'Помилка збереження';
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 200);
        }

        this.getRating(selectedSubscriber);
        setTimeout(() => {
          this.indexPage = 4;
        }, 4000);
        this.indexPersonMenu = 0;
        this.rating.ratingComment = '';

      }, (error: any) => {
        console.error(error);
      });
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // отримую рейтинг мешканців оселі
  async getRating(selectedUser: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;

      if (response && Array.isArray(response.status)) {
        this.reviews = response.status;
        let totalMarkTenant = 0;
        this.numberOfReviews = response.status.length;

        response.status.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkTenant += item.info.mark;
          }
        });

        // Після того як всі оцінки додані, ділимо загальну суму на кількість оцінок
        if (this.numberOfReviews > 0) {
          this.ratingTenant = totalMarkTenant / this.numberOfReviews;
        } else {
          this.ratingTenant = 0;
        }

        // console.log('Кількість відгуків:', this.numberOfReviews);
      } else {
        this.numberOfReviews = 0;
        this.reviews = undefined;
        this.ratingTenant = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.isCopiedMessage = message;
          setTimeout(() => {
            this.isCopiedMessage = '';
          }, 2000);
        })
        .catch((error) => {
          this.isCopiedMessage = '';
        });
    }
  }
  copyId(copyId: any) { if (copyId) this.copyToClipboard(copyId, 'ID скопійовано'); }
  copyTell(copyTell: any) { if (copyTell) this.copyToClipboard(copyTell, 'Телефон скопійовано'); }
  copyMail(copyMail: any) { if (copyMail) this.copyToClipboard(copyMail, 'Пошту скопійовано'); }
  copyViber(copyViber: any) { if (copyViber) this.copyToClipboard(copyViber, 'Viber номер скопійовано'); }
  // Відправка скарги на орендара, через сервіс
  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано'); setTimeout(() => {
          this.sharedService.setStatusMessage('');
        }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка'); setTimeout(() => {
          this.sharedService.setStatusMessage('');
        }, 2000);
      }
    });
  }
  // Видаляю з оселі
  removeUser(subscriber: any): void {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    if (!userJson || !userData) { console.log('Авторизуйтесь'); return; }
    const userObject = JSON.parse(userData);
    const userId = userObject.inf.user_id;
    const dialogRef = this.dialog.open(AgreeDeleteComponent, {
      data: {
        flatId: this.selectedFlatId,
        subscriberId: subscriber.user_id,
        subscriber_firstName: subscriber.firstName,
        subscriber_lastName: subscriber.lastName,
        offer: 3,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: subscriber.user_id
      };

      if (result === true) {
        this.loading = true;
        if (userId !== subscriber.user_id) {
          this.removeResident(data);
        } else { this.leaveHouse(data); }
      }
    });
  }
  // Видаляю мешканця
  removeResident(data: any): void {
    this.sharedService.setStatusMessage('Видаляємо мешканця');
    this.http.post(serverPath + '/citizen/delete/citizen', data).subscribe(() => { this.updateSubscriberList(); },
      (error: any) => { console.error('Error deleting subscriber:', error); });
  }
  // Видаляюсь з оселі
  async leaveHouse(data: any): Promise<void> {
    try {
      const response = await this.http.post(serverPath + '/citizen/delete/citizen', data).toPromise() as any;
      // console.log(response)
      if (response) {
        this.sharedService.setStatusMessage('Виходимо з оселі');
        setTimeout(() => {
          this.sharedService.setStatusMessage('Очищуємо дані');
          this.selectedFlatIdService.clearSelectedFlatId();
          localStorage.removeItem('selectedComun');
          localStorage.removeItem('selectedHouse');
          localStorage.removeItem('selectedFlatId');
          localStorage.removeItem('selectedFlatName');
          localStorage.removeItem('houseData');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Очищено');
            setTimeout(() => {
              this.router.navigate(['/house/house-control/selection-house']);
              this.sharedService.setStatusMessage('');
            }, 500);
          }, 1000);
        }, 1000);
      } else {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Помилка видалення');
          setTimeout(() => {
            location.reload();
          }, 500);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Оновлюю список мешканців
  updateSubscriberList(): void {
    setTimeout(() => {
      this.sharedService.setStatusMessage('Оновлюємо список мешканців');
      this.selectedSubscriber = undefined;
      setTimeout(() => {
        this.getResidents(this.selectedFlatId, 0);
        this.sharedService.setStatusMessage('');
        this.loading = false;
      }, 1000);
    }, 1000);
  }
  // Якщо видаляюсь з оселі очищую всі дані оселі
  clearLocalStorage(): void {
    localStorage.removeItem('house');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
  }
  // Отримую угоди для виведення інформації по ним для мешканців та власника
  async getConcludedAgree(selectedSubscriber: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: 0, };
    try {
      const response: any = (await this.http.post(serverPath + '/agreement/get/saveagreements', data).toPromise()) as any;
      // console.log(response)
      if (response) {
        const agreeData = response.filter((item: { flat: { subscriber_id: any; }; }) =>
          item.flat.subscriber_id === selectedSubscriber.user_id
        );
        if (agreeData && agreeData.length !== 0) {
          this.selectedSubAgree = agreeData[0].flat;
          // підраховую яка кількість днів залишилась до відкриття відгука
          const { data } = agreeData[0].flat;
          const daysToAdd = 14;
          const openRating: Date = new Date(data);
          openRating.setDate(openRating.getDate() + daysToAdd);
          const today: Date = new Date();
          const differenceInTime: number = openRating.getTime() - today.getTime();
          const differenceInDays: number = Math.ceil(differenceInTime / (1000 * 3600 * 24));
          this.timeToOpenRating = differenceInDays;
          if (this.selectedSubAgree) {

            const checkTimeCreate = differenceInDays;
            if (checkTimeCreate > 0) {
              this.statusPermitCreate = false;
              this.statusPermitCreateMsg = 'Доступ до цінювання через ' + this.timeToOpenRating + ' днів';
            } else {
              this.statusPermitCreate = true;
              this.statusPermitCreateMsg = 'Оцінювання дозволено';
            }

            const checkTimeStart = new Date() > new Date(this.selectedSubAgree.dateAgreeStart);
            if (!checkTimeStart) {
              this.statusPermitStart = false;
              this.statusPermitStartMsg = 'Угода не вступила в силу';
            } else {
              this.statusPermitStart = true;
              this.statusPermitStartMsg = 'Оцінювання дозволено';
            }

            const checkTimeEnd = new Date() < new Date(this.selectedSubAgree.dateAgreeEnd);
            if (!checkTimeEnd) {
              this.statusPermitEnd = false;
              this.statusPermitEndMsg = 'Дія угоди закінчена';
            } else {
              this.statusPermitEnd = true;
              this.statusPermitEndMsg = 'Оцінювання дозволено';
            }
          }
        } else {
          this.selectedSubAgree = [];
        }
      } else {
        this.numConcludedAgree = 0;
      }
    } catch (error) {
      console.error(error);
    }

  }

  // Перевірка на можливість надіслати відгук
  setMinMaxDate(daysBeforeToday: number) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - daysBeforeToday);
    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(today);
  }
}


