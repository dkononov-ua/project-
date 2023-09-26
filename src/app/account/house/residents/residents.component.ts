import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { NgZone } from '@angular/core';
import { serverPath } from 'src/app/shared/server-config';

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
  tell: number;
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
  styleUrls: ['./residents.component.scss'],
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
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateY(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation5', [
      transition('void => *', [
        style({ transform: 'translateY(100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ])
  ],
})
export class ResidentsComponent implements OnInit {
  serverPath = serverPath;

  selectedSubscriber: Subscriber | undefined;
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  loading = false;

  isChatClosed: boolean = true;
  isAccessClosed: boolean = true;
  descriptionVisibility: { [key: string]: boolean } = {};

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

  isMenuOpen = true;
  hideMenu = false;

  onToggleMenu() {
    if (this.isMenuOpen) {
      this.openMenu();
      setTimeout(() => {
        this.hideMenu = !this.hideMenu;
      }, 500);
    } else {
      this.hideMenu = !this.hideMenu;
      setTimeout(() => {
        this.openMenu();
      }, 100);
    }
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }

  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        this.getSubs(selectedFlatId, offs).then(() => {
          if (this.subscribers.length > 0) {
            if (this.selectedSubscriber) {
              const foundSubscriber = this.subscribers.find(subscriber => subscriber.user_id === this.selectedSubscriber?.user_id);
              this.selectedSubscriber = foundSubscriber || this.subscribers[0];
            } else {
              this.selectedSubscriber = this.subscribers[0];
            }
            this.setAccessProperties(this.selectedSubscriber);
          }
        });
      }
    });

    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
          this.setAccessProperties(selectedSubscriber);
          this.saveSelectedSubscriber();
        }
      }
    });
  }

  saveSelectedSubscriber(): void {
    if (this.selectedSubscriber) {
      localStorage.setItem('selectedSubscriber', JSON.stringify(this.selectedSubscriber));
    }
  }

  setAccessProperties(subscriber: Subscriber | undefined): void {
    if (subscriber) {
      this.acces_added = subscriber.acces_added;
      this.acces_admin = subscriber.acces_admin;
      this.acces_services = subscriber.acces_services;
      this.acces_comunal = subscriber.acces_comunal;
      this.acces_filling = subscriber.acces_filling;
      this.acces_subs = subscriber.acces_subs;
      this.acces_discuss = subscriber.acces_discuss;
      this.acces_agreement = subscriber.acces_agreement;
      this.acces_citizen = subscriber.acces_citizen;
      this.acces_comunal_indexes = subscriber.acces_comunal_indexes;
      this.acces_agent = subscriber.acces_agent;
      this.acces_flat_features = subscriber.acces_flat_features;
      this.acces_flat_chats = subscriber.acces_flat_chats;
    }
  }

  onSelectionChange(): void {
    this.selectedFlatIdService.setSelectedFlatId(this.selectedFlatId);
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/citizen/get/citizen';
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
          tell: user_id.tell,
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
    if (!this.selectedSubscriber) {
      const selectedSubscriberId = localStorage.getItem('selectedSubscriber');
      const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === selectedSubscriberId);
      if (selectedSubscriber) {
        this.selectedSubscriber = selectedSubscriber;
        this.setAccessProperties(selectedSubscriber);
      }
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
    acces_flat_chats: boolean
  ): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    this.loading = true;

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

      this.http.post(serverPath + '/citizen/add/access', data).subscribe(
        (response: any) => {
          setTimeout(() => {
            this.zone.run(() => {
              location.reload();
            });
          },);
        },
        (error: any) => {
          console.error(error);
        },
        () => {
          setTimeout(() => {
            this.zone.run(() => {
              this.loading = false;
            });
          }, 1000);
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
      this.http.post(serverPath + '/citizen/delete/citizen', data)
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
