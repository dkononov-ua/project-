import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { Chat } from '../../../interface/info';

@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
})

export class ChatHostComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  chats: Chat[] = [];
  loading: boolean = false;
  offs: 0 | undefined;
  choseFlatId: any | null;
  selectedChat: Chat | undefined;
  openChatCard: boolean = false;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getFlatChats();
    this.loading = false;
  }

  async getFlatChats(): Promise<any> {
    const url = serverPath + '/chat/get/userchats';
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        offs: 0
      };
      this.http.post(url, data)
        .subscribe(async (response: any) => {
          if (Array.isArray(response.status) && response.status) {
            let chat = await Promise.all(response.status.map(async (value: any) => {
              let infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
              let infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
              return {
                flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, flat_name: value.flat_name, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message
              }
            }))
            this.chats = chat;
            localStorage.setItem('userChats', JSON.stringify(this.chats));
          } else {
            console.log('Немає чатів');
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('Нічого не знайдено');
    }
  }

  onFlatSelect(chat: Chat): void {
    this.choseSubscribeService.setChosenFlatId(chat.flat_id);
  }

  selectChat(chat: Chat): void {
    if (this.selectedChat) {
      this.selectedChat.isSelected = false;
    }
    this.selectedChat = chat;
    chat.isSelected = true;
    this.openChatCard = true;
    this.onFlatSelect(chat);
  }
}
