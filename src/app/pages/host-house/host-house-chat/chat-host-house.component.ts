import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { Chat } from '../../../interface/info';
import { ActivatedRoute, Router } from '@angular/router';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';

@Component({
  selector: 'app-chat-host-house',
  templateUrl: './chat-host-house.component.html',
  styleUrls: ['./../../../style/chat/chat_host.scss'],
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
    animations.top1,
  ],
})

export class ChatHostHouseComponent implements OnInit, AfterViewInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedFlatId: any;
  infoPublic: any[] | undefined;
  loading: boolean = true;
  chats: Chat[] = [];
  selectedChat: Chat | undefined;
  houseData: any;
  userData: any;
  indexPage: number = 0;
  chatSelected: boolean = false;
  isLoadingImg: boolean = false;
  userID: number | undefined;
  choseUserId: any;
  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private choseSubscribersService: ChoseSubscribersService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<any> {
    await this.getCheckDevice();
    await this.getServerPath();
    this.loadData();
    this.getSelectedFlatId();
    await this.getFlatChats();
    this.ifSubscriberSelect();
    this.route.queryParams.subscribe(params => {
      const userID = params['user_id'] || '';
      this.userID = Number(userID);
      if (userID) {
        this.onSubscriberSelect(this.userID);
      }
    });
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
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.choseUserId = Number(selectedSubscriber);
        // console.log(this.choseUserId)
        if (this.choseUserId) {
          this.chatSelected = true;
          this.indexPage = 1;
        }
      })
    );
  }

  pickChat() {
    // console.log(this.chats);
    if (this.chats && this.choseUserId) {
      const chat = this.chats.find(chat => chat.user_id === this.choseUserId);
      // console.log(chat)
      if (chat) {
        this.selectChat(chat);
      }
    }
  }

  getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
        if (selectedFlatId) {
          this.selectedFlatId = selectedFlatId;
        } else {
          this.sharedService.logoutHouse();
        }
      })
    );
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
        }
      }
    }
  }

  onSubscriberSelect(user_id: any): void {
    this.chatSelected = true;
    this.indexPage = 1;
    this.choseSubscribersService.setSelectedSubscriber(user_id);
  }

  async getFlatChats(): Promise<any> {
    const url = this.serverPath + '/chat/get/flatchats';
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
            // console.log(response)
            if (Array.isArray(response.status) && response.status) {
              let chat = await Promise.all(response.status.map(async (value: any) => {
                let infUser = await this.http.post(this.serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
                let infFlat = await this.http.post(this.serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
                return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message }
              }))
              this.chats = chat;
              // console.log(this.chats);
              this.pickChat();
              localStorage.setItem('flatChats', JSON.stringify(this.chats));
            } else if (response.status === 'Немає доступу') {
              this.sharedService.setStatusMessage('Немає доступу');
              setTimeout(() => {
                this.router.navigate(['/house/house-info']);
                this.sharedService.setStatusMessage('');
              }, 1500);
            } else {
              console.log('Жодного чату');
            }
          }, (error: any) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }

  selectChat(chat: Chat): void {
    if (this.selectedChat) { this.selectedChat.isSelected = false; }
    this.selectedChat = chat;
    // console.log(this.selectedChat)
    chat.isSelected = true;
    this.indexPage = 1;
    this.onSubscriberSelect(chat.user_id);
    this.readMessage(this.selectedChat);
  }

  // Читаємо нові повідомлення
  async readMessage(chat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && chat.flat_id && chat.user_id) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: chat.flat_id,
        user_id: chat.user_id,
      };
      // console.log(data)
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/readMessageFlat', data).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.updateComponent.iReadHouseMessage();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
