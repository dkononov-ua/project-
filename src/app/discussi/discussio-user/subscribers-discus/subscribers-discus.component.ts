import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { Subject, Subscription, interval, switchMap, takeUntil } from 'rxjs';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';

interface SelectedFlat {
  flat: any;
  owner: any;
  img: any;
}

interface ApprovedSubscription {
  flat_id: string;
  flatImg: any;
  price_m: number;
}

@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
  ],
})

export class SubscribersDiscusComponent implements OnInit {
  currentIndex: number = 0;
  firstName: string | undefined;
  lastName: string | undefined;
  surName: string | undefined;
  viber: string | null | undefined;
  facebook: string | undefined;
  instagram: string | undefined;
  telegram: string | undefined;
  flat_id: any;
  country: any;
  region: any;
  city: any;
  street: any;
  houseNumber: any;
  apartment: any;
  flat_index: any;
  subscribers: any;
  distance_metro!: number;
  distance_stop!: number;
  distance_shop!: number;
  distance_green!: number;
  distance_parking!: number;
  tell!: number;
  mail!: number;
  woman!: number;
  man!: number;
  family!: number;
  students!: number;
  animals!: string;
  price_m!: number;
  price_y!: string;
  bunker!: string;
  rooms!: string;
  area!: string;
  kitchen_area!: string;
  repair_status!: string;
  floor!: number;
  balcony!: string;
  about: any;
  house: any;
  isFeatureEnabled: boolean = false;
  loading: boolean | undefined;
  userData: any;
  currentSubscription: Subject<unknown> | undefined;

  indexPage: number = 1;

  toggleMode(): void {
    this.currentIndex = (this.currentIndex === 0) ? 2 : 0;

    this.isFeatureEnabled = !this.isFeatureEnabled;
    if (this.isFeatureEnabled) {
      console.log('Представник');
    } else {
      console.log('Оселя');
    }
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    5: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  checkBox: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Так',
    2: 'Ні',
  }

  selectedFlat: SelectedFlat | null = null;
  isOpen = true;
  isOnline = true;
  isOffline = false;
  idleTimeout: any;
  isCopied = false;
  ownerImg: string | undefined;
  public selectedFlatId: any | null;
  selectedSubscription: any | null = null;
  user_id: string | undefined;
  flatImg: any = [{ img: "housing_default.svg" }];
  private selectedFlatIdSubscription: Subscription | undefined;
  images: string[] = ['http://localhost:3000/img/flat/housing_default.svg'];
  userImg: any;
  currentPhotoIndex: number = 0;

  deletingFlatId: any;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  subscriptions: ApprovedSubscription[] = [];


  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSubscribedFlats();
    this.subscribeToSelectedFlatIdChanges();
    this.restoreSelectedFlatId();
    await this.loadData();
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$.subscribe(
      flatId => {
        this.selectedFlatId = flatId;
        this.reloadComponent();
      }
    );

    this.selectedFlatId = this.choseSubscribeService.chosenFlatId;
    if (this.selectedFlatId !== null) {
      localStorage.setItem('selectedFlatId', this.selectedFlatId);
      this.getFlatDetails(this.selectedFlatId);

    } else {
      const storedFlatId = localStorage.getItem('selectedFlatId');
      if (storedFlatId) {
        this.selectedFlatId = storedFlatId;
        this.getFlatDetails(this.selectedFlatId);

      }
    }
    this.getOwnerInfo();
  }

  async loadData(): Promise<void> {
    this.dataService.getData().subscribe((response: any) => {
      this.userData = response.userData;
      this.loading = false;

    }, (error) => {
      console.error(error);
      this.loading = false;
    });
  }

  prevPhoto() {
    this.currentPhotoIndex--;
  }

  nextPhoto() {
    this.currentPhotoIndex++;
  }

  getOwnerInfo(): void {
    if (this.selectedFlat && this.selectedFlat.owner && this.selectedFlat.owner.img) {
      this.ownerImg = this.selectedFlat.owner.img;
      this.user_id = this.selectedFlat.owner.user_id;
      this.firstName = this.selectedFlat.owner.firstName;
      this.lastName = this.selectedFlat.owner.lastName;
      this.surName = this.selectedFlat.owner.surName;
      this.viber = this.selectedFlat.owner.viber;
      this.facebook = this.selectedFlat.owner.facebook;
      this.instagram = this.selectedFlat.owner.instagram;
      this.telegram = this.selectedFlat.owner.telegram;
      this.about = this.selectedFlat.flat.about;
      this.animals = this.selectedFlat.flat.animals;
      this.apartment = this.selectedFlat.flat.apartment;
      this.area = this.selectedFlat.flat.area;
      this.balcony = this.selectedFlat.flat.balcony;
      this.bunker = this.selectedFlat.flat.bunker;
      this.city = this.selectedFlat.flat.city;
      this.country = this.selectedFlat.flat.country;
      this.distance_metro = Number(this.selectedFlat.flat.distance_metro);
      this.distance_stop = Number(this.selectedFlat.flat.distance_stop);
      this.distance_shop = Number(this.selectedFlat.flat.distance_shop);
      this.distance_green = Number(this.selectedFlat.flat.distance_green);
      this.distance_parking = Number(this.selectedFlat.flat.distance_parking);
      this.family = Number(this.selectedFlat.flat.family);
      this.flat_id = this.selectedFlat.flat.flat_id;
      this.flat_index = this.selectedFlat.flat.flat_index;
      this.floor = Number(this.selectedFlat.flat.floor);
      this.houseNumber = this.selectedFlat.flat.houseNumber;
      this.kitchen_area = this.selectedFlat.flat.kitchen_area;
      this.man = Number(this.selectedFlat.flat.man);
      this.price_m = Number(this.selectedFlat.flat.price_m);
      this.price_y = this.selectedFlat.flat.price_y;
      this.region = this.selectedFlat.flat.region;
      this.repair_status = this.selectedFlat.flat.repair_status;
      this.rooms = this.selectedFlat.flat.rooms;
      this.street = this.selectedFlat.flat.street;
      this.students = Number(this.selectedFlat.flat.students);
      this.woman = Number(this.selectedFlat.flat.woman);
      this.tell = this.selectedFlat.owner.tell;
      this.mail = this.selectedFlat.owner.mail;
    };
  }

  getFlatDetails(flatId: string): void {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;

    const url = 'http://localhost:3000/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flatId: flatId,
      offs: 0,
    };

    this.http.post(url, data).subscribe((response: any) => {
      const selectedFlat = response.find((flat: any) => flat.flat.flat_id === flatId);

      if (selectedFlat) {
        console.log(selectedFlat)
        this.selectedFlat = selectedFlat;
        this.getOwnerInfo();
      }
    });
  }

  getSelectedFlatInfo(): string {
    if (this.selectedSubscription && this.selectedSubscription.flat) {
      return `Оселя: ${this.selectedSubscription.flat.flat_id}, Країна: ${this.selectedSubscription.flat.country}, Місто: ${this.selectedSubscription.flat.city}`;
    } else {
      return 'Інформація про обрану оселю відсутня.';
    }
  }

  copyFlatId() {
    const flatId = this.selectedFlat?.flat.flat_id;

    if (flatId) {
      navigator.clipboard.writeText(flatId)
        .then(() => {
          console.log('ID оселі скопійовано!');
          this.isCopied = true;

          setTimeout(() => {
            this.isCopied = false;
          }, 2000);
        })
        .catch((error) => {
          console.log('Помилка при копіюванні ID оселі.');
          this.isCopied = false;
        });
    }
  }

  ngOnDestroy(): void {
    if (this.selectedFlatIdSubscription) {
      this.selectedFlatIdSubscription.unsubscribe();
    }
  }

  reloadComponent(): void {
    this.selectedFlatId = this.choseSubscribeService.chosenFlatId;
    localStorage.setItem('selectedFlatId', this.selectedFlatId);
    if (this.selectedFlatId !== null) {
      this.getFlatDetails(this.selectedFlatId);
    }
  }

  createChat(SelectedFlat: any): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && SelectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
      };
      this.http.post('http://localhost:3000/chat/add/chatUser', data)
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  async getSubscribedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscriptions: ApprovedSubscription[] = response.map((flat: any) => {
        if(flat.flat_id){
          return {
            flat_id: flat.flat.flat_id,
            flatImg: flat.img,
            price_m: flat.flat.price_m,
          };
        }else{
          return {
            flat_id: flat.flat.flat_id,
            flatImg: flat.img,
            price_m: flat.flat.price_m,
          }
        }
      });

      this.subscriptions = newSubscriptions;
      if (newSubscriptions.length > 0) {
        this.selectFlatId(newSubscriptions[0].flat_id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  selectFlatId(flatId: string) {
    this.choseSubscribeService.chosenFlatId = flatId;
    this.selectedFlatId = flatId;
  }

  private restoreSelectedFlatId() {
    const selectedFlatId = this.choseSubscribeService.chosenFlatId;
    if (selectedFlatId) {
      this.selectFlatId(selectedFlatId);
    }
  }

  private subscribeToSelectedFlatIdChanges() {
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$.subscribe(
      flatId => {
        this.selectedFlatId = flatId;
      }
    );
  }

  removeSubscriber(flatId: string): void {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/acceptsubs/delete/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: flatId,
    };

    this.http.post(url, data).subscribe(
      () => {
        this.loading = false;
        this.deletingFlatId = flatId;
        setTimeout(() => {
          this.subscriptions = this.subscriptions.filter(subscriber => subscriber.flat_id !== flatId);
          this.deletingFlatId = null;
        }, 100);
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  async openDialog(flatId: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/acceptsubs/delete/ysubs';

    const dialogRef = this.dialog.open(DeleteSubsComponent);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: flatId,
          user_id: user_id,
        };
        console.log(data)
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscriptions = this.subscriptions.filter(item => item.flat_id !== flatId);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}

