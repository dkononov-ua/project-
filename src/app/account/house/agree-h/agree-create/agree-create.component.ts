import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
const moment = _rollupMoment || _moment;
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/shared/server-config';

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
interface Subscribers {
  user_id: any;
  firstName: string;
  lastName: string;
  surName: string;
  photo: string | undefined;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  tell: number;
  mail: string;
}
@Component({
  selector: 'app-agree-create',
  templateUrl: './agree-create.component.html',
  styleUrls: ['./agree-create.component.scss'],
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
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})
export class AgreeCreateComponent implements OnInit {
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  @ViewChild('agreeContainer') agreeContainer: ElementRef | undefined;
  message: string = '';
  phonePattern = '^[0-9]{10}$';

  houseData: any;
  userData: any;
  subscribers: Subscribers[] = [];
  selectedFlatId: string | any;
  selectedSubscriber: any;

  isCityDisabled: boolean = true;
  isStreetDisabled: boolean = true;
  isHouseNumberDisabled: boolean = true;
  isApartmentNumberDisabled: boolean = true;
  isApartmentSizeDisabled: boolean = true;
  isCheckboxChecked: boolean = false;
  isCheckboxPenalty: boolean = false;
  loading: boolean = true;
  isContainerVisible: boolean = false;
  additional_conditions: boolean = false;
  formSubmitted: boolean = false;
  agreementCreated: boolean = false;

  currentStep: number = 1;
  statusMessage: string | undefined;


  rentPrice: number = 0;

  // дата створення угоди
  agreementDate: any = moment();
  // термін початку - закінчення угоди
  dateAgreeStart: string = '';
  dateAgreeEnd: string = '';
  // число оплати квартплати
  rentDueDate: number | undefined;
  // документ на правовласності
  ownership: string = '';
  // в який термін передаємо оселю орендару
  transferHouse?: number | 0;
  // хто оплачує комуналку
  whoPayComun: number = 0;
  // заставна сума
  depositPayment?: number | 0;
  //  повідомленням про Дострокове розірвання даного Договору, а також зміна його умов, не менше ніж за днів
  dateAgreeBreakUp?: number | 0;
  // дозвіл на кількість відвідувань оселі власником на місяць
  numberVisits?: number | 0;
  // особи які будуть проживати
  personsReside: string = '';
  // після закінчення/розірвання угоди звільнити оселю через кількість днів
  vacateHouse?: number | 0;
  // штрафні санкції не використовую залишу на потім
  penalty?: number = 0;
  maxPenalty?: number = 0;
  // додаткові умови від власника
  conditions: string = '';
  // тип угоди місяць/день треба для угоди подобово поки не використовуємо
  agreement_type: number = 0;

  changeStep(step: number): void {
    this.currentStep = step;
  }

  openContainer() {
    this.isContainerVisible = true;
  }

  closeContainer() {
    this.isContainerVisible = false;
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month)),
      end: new FormControl(new Date(year, month))
    });



    const currentDate = new Date();
    this.rentDueDate = currentDate.getDate();

    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        try {
          await this.getAgent();
          await this.getHouse();
          await this.getSubs();
          this.route.params.subscribe(params => {
            this.selectedSubscriber = params['selectedSubscriber?.user_id'] || null;
            this.foundSubscriber(this.selectedSubscriber);
          });
          this.loading = false;
        } catch (error) {
          console.error(error);
          this.loading = false;
        }
      }
    });
  }

  updateRentPrice(newValue: number) {
    if (!newValue) {
      if (this.houseData.about.option_pay === 0) {
        this.rentPrice = this.houseData.about.price_m || 0;
      } else if (this.houseData.about.option_pay === 1) {
        this.rentPrice = this.houseData.about.price_d || 0;
      } else {
        this.rentPrice = 0;
      }
    }
  }

  async getHouse(): Promise<void> {
    try {
      const response: any = await this.dataService.getInfoFlat().toPromise();
      this.houseData = response;
      this.rentPrice = 0;
      if (this.houseData.about.option_pay === 0) {
        this.rentPrice = this.rentPrice || this.houseData.about.price_m;
      } else if (this.houseData.about.option_pay === 1) {
        this.rentPrice = this.houseData.about.price_d || 0;
      } else {
        this.rentPrice = this.rentPrice;
      }

      if (this.houseData.imgs === 'Картинок нема') {
        this.houseData.imgs = [serverPath + '/img/flat/housing_default.svg'];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAgent(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/userinfo/agent';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.userData = response;
    } catch (error) {
      console.error(error);
    }
  }

  async getSubs(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: 0,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.subscribers = response;
    } catch (error) {
      console.error(error);
    }
  }

  foundSubscriber(selectedSubscriber: string): void {
    if (selectedSubscriber) {
      // Перетворюємо selectedSubscriber в числове значення
      const selectedSubscriberId = parseInt(selectedSubscriber, 10);
      const foundSubscriber = this.subscribers.find((subscriber) => subscriber.user_id === selectedSubscriberId);

      if (foundSubscriber) {
        this.selectedSubscriber = foundSubscriber;
      }
    } else { }
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onDateChange(selectedDate: Moment): void {
    this.agreementDate = selectedDate;
  }

  sendFormAgreement(subscriber: Subscribers): void {
    this.formSubmitted = true;
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const formattedAgreementDate = this.datePipe.transform(this.agreementDate, 'yyyy-MM-dd');
      const formattedAgreementDateStart = this.datePipe.transform(this.campaignOne.get('start')?.value, 'yyyy-MM-dd');
      const formattedAgreementDateEnd = this.datePipe.transform(this.campaignOne.get('end')?.value, 'yyyy-MM-dd');
      if (!this.selectedSubscriber) {
        this.showMessage('Будь ласка, оберіть орендара');
        return;
      }
      if (!this.selectedFlatId) {
        this.showMessage('Будь ласка, оберіть оселю');
        return;
      }
      if (this.selectedSubscriber && this.selectedFlatId) {

        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          owner: {
            user_id: this.userData?.cont?.user_id,
            firstName: this.userData?.inf?.firstName,
            lastName: this.userData?.inf?.lastName,
            surName: this.userData?.inf?.surName,
            tell: this.userData?.cont?.tell,
            mail: this.userData?.cont?.mail,
            owner_img: this.userData?.img[0].img,
          },

          subscriber: {
            user_id: this.selectedSubscriber?.user_id,
            firstName: this.selectedSubscriber?.firstName,
            lastName: this.selectedSubscriber?.lastName,
            surName: this.selectedSubscriber?.surName,
            tell: this.selectedSubscriber?.tell,
            mail: this.selectedSubscriber?.mail,
            subscriber_img: this.selectedSubscriber?.img,
          },

          house: {
            flat_id: this.houseData?.about.flat_id,
            city: this.houseData?.flat.city,
            houseNumber: this.houseData?.flat.houseNumber,
            apartment: this.houseData?.flat.apartment,
            area: this.houseData?.param.area,
            price: this.rentPrice,
            street: this.houseData?.flat.street,
            floor: this.houseData?.param.floor,
            ownership: this.ownership,
            room: this.houseData?.about.room,
            option_pay: this.houseData?.about.option_pay,
            option_flat: this.houseData?.param.option_flat,
          },

          terms: {
            agreementDate: formattedAgreementDate,
            rent_due_data: this.rentDueDate,
            penalty: this.penalty,
            max_penalty: this.maxPenalty,
            agree: this.isCheckboxChecked,
            about: this.conditions,
            agreement_type: this.agreement_type,

            dateAgreeStart: formattedAgreementDateStart,
            dateAgreeEnd: formattedAgreementDateEnd,
            transferHouse: this.transferHouse || 0,
            whoPayComun: this.whoPayComun || 0,
            depositPayment: this.depositPayment || 0,
            dateAgreeBreakUp: this.dateAgreeBreakUp || 0,
            numberVisits: this.numberVisits || 0,
            personsReside: this.personsReside,
            vacateHouse: this.vacateHouse || 0,
          }
        };

        console.log(data)
        this.http.post(serverPath + '/agreement/add/agreement', data)
          .subscribe(
            (response: any) => {
              this.loading = true;
              if (response.status === 'Данні введено не правильно') {
                console.error(response.status);
                setTimeout(() => {
                  this.statusMessage = 'Помилка формування угоди.';
                  setTimeout(() => {
                    location.reload();
                  }, 3000);
                }, 1000);
              } else {
                setTimeout(() => {
                  this.statusMessage = 'Умови угоди надіслані на розгляд орендарю!';
                  setTimeout(() => {
                    this.router.navigate(['/house/agree-review']);
                  }, 3000);
                }, 1000);
              }
            },
            (error: any) => {
              console.error(error);
              setTimeout(() => {
                this.statusMessage = 'Помилка формування угоди.';
                setTimeout(() => {
                  location.reload();
                }, 3000);
              }, 1000);
            }
          );
        this.loading = false;
      } else {
        console.log('User, flat, or subscriber not found');
        this.loading = false;
      }
    }
  }

  showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => {
      this.clearMessage();
    }, 2000);
  }

  clearMessage(): void {
    this.message = '';
  }
}

