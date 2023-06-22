import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
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
  acces_services: '';
  acces_admin: '';
  acces_comunal: '';
  acces_added: '';
}
@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss']
})
export class ResidentsComponent implements OnInit {
  selectedSubscriber: Subscriber | undefined;

  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  isOnline = true;
  isOffline = false;
  loading = false;
  isChatClosed: boolean = true;
  isAccessClosed: boolean = true;
  acces_added: any;
  acces_admin: any;
  acces_services: any;
  acces_comunal: any;

  toggleChat() {
    this.isChatClosed = !this.isChatClosed;
  }

  toggleAccess() {
    this.isAccessClosed = !this.isAccessClosed;
  }

  public showInput = false;
  public userId: string | undefined;
  searchQuery: string | undefined;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        this.getSubs(selectedFlatId, offs);
      }
    });

    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
          this.acces_added = selectedSubscriber.acces_added;
          this.acces_admin = selectedSubscriber.acces_admin;
          this.acces_services = selectedSubscriber.acces_services;
          this.acces_comunal = selectedSubscriber.acces_comunal;
        }
      }
    });
  }

  onSelectionChange(): void {
    this.selectedFlatIdService.setSelectedFlatId(this.selectedFlatId);
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/citizen/get/citizen';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscribers: Subscriber[] = response
        .filter(user_id => user_id !== null)
        .map((user_id: any) => ({
          user_id: user_id.user_id,
          firstName: user_id.firstName,
          lastName: user_id.lastName,
          surName: user_id.surName,
          photo: user_id.img,
          instagram: user_id.instagram,
          telegram: user_id.telegram,
          viber: user_id.viber,
          facebook: user_id.facebook,
          acces_services: user_id.acces_services,
          acces_admin: user_id.acces_admin,
          acces_comunal: user_id.acces_comunal,
          acces_added: user_id.acces_added,
        }));

      this.subscribers = newSubscribers;

    } catch (error) {
      console.error(error);
    }

    this.selectedFlatId = selectedFlatId;
  }

  addAccess(
    subscriber: Subscriber,
    acces_added: boolean,
    acces_admin: boolean,
    acces_services: boolean,
    acces_comunal: boolean
  ): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');

    if (userJson && subscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: subscriber.user_id,
        acces_added: acces_added,
        acces_admin: acces_admin,
        acces_services: acces_services,
        acces_comunal: acces_comunal,
      };
      this.http.post('http://localhost:3000/citizen/add/access', data).subscribe(
        (response: any) => {
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      console.log('User or subscriber not found');
    }
  }

  removeSubscriber(subscriber: Subscriber): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {
      const data = { auth: JSON.parse(userJson), flat_id: selectedFlat, user_id: subscriber.user_id };
      this.http.post('http://localhost:3000/citizen/delete/citizen', data)
        .subscribe(
          (response: any) => {
            this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user or subscriber not found');
    }
  }
}
