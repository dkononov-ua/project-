import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { EMPTY, Subject, Subscription, switchMap, take } from 'rxjs';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SMILEYS } from '../../../data/data-smile'

interface User {
  user_id: string;
  chat_id: string;
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
  smileys: string[] = SMILEYS;
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  users: User[] = [];
  allMessagesNotRead: any[] = [];
  selectedFlatId: string | any;
  selectedUser: User | any;
  loading: boolean = true;
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
  isSmileyPanelOpen = false;
  private getMessagesSubscription: Subscription | null = null;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private sendMessageService: SendMessageService,
    private updateComponent: UpdateComponentService,
  ) {
    this.pushMessageText();
  }

  async ngOnInit(): Promise<any> {
    // console.log('ngOnInit')
    await this.loadData();
    this.scrollDown();
  }

  // Підвантажуємо інформацію про користвача та оселю з локального сховища
  async loadData(): Promise<void> {
    // console.log('loadData')
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
          this.getSelectedFlatId();
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

  // беремо обраний id оселі з сервісу
  getSelectedFlatId() {
    // console.log('getSelectedFlatId')
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        this.getSelectedSub();
      } else { console.log('Оберіть оселю') }
    });
  }

  // беремо обраний id оселі з сервісу
  getSelectedSub() {
    // console.log('getSelectedSub')
    this.choseSubscribersService.selectedSubscriber$.subscribe(async selectedSubscriber => {
      this.getSelectedUser = selectedSubscriber;
      if (this.getSelectedUser) {
        this.getSelectUserInfo(this.getSelectedUser);
      } else { console.log('Оберіть оселю') }
    });
  }

  // отримуємо обраного орендара, та беремо інформацію по ньому з локального сховища flatChats який ми записали в chat-host-house,
  async getSelectUserInfo(subscriberId: string): Promise<any> {
    // console.log('getSelectUserInfo')
    this.selectedSubscriberID = subscriberId;
    if (this.selectedSubscriberID) {
      const flatAllChats = JSON.parse(localStorage.getItem('flatChats') || '[]');
      const findSelectedUser = flatAllChats.filter((item: any) => item.user_id === this.selectedSubscriberID);
      const selectedUser: User[] = findSelectedUser
        .filter((user_id: any) => user_id !== null)
        .map((user_id: any) => ({
          user_id: user_id.user_id,
          chat_id: user_id.chat_id,
          photoUser: user_id.infUser.img[0].img,
          firstName: user_id.infUser.inf.firstName,
          lastName: user_id.infUser.inf.lastName,
          surName: user_id.infUser.inf.surName,
        }));
      this.selectedUser = selectedUser[0];
      await this.getMessages();
    } else {
      this.selectedUser = undefined;
    }
  }

  async getMessages(): Promise<any> {
    // console.log('getMessages')
    clearTimeout(this.interval);
    this.allMessagesNotRead = [];
    this.allMessages = [];
    this.getNewMessages();

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
            } else {
              this.allMessages = [];
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
    // console.log('getNewMessages')
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const requestData = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        offs: 0,
        data: this.allMessages[0]?.data,
      };
      this.getMessagesSubscription = this.http.post(serverPath + '/chat/get/NewMessageFlat', requestData)
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
              const iHaveMessages = this.allMessagesNotRead.every(message => message.is_read === 1 || message.user_id !== null);
              if (iHaveMessages) {
                this.scrollDown();
                setTimeout(() => {
                  if (iHaveMessages) {
                    this.readMessage();
                  }
                }, 500);
              }
              this.loading = false;
            }
            this.interval = setTimeout(() => { this.getNewMessages() }, 3000);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
    this.loading = false;
  }

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

  // Читаємо нові повідомлення
  readMessage() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
      };
      const response: any = this.http.post(serverPath + '/chat/readMessageFlat', data).subscribe();
      if (response) {
        this.updateComponent.iReadHouseMessage();
      }
    }
  }

  ngOnDestroy(): void {
    // відписуюсь від запитів на нові сповіщення
    if (this.getMessagesSubscription) {
      this.getMessagesSubscription.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  scrollDown() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  addSmiley(smiley: string) {
    this.messageText += smiley;
    const textArea = document.getElementById('chat_input') as HTMLInputElement;
    textArea.focus();
    this.toggleSmileyPanel();
  }

  toggleSmileyPanel() {
    this.isSmileyPanelOpen = !this.isSmileyPanelOpen;
    const textArea = document.getElementById('chat_input') as HTMLInputElement;
    textArea.focus();
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  sendMessage(): void {
    if (this.messageText.trim() !== '' && this.selectedFlatId && this.selectedSubscriberID) {
      this.sendMessageService.sendMessage(this.messageText, this.selectedFlatId, this.selectedSubscriberID)
        .subscribe(response => { },
          error => { console.error(error); }
        );
      this.messageText = '';
      // Додавання фокусу на елемент після відправлення повідомлення
      const textArea = document.getElementById('chat_input') as HTMLInputElement;
      textArea.focus();
    }
  }

  // пушимо текст відправленого повідомлення в контейнер та опускаємось вниз
  pushMessageText() {
    // console.log('pushMessageText');
    this.sendMessageService.messageText$.subscribe(text => {
      this.messageText = text;
      if (this.messageText) {
        this.messageText = '';
        this.allMessagesNotRead.unshift({ is_read: 0, message: text });
        this.scrollDown();
      }
    });
  }
}
