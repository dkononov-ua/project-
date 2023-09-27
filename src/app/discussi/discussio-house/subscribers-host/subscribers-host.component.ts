import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/shared/server-config';

@Component({
  selector: 'app-subscribers-host',
  templateUrl: './subscribers-host.component.html',
  styleUrls: ['./subscribers-host.component.scss']
})
export class SubscribersHostComponent implements OnInit {

  selectedFlatId!: string | null;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  loading: boolean = true;
  dataUpdated = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getUpdate();
    this.loading = false;
  }

  async getUpdate() {
    await this.getFlatId();
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

