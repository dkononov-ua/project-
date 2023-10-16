import { FormBuilder } from '@angular/forms';
import { FilterService } from '../../search/filter.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/shared/server-config';

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

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        this.selectedFlatId = selectedFlatId;
      }
    });
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
