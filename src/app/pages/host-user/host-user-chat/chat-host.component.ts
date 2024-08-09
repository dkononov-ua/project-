import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Chat } from '../../../interface/info';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['../../../style/chat/chat_host.scss'],
  animations: [
    animations.top1,
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

export class ChatHostComponent implements OnInit, OnDestroy {

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
  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.getUserChats();
    this.ifSubscriberSelect();
    this.loading = false;
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  async ifSubscriberSelect() {
    this.subscriptions.push(
      this.choseSubscribeService.selectedFlatId$.subscribe(selectedFlatId => {
        this.choseFlatId = selectedFlatId;
        // console.log(this.choseFlatId)
        if (this.choseFlatId) {
          this.chatSelected = true;
          this.indexPage = 1;
        }
      })
    );
  }

  pickChat() {
    if (this.chats && this.choseFlatId) {
      const chat = this.chats.find(chat => chat.flat_id === this.choseFlatId);
      if (chat) {
        if (this.selectedChat) {
          this.selectedChat.isSelected = false;
        }
        this.selectedChat = chat;
        chat.isSelected = true;
        this.indexPage = 1;
      }
    }
  }

  // отримуємо всі чати які в нас є
  async getUserChats(): Promise<any> {
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
            this.pickChat();
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
    this.chatSelected = true;
    this.choseSubscribeService.setChosenFlatId(chat.flat_id);
  }

  selectChat(chat: Chat): void {
    if (chat.flat_id !== this.choseFlatId) {
      if (this.selectedChat) {
        this.selectedChat.isSelected = false;
      }
      this.selectedChat = chat;
      chat.isSelected = true;
      this.indexPage = 1;
      this.onFlatSelect(chat);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}



