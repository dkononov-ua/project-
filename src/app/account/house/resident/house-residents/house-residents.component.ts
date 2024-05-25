import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../../services/chose-subscribers.service';
import { MatDialog } from '@angular/material/dialog';
import { AgreeDeleteComponent } from '../../agree-h/agree-delete/agree-delete.component';
import { Router } from '@angular/router';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
interface Subscriber {
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  photo: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}
@Component({
  selector: 'app-house-residents',
  templateUrl: './house-residents.component.html',
  styleUrls: ['./house-residents.component.scss'],
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
export class HouseResidentsComponent implements OnInit {
  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  isOnline = true;
  isOffline = false;

  subscribers: Subscriber[] = [];
  selectedSubscriber: Subscriber | null = null;
  selectedFlatId: any;
  selectedSubscriberId: string | null = null;

  setSelectedSubscriber(subscriber: Subscriber): void {
    this.selectedSubscriber = subscriber;
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        await this.getSelectedFlat();
      }
    })
  }

  async getSelectedFlat() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        const offs = 0;
        await this.getSubscribers(this.selectedFlatId, offs);
      }
    });

    if (this.subscribers.length > 0) {
      this.setSelectedSubscriber(this.subscribers[0]);
    }
  }

  onSubscriberSelect(subscriber: Subscriber): void {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedSubscriber = subscriber;
    this.selectedSubscriberId = subscriber.user_id;
    this.router.navigate(['/house/residents/resident']);
  }

  async getSubscribers(selectedFlatId: string, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = this.serverPath + '/citizen/get/citizen';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs
    };
    try {
      const response: any = await this.http.post(url, data).toPromise() as any[];
      // console.log(response)
      if (response && response.length !== 0) {
        const newSubscribers: Subscriber[] = response
          .filter((item: null) => item !== null)
          .map((item: any) => ({
            user_id: item.user_id,
            firstName: item.firstName,
            lastName: item.lastName,
            surName: item.surName,
            photo: item.img,
            instagram: item.instagram,
            telegram: item.telegram,
            viber: item.viber,
            facebook: item.facebook
          }));

        this.subscribers = newSubscribers;
      } else {
        this.subscribers = [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  removeSubscriber(subscriber: any): void {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.log('User not found');
      return;
    }

    const userObject = JSON.parse(userJson);
    const userId = userObject.user_id;
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
      if (result && userId != subscriber.user_id) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          user_id: subscriber.user_id
        };

        this.http.post(this.serverPath + '/citizen/delete/citizen', data).subscribe(
          () => {
            this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
          },
          (error: any) => {
            console.error('Error deleting subscriber:', error);
          }
        );
      } else if (result && userId == subscriber.user_id) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          user_id: subscriber.user_id
        };

        this.http.post(this.serverPath + '/citizen/delete/citizen', data).subscribe(
          () => { },
          (error: any) => {
            console.error('Error deleting user:', error);
          }
        );
        setTimeout(() => {
          localStorage.removeItem('house');
          localStorage.removeItem('selectedFlatId');
          location.reload;
          setTimeout(() => {
            this.selectedFlatIdService.clearSelectedFlatId();
            this.router.navigate(['/user/info']);
          }, 200);
        }, 200);
      }
    });
  }
}

