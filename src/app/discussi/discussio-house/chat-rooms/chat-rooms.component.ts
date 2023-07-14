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
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {
  selectedFlatId: any;
  chats: Chat[] = [];
  subscribers: Subscriber[] = [];
  selectedSubscriber: any;
  selectedSubscriberId: string | null = null;
  selectedChat: Chat | undefined;

  houseData: any;
  userData: any;
  loading: boolean | undefined;
  offs: 0 | undefined;

  selectChat(chat: Chat): void {
    this.onSubscriberSelect(chat);

    if (this.selectedChat) {
      this.selectedChat.isSelected = false;
    }

    this.selectedChat = chat;
    chat.isSelected = true;
  }

  setSelectedSubscriber(chat: any): void {
    this.selectedSubscriber = chat.user_id;
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,

  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        this.loadData();
        this.getFlatChats(selectedFlatId, offs);
      }
    });
  }

  async loadData(): Promise<void> {
    this.dataService.getData().subscribe((response: any) => {
      this.houseData = response.houseData;
      this.userData = response.userData;

      this.loading = false;
    }, (error) => {
      console.error(error);
      this.loading = false;
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
      console.log('user or subscriber not found');
    }

    this.choseSubscribersService.setSelectedSubscriber(chat.user_id);
    this.selectedSubscriber = chat;
    this.selectedSubscriberId = chat.user_id;
  }

  async getFlatChats(selectedFlatId: string, offs: number): Promise<any> {
    const selectedFlat = selectedFlatId;
    const url = 'http://localhost:3000/chat/get/flatchats';

    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: offs
      };
      this.http.post(url, data)
        .subscribe(async (response: any) => {
          if (Array.isArray(response.status) && response.status) {
            let chat = await Promise.all(response.status.map(async (value: any) => {
              let infUser = await this.http.post('http://localhost:3000/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
              let infFlat = await this.http.post('http://localhost:3000/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
              return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat,  unread: value.unread  }
            }))
            this.chats = chat;
          } else {
            console.error('Invalid response format');
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  // selectChat(chat: Chat): void {
  //   this.onSubscriberSelect(chat);
  // }
}
