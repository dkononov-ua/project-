import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
import { UpdateComponentService } from 'src/app/services/update-component.service';
interface chosenFlat {
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
  loading: boolean | undefined;
  indexPage: number = 1;

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

  chosenFlat: chosenFlat | null = null;
  isCopied = false;
  choseFlatId: any | null;
  currentPhotoIndex: number = 0;
  statusMessageChat: any;
  public locationLink: string = '';
  subscriptions: any[] = [];

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSubscribedFlats();
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
        this.onFlatSelect(newSubscriptions[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onFlatSelect(flat: any) {
    this.choseSubscribeService.setChosenFlatId(flat.flat_id);
    this.choseFlatId = flat.flat_id;
    this.getFlatDetails(this.choseFlatId);
  }

  async getFlatDetails(flatId: string): Promise<void> {
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
      const chosenFlat = response.find((flat: any) => flat.flat.flat_id === flatId);
      if (chosenFlat) {
        this.chosenFlat = chosenFlat;
        this.generateLocationUrl();
      } else {
        console.log('Немає інформації')
      }
    });
  }

  async generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.chosenFlat?.flat.region || '';
    const city = this.chosenFlat?.flat.city || '';
    const street = this.chosenFlat?.flat.street || '';
    const houseNumber = this.chosenFlat?.flat.houseNumber || '';
    const flatIndex = this.chosenFlat?.flat.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;
    return this.locationLink;
  }

  prevPhoto() {
    this.currentPhotoIndex--;
  }

  nextPhoto() {
    this.currentPhotoIndex++;
  }

  copyFlatId() {
    const flatId = this.chosenFlat?.flat.flat_id;
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
    const tell = this.chosenFlat?.owner.tell;
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

  reloadPage() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  async deleteSubscriber(chosenFlat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/subs/delete/ysubs';
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: {
        flatId: chosenFlat.flat.flat_id,
        flatName: chosenFlat.flat.flat_name,
        flatCity: chosenFlat.flat.city,
        flatSub: 'subscriptions',
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && chosenFlat) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: chosenFlat.flat.flat_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscriptions = this.subscriptions.filter(item => item.flat_id !== chosenFlat.flat.flat_id);
          this.indexPage = 1;
          this.chosenFlat = null;
          this.updateComponent.triggerUpdateUser();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}

