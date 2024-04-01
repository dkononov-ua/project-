import { FormBuilder } from '@angular/forms';
import { FilterService } from '../../../../search/filter.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { animations } from '../../../../interface/animation';

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
export class UserSearchComponent implements OnInit {
  loading = false;
  searchQuery: string | undefined;
  subscribers: Subscriber[] | undefined;
  timer: NodeJS.Timeout | undefined;
  selectedSubscriber: Subscriber | undefined;
  selectedFlatId: any;
  statusMessage: string | undefined;
  path_logo = path_logo;
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

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        this.selectedFlatId = selectedFlatId;
        this.loadDataFlat();
      }
    });
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
      const url = serverPath + `/acceptsubs/add/sitizen/`;
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
            this.statusMessage = 'Немає доступу або не існує такого ID';
            setTimeout(() => {
              this.statusMessage = '';
            }, 2500);
          } else {
            this.statusMessage = 'Додаємо користувача з ID:' + this.searchQuery;
            setTimeout(() => {
              this.statusMessage = '';
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

  isValidSearchQuery(): any {
    return this.searchQuery && this.searchQuery.length >= 1;
  }
}
