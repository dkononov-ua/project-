import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})

export class ChatMenuComponent implements OnInit {

  selectedFlatId: any;
  infoPublic: any[] | undefined;
  chats: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
  ) { }

  async ngOnInit(): Promise<any> {
    this.getSelectedFlatId();
    await this.getChats();
  }

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  async getChats(): Promise<any> {
    const url = 'http://localhost:3000/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: 0
      };

      try {
        const response = await this.http.post(url, data).toPromise() as any;
        console.log(response)
        this.chats = response.status;
        console.log(this.chats)
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }


}
