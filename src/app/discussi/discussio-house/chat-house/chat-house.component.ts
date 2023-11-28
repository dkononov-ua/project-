import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { EMPTY, Subject, switchMap } from 'rxjs';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SendMessageService } from 'src/app/services/send-message.service';
import { DatePipe } from '@angular/common';

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

  @ViewChild('chatContainer', { static: true }) chatContainer!: ElementRef;
  private isScrolledDown = false;

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

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
  uniqueDates: string[] = [];
  messageALL: any[] = [];

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private sendMessageService: SendMessageService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.loadData();
    this.getSelectedFlatId();
    this.getSelectedSubscribersId();
    this.loading = false;

    this.sendMessageService.messageText$.subscribe(text => {
      this.messageText = text;
      this.allMessagesNotRead.unshift({ is_read: 0, message: text });
    });
  }

  async getNewMessages(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const requestData = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        offs: 0,
        data: this.allMessages[0]?.data,
      };

      this.http.post(serverPath + '/chat/get/NewMessageFlat', requestData)
        .subscribe(
          async (response: any) => {
            if (Array.isArray(response.status)) {
              let unreadMessages: any = []
              await Promise.all(response.status.map((serverMessage: any, index: any) => {
                const reverseIndex = response.status.length - 1 - index;
                let currentMessage = response.status[reverseIndex];
                if (currentMessage.is_read == 1) {
                  let dateTime = new Date(currentMessage.data);
                  let time = dateTime.toLocaleTimeString();
                  this.allMessages.unshift({ ...currentMessage, time })
                  return 1
                } else if (currentMessage.is_read == 0) {
                  let dateTime = new Date(currentMessage.data);
                  let time = dateTime.toLocaleTimeString();
                  unreadMessages.unshift({ ...currentMessage, time })
                  return 1
                } else {
                  return 1
                }
              }))
              this.allMessagesNotRead = unreadMessages;
              this.selectedUser = this.selectedUser;
              if (this.selectedSubscriberID) {
                this.messagesHaveBeenRead();
              }
            }
            this.interval = setTimeout(() => { this.getNewMessages() }, 10000);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Підвантажуємо інформацію про користвача та оселю з локального сховища
  loadData(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        this.userData = parsedUserData;
        console.log(this.userData.inf.user_id)
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
    // console.log('Запит повідомлення', 'user:', this.selectedSubscriberID)
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
            this.messageALL = response.status
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

  // setDateToChat() {
  //   function formatDate(date: Date): string {
  //     const year = date.getFullYear();
  //     const month = date.getMonth() + 1;
  //     const day = date.getDate();
  //     return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  //   }
  //   const uniqueDatesMap: { [date: string]: any } = {};
  //   this.allMessages.reverse().forEach((message) => {
  //     const formattedDate = formatDate(new Date(message.data));
  //     if (!uniqueDatesMap[formattedDate]) {
  //       message.uniqueDate = formattedDate;
  //       uniqueDatesMap[formattedDate] = message;
  //     }
  //   });
  // }

  async loadPreviousMessages(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedSubscriberID) {
      const info = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        offs: this.allMessages.length,
      };
      try {
        const response: any = await this.http.post(serverPath + '/chat/get/flatmessage', info).toPromise();
        this.messageALL = response.status
        if (Array.isArray(response.status)) {
          const newMessages = response.status.map((message: any) => {
            const dateTime = new Date(message.data);
            const time = dateTime.toLocaleTimeString();
            return { ...message, time };
          });
          this.messageALL = response.status
          this.allMessages = [...this.allMessages, ...newMessages];
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Оберіть чат');
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

}
