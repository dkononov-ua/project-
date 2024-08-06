import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../../services/chose-subscribers.service';
import * as ServerConfig from 'src/app/config/path-config';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AgreeDeleteComponent } from '../../host-house-agree/agree-delete/agree-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { animations } from '../../../../interface/animation';
import { Location } from '@angular/common';
import { StatusDataService } from 'src/app/services/status-data.service';
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
  selector: 'app-resident-owner',
  templateUrl: './resident-owner.component.html',
  styleUrls: ['./resident-owner.component.scss'],
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

export class ResidentOwnerComponent implements OnInit {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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
  indexMenu: number = 0;
  indexPage: number = 1;
  indexCard: number = 0;
  selectedSubscriber: Subscriber[] | any;
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  loading = false;
  statusMessageChat: any;
  isCopied = false;
  indexPersonMenu: number = 0;
  ownerInfo: any
  ownerPage: boolean = false;
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

  openHelpMenu(helpInfoIndex: number) {
    this.helpInfo = helpInfoIndex;
    this.helpMenu = !this.helpMenu;
  }

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  // Перевірка на можливість надіслати відгук
  setMinMaxDate(daysBeforeToday: number) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - daysBeforeToday);
    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  goBack(): void {
    this.location.back();
  }
  isMobile = false;
  iResident: string = '';

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
    private statusDataService: StatusDataService,
  ) {
    this.setMinMaxDate(35);
    this.rating.ratingDate = this.formatDate(new Date());
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        this.getOwnerPage();
      }
    })
  }

  // Отримую обрану оселю і виконую запит по її власнику та мешкнцям
  async getSelectedFlat() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        await this.getOwner();
      } else {
        console.log('Оберіть оселю')
      }
    });
  }

  // Отримую обрану оселю і виконую запит по її власнику та мешкнцям
  async getOwnerPage() {
    this.sharedService.checkOwnerPage$.subscribe(checkOwnerPage => {
      if (checkOwnerPage === 'true') {
        this.iResident = checkOwnerPage;
        this.getSelectedFlat();
      } else {
        this.iResident = 'false';
      }
    });
  }

  // Дії якщо я обрав власника
  async getOwner(): Promise<any> {
    this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      const ownerInfo = localStorage.getItem('ownerInfo');
      if (ownerInfo) {
        this.ownerInfo = JSON.parse(ownerInfo);
        this.statusDataService.setUserData(this.ownerInfo, 1);
        this.getRatingOwner(this.ownerInfo.user_id);
        this.getConcludedAgree(this.ownerInfo.user_id);
      } else {
        this.ownerInfo = undefined;
      }
    });
  }

  // Створюю чат
  async createChat(selectedPerson: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && selectedPerson) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: selectedPerson.user_id, };
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatFlat', data).toPromise();
        if (response.status === true) {
          this.sharedService.setStatusMessage('Створюємо чат');
          setTimeout(() => {
            this.router.navigate(['/chat-house']);
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
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Надсилаю оцінку власнику
  sendRating() {
    // console.log(this.ownerInfo)
    const userJson = localStorage.getItem('user');
    const formattedDate = this.datePipe.transform(this.rating.ratingDate, 'yyyy-MM-dd');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.ownerInfo.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue
      };
      // console.log(data)
      this.http.post(this.serverPath + '/rating/add/flatrating', data).subscribe((response: any) => {
        let setMark = this.rating.ratingValue.toString();
        // console.log(response)
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

        else if (response.status === 'Ви не підпадаєте під дати договору') {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Час оцінювання закритий');
            setTimeout(() => {
              // this.sharedService.setStatusMessage'Термін дії угоди вийшов';
              this.sharedService.setStatusMessage('Перевірте дати угоди');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            }, 2000);
          }, 200);
        }

        else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 200);
        }
        this.getRatingOwner(this.ownerInfo.user_id);
        setTimeout(() => {
          this.indexPage = 3;
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

  // отримую рейтинг власника оселі
  async getRatingOwner(user_id: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), user_id: user_id, };
    try {
      const response: any = await this.http.post(this.serverPath + '/rating/get/ownerMarks', data).toPromise() as any[];
      this.numberOfReviews = response.status.length;
      this.reviews = response.status;
      if (this.reviews && Array.isArray(this.reviews)) {
        let totalMarkOwner = 0;
        this.reviews.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkOwner += item.info.mark;
            this.ratingOwner = totalMarkOwner;
          }
        });
        if (this.numberOfReviews > 0) {
          this.ratingOwner = totalMarkOwner / this.numberOfReviews;
        } else {
          this.ratingOwner = 0;
        }
      } else {
        this.numberOfReviews = 0;
        this.ratingOwner = 0;
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

  // Отримую угоди для виведення інформації по ним для мешканців та власника
  async getConcludedAgree(owner_id: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: 0, };

    if (userJson && data) {
      try {
        const response: any = (await this.http.post(this.serverPath + '/agreement/get/saveyagreements', data).toPromise()) as any;
        if (response) {
          const agreeData = response.filter((item: { flat: { owner_id: any; }; }) =>
            item.flat.owner_id === owner_id
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
  }

  // Відправка скарги на орендара, через сервіс
  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000); }
    });
  }
}


