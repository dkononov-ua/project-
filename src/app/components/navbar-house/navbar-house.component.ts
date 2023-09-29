import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/shared/server-config';

@Component({
  selector: 'app-navbar-house',
  templateUrl: './navbar-house.component.html',
  styleUrls: ['./navbar-house.component.scss']
})
export class NavbarHouseComponent {

  unreadMessage: any;
  selectedFlatId: any;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  loading: boolean = true;
  dataUpdated = false;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    this.getFlatId();
    if (userJson && this.selectedFlatId) {
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
}
