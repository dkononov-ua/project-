import { FormBuilder } from '@angular/forms';
import { FilterService } from '../../search/filter.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

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

  async onSubmit(): Promise<void> {
    this.loading = true;

    if (this.searchQuery) {
      const url = `http://localhost:3000/acceptsubs/add/sitizen/`;
      const selectedFlat = this.selectedFlatId;
      const userJson = localStorage.getItem('user');

      if (userJson) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: selectedFlat,
          user_id: this.searchQuery,
        };

        try {
          const response = await this.http.post<Subscriber[]>(url, data).toPromise();
          this.subscribers = response;
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('User not found');
      }
    }

    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  isValidSearchQuery(): any {
    return this.searchQuery && this.searchQuery.length >= 1;
  }
}
