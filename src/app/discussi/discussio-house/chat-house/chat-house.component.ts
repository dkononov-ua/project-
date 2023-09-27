import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { DataService } from 'src/app/services/data.service';
import { EMPTY, Subject, Subscription, interval, switchMap, takeUntil } from 'rxjs';
import { SMILEYS } from '../../../shared/data-smile'
import { IsChatOpenService } from 'src/app/services/is-chat-open.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';

interface User {
  user_id: string;
  chat_id: string;
  flat_id: string;
  photoFlat: string;
  photoUser: string;
  firstName: string;
  lastName: string;
  surName: string;
}
@Component({
  selector: 'app-chat-house',
  templateUrl: './chat-house.component.html',
  styleUrls: ['./chat-house.component.scss'],
})

export class ChatHouseComponent implements OnInit, OnDestroy {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  
  private httpSubscription: Subscription | undefined;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  isSmileyPanelOpen = false;
  smileys: string[] = SMILEYS;
  users: User[] = [];
  allMessagesNotRead: any[] = [];
  selectedFlatId: string | any;
  selectedUser: User | any;
  loading = true;
  messageText: string = '';
  allMessages: any[] = [];
  houseData: any;
  userData: any;
  currentSubscription: Subject<unknown> | undefined;
  interval: any;
  infoPublic: any[] | undefined;
  offs = 0;
  getSelectedUser: any;
  selectedSubscriberID: any;
  isChatOpenStatus: boolean = true;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,
    private isChatOpenService: IsChatOpenService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.sendChatIsOpen();
    this.loadData();
    this.getSelectedFlatId();
    this.getSelectedSubscribersId();
    this.loading = false;
  }

  sendChatIsOpen() {
    this.isChatOpenStatus = true;
    this.isChatOpenService.setIsChatOpen(this.isChatOpenStatus);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.isChatOpenStatus = false;
    this.isChatOpenService.setIsChatOpen(this.isChatOpenStatus);
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

  async getSelectedSubscribersId() {
    this.getSelectedUser = this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      if (subscriberId && this.selectedFlatId) {
        this.selectedSubscriberID = subscriberId;
        await this.getChats();
        this.selectedUser = this.users.find(subscriber => subscriber.user_id === subscriberId);
        if (this.selectedUser) {
          this.getMessages();
        }
      } else if (!this.selectedUser && this.users.length > 0) {
        console.log('Оберіть чат')
      }
    });
  }

  addSmiley(smiley: string) {
    this.messageText += smiley;
  }

  toggleSmileyPanel() {
    this.isSmileyPanelOpen = !this.isSmileyPanelOpen;
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  async getChats(): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: this.offs
      };
      try {
        const response = await this.http.post(url, data).toPromise() as any;
        if (Array.isArray(response.status)) {
          const infoPublic = await Promise.all(response.status.map(async (value: any) => {
            const infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
            const infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
            return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat };
          }));

          const selectedUser: User[] = infoPublic
            .filter((user_id: any) => user_id !== null)
            .map((user_id: any) => ({
              user_id: user_id.user_id,
              chat_id: user_id.chat_id,
              flat_id: user_id.flat_id,
              photoFlat: user_id.infFlat.imgs[0],
              photoUser: user_id.infUser.img[0].img,
              firstName: user_id.infUser.inf.firstName,
              lastName: user_id.infUser.inf.lastName,
              surName: user_id.infUser.inf.surName,
            }));

          this.users = selectedUser;
        } else {
          console.log('user not found');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }

  async getMessages(): Promise<any> {
    console.log('Запит повідомлення', 'user:', this.selectedSubscriberID)

    clearTimeout(this.interval);
    this.allMessagesNotRead = [];
    this.allMessages = [];

    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedSubscriberID) {
      const info = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        offs: 0,
      };
      this.http.post(serverPath + '/chat/get/flatmessage', info)
        .pipe(
          switchMap((response: any) => {
            if (Array.isArray(response.status)) {
              this.allMessages = response.status.map((message: any) => {
                const dateTime = new Date(message.data);
                const time = dateTime.toLocaleTimeString();
                return { ...message, time };
              });
              this.getNewMessages();
            } else {
              this.allMessages = [];
              this.getNewMessages();
            }
            return EMPTY;
          }),
        )
        .subscribe(async () => {
          await this.getNewMessages();
        });

    } else {
      console.log('Оберіть чат');
    }
  }

  async getNewMessages(): Promise<void> {
    console.log('Запит на нові повідомлення', 'user:', this.selectedSubscriberID)
    const userJson = localStorage.getItem('user');

    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        offs: 0,
        data: this.allMessages[0]?.data,
      };

      this.http.post(serverPath + '/chat/get/NewMessageFlat', data)
        .subscribe(
          async (response: any) => {
            if (Array.isArray(response.status)) {
              let c: any = []
              await Promise.all(response.status.map((i: any, index: any) => {
                const reverseIndex = response.status.length - 1 - index;
                let b = response.status[reverseIndex]
                if (b.is_read == 1) {
                  let dateTime = new Date(b.data);
                  let time = dateTime.toLocaleTimeString();
                  this.allMessages.unshift({ ...b, time })
                  return 1
                } else if (b.is_read == 0) {
                  let dateTime = new Date(b.data);
                  let time = dateTime.toLocaleTimeString();
                  c.unshift({ ...b, time })
                  return 1
                } else {
                  return 1
                }
              }))
              this.allMessagesNotRead = c;
              this.selectedUser = this.selectedUser;
              if (this.selectedSubscriberID) {
                this.messagesHaveBeenRead();
              }
            }
            this.interval = setTimeout(() => { this.getNewMessages() }, 5000);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  messagesHaveBeenRead() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
      };
      this.http.post(serverPath + '/chat/readMessageFlat', data).subscribe();
    }
  }

  sendMessage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        message: this.messageText,
      };

      this.http.post(serverPath + '/chat/sendMessageFlat', data)
        .subscribe((response: any) => {
          if (response.status) {
            this.messageText = '';
            if (this.selectedSubscriberID === this.selectedUser.user_id) {
              this.getMessages();
            }
          } else {
            console.log("Ваше повідомлення не надіслано");
          }
        }, (error: any) => {
          console.error(error);
        });
    }
  }
}
