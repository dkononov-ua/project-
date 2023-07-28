import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';

interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  isSelected?: boolean;
  unread: number;

  infFlat: {
    imgs: any;
    flat: string;
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
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {
  selectedFlatId: any;
  chats: Chat[] = [];
  selectedChat: Chat | undefined;

  houseData: any;
  userData: any;
  loading: boolean | undefined;
  offs: 0 | undefined;
  selectedFlatIdSubscription: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
  ) { }

  ngOnInit(): void {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        this.getFlatChats(selectedFlatId, offs);
      }
    });
  }

  selectChat(chat: Chat): void {
    const url = 'http://localhost:3000/chat/readMessageUser';

    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: chat.flat_id,
      };
      this.http.post(url, data).subscribe()
    } else {
      console.log('user or subscriber not found');
    }

    this.choseSubscribeService.chosenFlatId = chat.flat_id;
    this.selectedFlatId = chat.flat_id;

    if (this.selectedChat) {
      this.selectedChat.isSelected = false;
    }

    this.selectedChat = chat;
    chat.isSelected = true;
  }

  async getFlatChats(selectedFlatId: string, offs: number): Promise<any> {
    const selectedFlat = selectedFlatId;
    const url = 'http://localhost:3000/chat/get/userchats';

    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: offs
      };
      this.http.post(url, data)
        .subscribe(async (response: any) => {
          console.log(response)
          if (Array.isArray(response.status) && response.status) {
            let chat = await Promise.all(response.status.map(async (value: any) => {
              let infUser = await this.http.post('http://localhost:3000/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
              let infFlat = await this.http.post('http://localhost:3000/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
              return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread }
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
}
