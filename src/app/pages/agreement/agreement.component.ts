import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DataService } from 'src/app/services/data.service';

interface Subscriber {
  user_id: string;
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
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
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
export class AgreementComponent implements OnInit {

  @ViewChild('agreeContainer') agreeContainer: ElementRef | undefined;

  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  isOnline = true;
  isOffline = false;
  selectedSubscriber: Subscriber | undefined;
  houseData: any;
  userData: any;

  agreementDate: number | undefined;
  leaseTermMonths: number | undefined;
  leaseTermYears: number | undefined;
  rentDueDate: number | undefined;
  penalty: number | undefined;
  maxPenalty: number | undefined;

  isCityDisabled: boolean = true;
  isStreetDisabled: boolean = true;
  isHouseNumberDisabled: boolean = true;
  isApartmentNumberDisabled: boolean = true;
  isApartmentSizeDisabled: boolean = true;
  isRentPriceDisabled: boolean = true;
  loading: boolean = true;

  isContainerVisible = false;
  isCheckboxChecked = false;
  isCheckboxPenalty = false;

  openContainer() {
    this.isContainerVisible = true;
  }
  closeContainer() {
    this.isContainerVisible = false;
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      console.log(selectedFlatId);
      if (selectedFlatId) {
        const offs = 0;
        this.getSubs(selectedFlatId, offs);
      }
    });

    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      console.log(subscriberId);
      if (subscriberId) {
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          console.log(selectedSubscriber);
          this.selectedSubscriber = selectedSubscriber;
        }
      }
    });
  }

  onSelectionChange(selectedSubscriberId: string | any): void {
    this.choseSubscribersService.setSelectedSubscriber(selectedSubscriberId);
  }

  loadData(): void {
    this.dataService.getData().subscribe((response: any) => {
      console.log(response.houseData)
      console.log(response.userData)
      this.houseData = response.houseData;
      this.userData = response.userData;
      this.loading = false; // Приховати лоадер після завантаження даних
    }, (error) => {
      console.error(error);
      this.loading = false; // Приховати лоадер у разі помилки
    });
  }

  async getSubs(selectedSubscriberId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedSubscriberId,
      offs: offs,
    };
    console.log(data)
    console.log(selectedSubscriberId)
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)

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
          tell: user_id.tell,
          mail: user_id.mail,
          facebook: user_id.facebook,
        }));
      console.log(this.subscribers)
      this.subscribers = newSubscribers;

      const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === selectedSubscriberId);
      if (selectedSubscriber) {
        console.log(selectedSubscriber);
        this.selectedSubscriber = selectedSubscriber;
      }

    } catch (error) {
      console.error(error);
    }
  }
}
