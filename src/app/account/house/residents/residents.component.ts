import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
interface Subscriber {
  acces_flat_chats: any;
  acces_flat_features: any;
  acces_agent: any;
  acces_comunal_indexes: any;
  acces_citizen: any;
  acces_agreement: any;
  acces_discuss: any;
  acces_subs: any;
  acces_filling: any;
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  photo: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  acces_services: any;
  acces_admin: any;
  acces_comunal: any;
  acces_added: any;
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
  acces_filling: any;
  acces_subs: any;
  acces_discuss: any;
  acces_agreement: any;
  acces_citizen: any;
  acces_comunal_indexes: any;
  acces_agent: any;
  acces_flat_features: any;
  acces_flat_chats: any;

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
          this.acces_filling = selectedSubscriber.acces_filling;
          this.acces_subs = selectedSubscriber.acces_subs;
          this.acces_discuss = selectedSubscriber.acces_discuss;
          this.acces_agreement = selectedSubscriber.acces_agreement;
          this.acces_citizen = selectedSubscriber.acces_citizen;
          this.acces_comunal_indexes = selectedSubscriber.acces_comunal_indexes;
          this.acces_agent = selectedSubscriber.acces_agent;
          this.acces_flat_features = selectedSubscriber.acces_flat_features;
          this.acces_flat_chats = selectedSubscriber.acces_flat_chats;
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
          acces_filling: user_id.acces_filling,
          acces_subs: user_id.acces_subs,
          acces_discuss: user_id.acces_discuss,
          acces_agreement: user_id.acces_agreement,
          acces_citizen: user_id.acces_citizen,
          acces_comunal_indexes: user_id.acces_comunal_indexes,
          acces_agent: user_id.acces_agent,
          acces_flat_features: user_id.acces_flat_features,
          acces_flat_chats: user_id.acces_flat_chats,
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
    acces_comunal: boolean,
    acces_filling: boolean,
    acces_subs: boolean,
    acces_discuss: boolean,
    acces_agreement: boolean,
    acces_citizen: boolean,
    acces_comunal_indexes: boolean,
    acces_agent: boolean,
    acces_flat_features: boolean,
    acces_flat_chats: boolean,
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
        acces_filling: acces_filling,
        acces_comunal: acces_comunal,
        acces_subs: acces_subs,
        acces_discuss: acces_discuss,
        acces_agreement: acces_agreement,
        acces_citizen: acces_citizen,
        acces_comunal_indexes: acces_comunal_indexes,
        acces_agent: acces_agent,
        acces_flat_features: acces_flat_features,
        acces_flat_chats: acces_flat_chats,
      };
      console.log(data)

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
