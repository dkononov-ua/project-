import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { Subject, Subscription } from 'rxjs';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
import { UpdateComponentService } from 'src/app/services/update-component.service';


interface SelectedFlat {
  flat: any;
  owner: any;
  img: any;
}

@Component({
  selector: 'app-subscriptions-user',
  templateUrl: './subscriptions-user.component.html',
  styleUrls: ['./subscriptions-user.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ]),
  ],

})

export class SubscriptionsUserComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

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
  indexPage: number = 0;

  mobile: boolean = true;

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    1: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  purpose: { [key: number]: string } = {
    0: 'Переїзд',
    1: 'Відряджання',
    2: 'Подорож',
    3: 'Пожити в іншому місті',
    4: 'Навчання',
    5: 'Особисті причини',
  }

  animalsKey: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Без тварин',
    2: 'За попередньою домовленістю',
    3: 'Можна з тваринами',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
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
  images: string[] = [serverPath + '/img/flat/housing_default.svg'];
  userImg: any;
  currentPhotoIndex: number = 0;
  deletingFlatId: any;

  chatExists = false;
  statusMessageChat: any;

  public locationLink: string = '';
  selectedView!: any;
  selectedViewName!: string;
  isChatOpenStatus: boolean = true;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  subscriptions: any[] = [];

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private updateComponent: UpdateComponentService,
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

  getFlatDetails(flatId: string): void {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;

    const url = serverPath + '/subs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flatId: flatId,
      offs: 0,
    };

    this.http.post(url, data).subscribe((response: any) => {
      const selectedFlat = response.find((flat: any) => flat.flat.flat_id === flatId);
      if (selectedFlat) {
        this.selectedFlat = selectedFlat;
        this.generateLocationUrl();
      }
    });
  }

  copyFlatId() {
    const flatId = this.selectedFlat?.flat.flat_id;

    if (flatId) {
      navigator.clipboard.writeText(flatId)
        .then(() => {
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 2000);
        })
        .catch((error) => {
          this.isCopied = false;
        });
    }
  }

  copyTell() {
    const tell = this.selectedFlat?.owner.tell;

    if (tell) {
      navigator.clipboard.writeText(tell)
        .then(() => {
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 2000);
        })
        .catch((error) => {
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

  async getSubscribedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/subs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscriptions: any[] = response.map((flat: any) => {
        if (flat.flat_id) {
          return {
            flat_id: flat.flat.flat_id,
            flatImg: flat.img,
            price_m: flat.flat.price_m,
            region: flat.flat.region,
            city: flat.flat.city,
          };
        } else {
          return {
            flat_id: flat.flat.flat_id,
            flatImg: flat.img,
            price_m: flat.flat.price_m,
            region: flat.flat.region,
            city: flat.flat.city,
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

  async openDialog(flat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).user_id;
    const url = serverPath + '/subs/delete/ysubs';
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: {
        flatId: flat.flat_id,
        flatName: flat.flat_name,
        flatCity: flat.city,
        flatSub: 'subscriptions',
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: flat.flat_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscriptions = this.subscriptions.filter(item => item.flat_id !== flat.flat_id);
          this.indexPage = 1;
          this.selectedFlat = null;
          this.updateComponent.triggerUpdateUser();
        } catch (error) {
          console.error(error);
        }

      }
    });
  }

  generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.selectedFlat?.flat.region || '';
    const city = this.selectedFlat?.flat.city || '';
    const street = this.selectedFlat?.flat.street || '';
    const houseNumber = this.selectedFlat?.flat.houseNumber || '';
    const flatIndex = this.selectedFlat?.flat.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;
    return this.locationLink;
  }
}

