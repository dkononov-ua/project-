import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/config/server-config';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  unreadMessage: any;
  unreadUserMessage: any;
  selectedFlatId: any;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;

  counterUserSubs: any;
  counterUserSubscriptions: any;
  counterUserDiscuss: any;
  numSendAgree: number = 0;
  userInf: any;
  agreeNum: number = 0;

  loading: boolean = true;
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

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    this.getUserUpdate();
    this.getFlatId();
    if (userJson && this.selectedFlatId) {
      this.loadDataFlat();
      await this.getUpdate();
    }
    this.loading = false;
  }

  async getUpdate() {
    await this.getMessageAll();
    await this.getSubsCount();
    await this.getAcceptSubsCount();
    await this.getSubscriptionsCount();
    this.updateComponent.update$.subscribe(() => {
      this.dataUpdated = true;
      if (this.dataUpdated === true) {
        this.getFlatId();
        this.getSubsCount();
        this.getAcceptSubsCount();
        this.getSubscriptionsCount();
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
          console.log(this.acces_comunal)
        } else {
        }
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // Підписники
  async getSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/subs/get/countSubs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterSubs = response;
    }
    catch (error) {
      console.error(error)
    }
  }

  // Підписки
  async getSubscriptionsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/usersubs/get/CountUserSubs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterSubscriptions = response;
    }
    catch (error) {
      console.error(error)
    }
  }

  // Дискусії
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountSubs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterAcceptSubs = response;
    }
    catch (error) {
      console.error(error)
    }
  }


  async getUserMessageAll(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/chat/get/DontReadMessageUser';
    const data = { auth: JSON.parse(userJson!) };

    if (userJson) {
      this.http.post(url, data).subscribe((response: any) => {
        this.unreadUserMessage = response.status;
      }, (error: any) => {
        console.error(error);
      });
    } else {
      console.log('user not found');
    }
  }

  async getUserUpdate() {
    localStorage.getItem('userData')
    const userInfo = localStorage.getItem('userData');
    if (userInfo) {
      this.userInf = JSON.parse(userInfo);
      this.agreeNum = this.userInf.agree.total;
    }

    await this.getUserMessageAll();
    await this.getUserSubsCount();
    await this.getUserAcceptSubsCount();
    await this.getUserSubscriptionsCount();

    this.updateComponent.updateUser$.subscribe(() => {
      this.dataUpdated = true;
      if (this.dataUpdated === true) {
        this.getUserSubsCount();
        this.getUserAcceptSubsCount();
        this.getUserSubscriptionsCount();
      }
    });
  }

  // Підписники
  async getUserSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/usersubs/get/CountYUserSubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterUserSubs = response;
    }
    catch (error) {
      console.error(error)
    }
  }

  // Підписки
  async getUserSubscriptionsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/subs/get/countYSubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterUserSubscriptions = response;
    }
    catch (error) {
      console.error(error)
    }
  }

  // Дискусії
  async getUserAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountYsubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterUserDiscuss = response;
    }
    catch (error) {
      console.error(error)
    }
  }

}

