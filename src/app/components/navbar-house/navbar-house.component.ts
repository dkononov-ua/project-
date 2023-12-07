import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/config/server-config';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-navbar-house',
  templateUrl: './navbar-house.component.html',
  styleUrls: ['./navbar-house.component.scss']
})
export class NavbarHouseComponent {

  unreadMessage: any;
  selectedFlatId: any;
  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  dataUpdated = false;
  houseData: any;

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
  subscribed: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private updateComponent: UpdateComponentService,
    private counterService: CounterService
  ) {

  }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.getFlatId();
      if (this.selectedFlatId) {
        this.getUpdate();
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  async getCounterHouse(): Promise<void> {
    // кількість підписників
    this.counterService.counterHouseSubscribers$.subscribe(data => {
      const counterHouseSubscribers: any = data;
      this.counterHouseSubscribers = counterHouseSubscribers.status;
      console.log('counterHouseSubscribers', this.counterHouseSubscribers)
    });
    // кількість підписок
    this.counterService.counterHouseSubscriptions$.subscribe(data => {
      const counterHouseSubscriptions: any = data;
      this.counterHouseSubscriptions = counterHouseSubscriptions.status;
      console.log('counterHouseSubscriptions', this.counterHouseSubscriptions)

    });
    // кількість дискусій
    this.counterService.counterHouseDiscussio$.subscribe(data => {
      const counterHouseDiscussio: any = data;
      this.counterHouseDiscussio = counterHouseDiscussio.status;
      console.log('counterHouseDiscussio', this.counterHouseDiscussio)
    });
  }


  async getUpdate() {
    this.counterService.getHouseSubsCount(this.selectedFlatId);
    await this.getMessageAll();
    await this.getCounterHouse();
    this.updateComponent.update$.subscribe(async () => {
      this.dataUpdated = true;
      if (this.dataUpdated === true) {
        // this.getFlatId();
      }
    });
  }

  getFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  async getMessageAll(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/chat/get/DontReadMessageFlat';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };

    if (userJson) {
      this.http.post(url, data).subscribe((response: any) => {
        this.unreadMessage = response.status;
      }, (error: any) => {
        console.error(error);
      });
    } else {
      console.log('user not found');
    }
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        if (parsedHouseData.acces) {
          this.acces_added = parsedHouseData.acces.acces_added;
          this.acces_admin = parsedHouseData.acces.acces_admin;
          this.acces_agent = parsedHouseData.acces.acces_agent;
          this.acces_agreement = parsedHouseData.acces.acces_agreement;
          this.acces_citizen = parsedHouseData.acces.acces_citizen;
          this.acces_comunal = parsedHouseData.acces.acces_comunal;
          this.acces_comunal_indexes = parsedHouseData.acces.acces_comunal_indexes;
          this.acces_discuss = parsedHouseData.acces.acces_discuss;
          this.acces_filling = parsedHouseData.acces.acces_filling;
          this.acces_flat_chats = parsedHouseData.acces.acces_flat_chats;
          this.acces_flat_features = parsedHouseData.acces.acces_flat_features;
          this.acces_services = parsedHouseData.acces.acces_services;
          this.acces_subs = parsedHouseData.acces.acces_subs;
        } else {
        }
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

}
