import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-navbar-house',
  templateUrl: './navbar-house.component.html',
  styleUrls: ['./navbar-house.component.scss']
})
export class NavbarHouseComponent {

  unreadMessage: any;
  selectedFlatId: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      await this.getMessageAll();
    });
  }

  async getMessageAll(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/chat/get/DontReadMessageFlat';
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
}
