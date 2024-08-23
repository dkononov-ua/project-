import { FormBuilder } from '@angular/forms';
import { FilterService } from '../../../../services/search/filter.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
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
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class UserSearchComponent implements OnInit, OnDestroy {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  loading = false;
  searchQuery: string | undefined;
  subscribers: Subscriber[] | undefined;
  selectedSubscriber: Subscriber | undefined;
  selectedFlatId: any;
  statusMessage: string | undefined;
  user: any;

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
  authorization: boolean = false;
  houseData: any;
  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getSelectedFlat();
    this.loadDataFlat();
  }


  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        if (flatId) {
          this.selectedFlatId = Number(flatId);
        } else {
          this.sharedService.logoutHouse();
        }
      })
    )
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        const parsedHouseData = JSON.parse(houseData);
        this.houseData = parsedHouseData;
        if (this.houseData) {
          this.getHouseAcces();
        }
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      // console.log(this.houseData.acces)
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    }
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  async onSubmit(): Promise<void> {
    this.loading = true;

    if (this.searchQuery) {
      const url = this.serverPath + `/acceptsubs/add/sitizen/`;
      const selectedFlat = this.selectedFlatId;
      const userJson = localStorage.getItem('user');

      if (userJson) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: selectedFlat,
          user_id: this.searchQuery,
        };
        try {
          const response: any = await this.http.post<Subscriber[]>(url, data).toPromise();
          if (response.status === false) {
            this.sharedService.setStatusMessage('Немає доступу або не існує такого ID');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2500);
          } else {
            this.sharedService.setStatusMessage('Додаємо користувача з ID:') + this.searchQuery;
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              this.reloadPageWithLoader()
            }, 1500);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('User not found');
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  isValidSearchQuery(): any {
    return this.searchQuery && this.searchQuery.length >= 1;
  }
}
