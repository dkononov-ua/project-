import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Chat } from '../../../interface/info';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
  animations: [
    animations.top2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})

export class ChatHostComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  chats: Chat[] = [];
  loading: boolean = false;
  offs: 0 | undefined;
  choseFlatId: any | null;
  selectedChat: Chat | undefined;
  indexPage: number = 0;
  chatSelected: boolean = false;
  isLoadingImg: boolean = false;
  choseFlatID: any;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        await this.getFlatChats();
      }
    })
    this.loading = false;
  }

  // отримуємо всі чати які в нас є
  async getFlatChats(): Promise<any> {
    const url = this.serverPath + '/chat/get/userchats';
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
              let infUser = await this.http.post(this.serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
              let infFlat = await this.http.post(this.serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
              return {
                flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, flat_name: value.flat_name, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message
              }
            }))
            this.chats = chat;
            // console.log(this.chats)
            localStorage.setItem('userChats', JSON.stringify(this.chats));
            // перевіряємо чи є в нас автоматично обраний чат
            this.getSelectFlatInfo();
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

  // отримуємо автоматично з сервісу айді оселі обраний чат
  async getSelectFlatInfo(): Promise<any> {
    // console.log('getSelectFlatInfo')
    this.choseSubscribeService.selectedFlatId$.subscribe(async choseFlatID => {
      this.choseFlatID = choseFlatID;
      // console.log(this.choseFlatID)
      if (this.choseFlatID) {
        this.onAutoFlatSelect(Number(this.choseFlatID));
      } else {
        this.choseFlatID = undefined;
      }
    });
  }

  // дії при існуванні вибраного айді оселі
  async onAutoFlatSelect(choseFlatID: number): Promise<void> {
    // шукаємо по адйі оселі обраний чат
    const chat: any = this.chats.find(chat => chat.flat_id === choseFlatID);
    // якщо він є то
    if (chat) {
      // скидаємо те що в нас було обрано візуально
      if (this.selectedChat) {
        this.selectedChat.isSelected = false;
      }
      // вносимо нову інформацію по чату
      this.selectedChat = chat;
      // візуально обираємо чат
      chat.isSelected = true;
      // повідомляємо що ми обрали чат
      this.chatSelected = true;
      // переходимо до повідомлень
      this.indexPage = 1;
    }
  }

  onFlatSelect(chat: Chat): void {
    this.chatSelected = true;
    this.choseSubscribeService.setChosenFlatId(chat.flat_id);
  }

  selectChat(chat: Chat): void {
    // console.log(chat)
    if (this.selectedChat) {
      this.selectedChat.isSelected = false;
    }
    this.selectedChat = chat;
    chat.isSelected = true;
    this.indexPage = 1;
    this.onFlatSelect(chat);
  }
}



