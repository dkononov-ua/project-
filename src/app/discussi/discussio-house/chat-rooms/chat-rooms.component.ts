import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { DataService } from 'src/app/services/data.service';
interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  isSelected?: boolean;
  unread: number;
  infFlat: {
    imgs: string;
  }
  infUser: {
    img: any;
    inf: {
      firstName: string;
      lastName: string;
      surName: string;
    }
  }
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}
@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})

export class ChatRoomsComponent implements OnInit {
  selectedFlatId: any;
  chats: Chat[] = [];
  selectedChat: Chat | undefined;
  houseData: any;
  userData: any;
  loading: boolean = true;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.getSelectedFlatId();
    this.getFlatChats();
    this.loading = false;
  }

  async loadData(): Promise<void> {
    this.dataService.getData().subscribe((response: any) => {
      this.houseData = response.houseData;
      this.userData = response.userData;
    }, (error) => {
      console.error(error);
    });
  }

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  onSubscriberSelect(chat: Chat): void {
    const url = 'http://localhost:3000/chat/readMessageFlat';
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: chat.flat_id,
        user_id: chat.user_id,
      };
      this.http.post(url, data).subscribe()
    } else {
      console.log('user not found');
    }
    this.choseSubscribersService.setSelectedSubscriber(chat.user_id);
  }

  async getFlatChats(): Promise<any> {
    console.log('Отримання чатів')
    const url = 'http://localhost:3000/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    const offs = 0;

    if (userJson && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: offs,
      };

      try {
        this.http.post(url, data)
          .subscribe(async (response: any) => {
            if (Array.isArray(response.status) && response.status) {
              let chat = await Promise.all(response.status.map(async (value: any) => {
                let infUser = await this.http.post('http://localhost:3000/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
                let infFlat = await this.http.post('http://localhost:3000/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
                return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread }
              }))
              this.chats = chat;
            } else {
              console.log('chat not found');
            }
          }, (error: any) => {
            console.error(error);
          });
      } catch (error) {

      }
    } else {
      console.log('chat not found');
    }
  }

  selectChat(chat: Chat): void {
    if (this.selectedChat) {
      this.selectedChat.isSelected = false;
    }
    this.selectedChat = chat;
    chat.isSelected = true;

    this.onSubscriberSelect(chat);
  }

}
