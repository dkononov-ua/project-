import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import * as ServerConfig from 'src/app/config/path-config';
import { HouseInfo } from '../../../../interface/info';
import { HouseConfig } from '../../../../interface/param-config';
import { Options, Distance, Animals, CheckBox } from '../../../../interface/name';
import { CounterService } from 'src/app/services/counter.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { animations } from '../../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss'],
  animations: [
    animations.top2,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class MainInfoComponent implements OnInit {

  statusInfoHouse: any;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  isOpen = true;
  isCopied = false;
  indexCard: number = 2;
  loading: boolean = false;
  indexPage: number = 0;
  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  counterHouseNewMessage: any;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;
  authorization: boolean = false;
  houseData: any;

  HouseInfo: HouseInfo = HouseConfig;
  options: { [key: number]: string } = Options;

  currentPhotoIndex: number = 0;
  showCardParam: number = 0;
  isLoadingImg: boolean = false;


  isCopiedMessage!: string;
  public locationLink: string = '';
  statusMessage: any;
  selectedFlatId!: string | null;
  startX = 0;
  selectedSubAgree: any;
  timeToOpenRating: number = 0;
  numConcludedAgree: any;
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private counterService: CounterService,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private router: Router,
    private statusDataService: StatusDataService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        this.getSelectParam();
        this.cardParam();
        await this.getHouseAcces();
        await this.getConcludedAgree();
      }
    })
  }

  goToEdit() {
    if (this.isMobile) {
      this.router.navigate(['/edit-house/instruction']);
    } else {
      this.router.navigate(['/edit-house/address']);
    }
  }

  goToComun() {
    if (this.isMobile) {
      this.router.navigate(['/communal/about']);
    } else {
      this.router.navigate(['/communal/about']);
    }
  }

  // відправляю event початок свайпу
  onPanStartImg(event: any): void {
    this.startX = 0;
  }

  onPanEndImg(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwipedImg('right');
      } else {
        this.onSwipedImg('left');
      }
    }
  }

  // оброблюю свайп фото
  onSwipedImg(direction: string | undefined): void {
    if (direction === 'right') {
      this.prevPhoto();
    } else {
      this.nextPhoto();
    }
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      if (this.selectedFlatId) {
        await this.loadDataFlat();
      }
    });
  }

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    this.counterService.counterHouseSubscribers$.subscribe(data => {
      const counterHouseSubscribers: any = data;
      this.counterHouseSubscribers = counterHouseSubscribers.status;
      // console.log('кількість підписників', this.counterHouseSubscribers)
    });
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    this.counterService.counterHouseSubscriptions$.subscribe(data => {
      const counterHouseSubscriptions: any = data;
      this.counterHouseSubscriptions = counterHouseSubscriptions.status;
      // console.log('кількість підписок', this.counterHouseSubscriptions)
    });
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    this.counterService.counterHouseDiscussio$.subscribe(data => {
      const counterHouseDiscussio: any = data;
      if (counterHouseDiscussio.status === 'Немає доступу') {
        this.counterHouseDiscussio = null;
      } else {
        this.counterHouseDiscussio = counterHouseDiscussio.status;
      }
      // console.log('кількість дискусій', this.counterHouseDiscussio)
    });
  }

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getHouseNewMessage(this.selectedFlatId);
    this.counterService.counterHouseNewMessage$.subscribe(data => {
      const counterHouseNewMessage: any = data;
      this.counterHouseNewMessage = counterHouseNewMessage.status;
      // console.log('кількість повідомлень оселі', this.counterHouseNewMessage)
    });
  }

  cardParam() {
    if (this.HouseInfo.rent === 1) {
      this.showCardParam = 1;
    } else {
      this.showCardParam = 2;
    }
  }

  async loadSearchDataFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.houseData) {
      // console.log(this.houseData)
      this.statusInfoHouse = {
        private: this.houseData.about.private,
        rent: this.houseData.about.rent,
        room: this.houseData.about.room,
        students: this.houseData.about.students,
        woman: this.houseData.about.woman,
        man: this.houseData.about.man,
        family: this.houseData.about.family,
        date: this.houseData.about.data,
        checked: this.houseData.flatStat[0].checked,
        realll: this.houseData.flatStat[0].realll,
        option_flat: this.houseData.param.option_flat,
      };

      this.statusDataService.setStatusDataFlat(this.statusInfoHouse);
    }
  }


  async loadDataFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.houseData = parsedHouseData;
        this.HouseInfo.region = parsedHouseData.flat.region;
        this.HouseInfo.flat_id = parsedHouseData.flat.flat_id;
        this.HouseInfo.country = parsedHouseData.flat.country;
        this.HouseInfo.city = parsedHouseData.flat.city;
        this.HouseInfo.street = parsedHouseData.flat.street;
        this.HouseInfo.houseNumber = parsedHouseData.flat.houseNumber;
        this.HouseInfo.apartment = parsedHouseData.flat.apartment;
        this.HouseInfo.flat_index = parsedHouseData.flat.flat_index;
        this.HouseInfo.private = parsedHouseData.flat.private;
        this.HouseInfo.rent = parsedHouseData.about.rent;
        this.HouseInfo.rooms = parsedHouseData.param.rooms;
        this.HouseInfo.repair_status = parsedHouseData.param.repair_status;
        this.HouseInfo.area = parsedHouseData.param.area;
        this.HouseInfo.kitchen_area = parsedHouseData.param.kitchen_area;
        this.HouseInfo.balcony = parsedHouseData.param.balcony;
        this.HouseInfo.floor = parsedHouseData.param.floor;
        this.HouseInfo.distance_metro = parsedHouseData.about.distance_metro;
        this.HouseInfo.distance_stop = parsedHouseData.about.distance_stop;
        this.HouseInfo.distance_shop = parsedHouseData.about.distance_shop;
        this.HouseInfo.distance_green = parsedHouseData.about.distance_green;
        this.HouseInfo.distance_parking = parsedHouseData.about.distance_parking;
        this.HouseInfo.woman = parsedHouseData.about.woman;
        this.HouseInfo.man = parsedHouseData.about.man;
        this.HouseInfo.family = parsedHouseData.about.family;
        this.HouseInfo.students = parsedHouseData.about.students;
        this.HouseInfo.option_pay = parsedHouseData.about.option_pay;
        this.HouseInfo.animals = parsedHouseData.about.animals;
        this.HouseInfo.price_m = parsedHouseData.about.price_m;
        this.HouseInfo.price_d = parsedHouseData.about.price_d;
        this.HouseInfo.about = parsedHouseData.about.about;
        this.HouseInfo.bunker = parsedHouseData.about.bunker;
        if (Array.isArray(parsedHouseData.imgs) && parsedHouseData.imgs.length > 0) {
          this.HouseInfo.photos = parsedHouseData.imgs;
        } else {
          this.HouseInfo.photos[0] = "housing_default.svg";
        }
        this.generateLocationUrl();
        this.loadSearchDataFlat();
      } else {
        // console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }
  // Генерую локацію оселі
  generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.HouseInfo.region || '';
    const city = this.HouseInfo.city || '';
    const street = this.HouseInfo.street || '';
    const houseNumber = this.HouseInfo.houseNumber || '';
    const flatIndex = this.HouseInfo.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;
    return this.locationLink;
  }

  // Відкриваю локацію на мапі
  openMap() {
    this.sharedService.setStatusMessage('Відкриваємо локацію на мапі');
    setTimeout(() => { this.sharedService.setStatusMessage(''); window.open(this.locationLink, '_blank'); }, 2000);
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

  copyFlatId() {
    this.copyToClipboard(this.HouseInfo.flat_id, 'ID оселі скопійовано');
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    this.houseData = localStorage.getItem('houseData');
    if (this.houseData) {
      const parsedHouseData = JSON.parse(this.houseData);
      this.houseData = parsedHouseData;
      // console.log(this.houseData)
      if (this.houseData.acces) {
        this.acces_added = this.houseData.acces.acces_added;
        this.acces_admin = this.houseData.acces.acces_admin;
        this.acces_agent = this.houseData.acces.acces_agent;
        this.acces_agreement = this.houseData.acces.acces_agreement;
        this.acces_citizen = this.houseData.acces.acces_citizen;
        this.acces_comunal = this.houseData.acces.acces_comunal;
        this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
        this.acces_discuss = this.houseData.acces.acces_discuss;
        this.acces_filling = this.houseData.acces.acces_filling;
        this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
        this.acces_flat_features = this.houseData.acces.acces_flat_features;
        this.acces_services = this.houseData.acces.acces_services;
        this.acces_subs = this.houseData.acces.acces_subs;
        if (this.acces_discuss === 1) {
          await this.getHouseDiscussioCount();
        }
        if (this.acces_subs === 1) {
          await this.getHouseSubscribersCount();
          await this.getHouseSubscriptionsCount();
        } if (this.acces_flat_chats === 1) {
          await this.getHouseNewMessage();
        }
      } else {
        await this.getHouseDiscussioCount();
        await this.getHouseSubscribersCount();
        await this.getHouseSubscriptionsCount();
        await this.getHouseNewMessage();
      }
    }
  }

  // Перемикання Фото в каруселі
  prevPhoto() {
    const length = this.HouseInfo.photos.length || 0;
    if (this.currentPhotoIndex !== 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    const length = this.HouseInfo.photos.length || 0;
    if (this.currentPhotoIndex < length - 1) {
      this.currentPhotoIndex++;
    }
  }

  // Отримую угоди для виведення інформації по ним для мешканців та власника
  async getConcludedAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    if (userData && userJson) {
      const userObject = JSON.parse(userData);
      const user_id = userObject.inf.user_id;
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: 0, };
      try {
        const response: any = (await this.http.post(this.serverPath + '/agreement/get/saveagreements', data).toPromise()) as any;
        // console.log(response)
        if (response && response[0].status !== 'Немає доступу') {
          const agreeData = response.filter((item: { flat: { subscriber_id: any; }; }) =>
            item.flat.subscriber_id === user_id);
          if (agreeData && agreeData.length !== 0) {
            this.selectedSubAgree = agreeData[0].flat;
            // підраховую яка кількість днів залишилась до відкриття відгука
            const { dateAgreeStart } = agreeData[0].flat;
            const daysToAdd = 14;
            const endDate: Date = new Date(dateAgreeStart);
            endDate.setDate(endDate.getDate() + daysToAdd);
            const today: Date = new Date();
            const differenceInTime: number = endDate.getTime() - today.getTime();
            const differenceInDays: number = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            this.timeToOpenRating = differenceInDays;
          } else {
            this.selectedSubAgree = [];
          }
        } else {
          this.numConcludedAgree = 0;
          // this.sharedService.setStatusMessage('У вас немає доступу до оселі ID ' + this.selectedFlatId + 'Можливо її було забанено');
          // setTimeout(() => {
          //   this.sharedService.logoutHouse();
          // }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('У вас немає доступу до оселі ID ' + this.selectedFlatId + 'Можливо її було забанено');
        setTimeout(() => {
          this.sharedService.logoutHouse();
        }, 2000);
      }
    }
  }
}


