import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';

interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  isSelected?: boolean;
  lastMessage: string;
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
  selector: 'app-chat-host-house',
  templateUrl: './chat-host-house.component.html',
  styleUrls: ['./chat-host-house.component.scss'],
})

export class ChatHostHouseComponent implements OnInit, AfterViewInit {
  selectedFlatId: any;
  infoPublic: any[] | undefined;

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  chats: Chat[] = [];
  selectedChat: Chat | undefined;
  houseData: any;
  userData: any;
  openChatCard: boolean = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private choseSubscribersService: ChoseSubscribersService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.loadData();
    this.getSelectedFlatId();
    this.getFlatChats();
  }

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  // Підвантажуємо інформацію про користвача та оселю з локального сховища
  loadData(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        this.userData = parsedUserData;
        const houseData = localStorage.getItem('houseData');
        if (houseData) {
          const parsedHouseData = JSON.parse(houseData);
          this.houseData = parsedHouseData;
        } else {
          console.log('Інформація оселі відсутня')
        }
      } else {
        console.log('Інформація користувача відсутня')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  onSubscriberSelect(chat: Chat): void {
    this.choseSubscribersService.setSelectedSubscriber(chat.user_id);
  }

  async getFlatChats(): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
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
                let infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
                let infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
                return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message }
              }))
              this.chats = chat;
              localStorage.setItem('flatChats', JSON.stringify(this.chats));
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
    this.openChatCard = true;
    this.onSubscriberSelect(chat);
  }

}
