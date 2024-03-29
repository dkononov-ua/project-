import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { EMPTY, Subject, switchMap, take, takeUntil } from 'rxjs';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SMILEYS } from '../../../data/data-smile'

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer', { static: true }) chatContainer!: ElementRef;
  private isScrolledDown = false;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  allMessages: any[] = [];
  allMessagesNotRead: any[] = [];
  currentSubscription: Subject<unknown> | undefined;
  loading: boolean = true;
  selectedFlat: any;
  selectedFlatIdSubscription: any;
  infoPublic: any[] | undefined;
  interval: any;
  chatExist: boolean = true;
  messageText: string = '';
  messageALL: any[] = [];
  userData: any;
  userAllChats: any;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  isSmileyPanelOpen = false;
  smileys: string[] = SMILEYS;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private sendMessageService: SendMessageService,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<any> {
    await this.loadData();
    this.scrollDown();
  }

  async loadData(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.userData = JSON.parse(userData);
        this.getSelectFlatInfo();
      } else {
        console.log('Інформація користувача відсутня')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // отримуємо обрану оселю, та беремо інформацію по ній з локального сховища userChats який ми записали в chat-Host,
  async getSelectFlatInfo(): Promise<any> {
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$
      .pipe(take(1)) // take(1) гарантує, що після одного виникнення події обробник буде автоматично відписаний від observable.
      .subscribe(async flatId => {
        this.sendMessageService.messageTextUser$.subscribe(text => {
          this.messageText = text;
          this.allMessagesNotRead.unshift({ is_read: 0, user_id: this.userData.inf.user_id, message: text });
          this.scrollDown();
          this.messageText = '';
        });
        this.selectedFlat = flatId;
        if (this.selectedFlat) {
          const userAllChats = JSON.parse(localStorage.getItem('userChats') || '[]');
          const selectChat = userAllChats.filter((item: any) => item.flat_id === this.selectedFlat);
          this.infoPublic = selectChat.length > 0 ? selectChat : undefined;
          await this.getMessages(this.selectedFlat);
        } else {
          this.selectedFlat = undefined;
        }
      });
  }

  async getMessages(selectedFlat: any): Promise<any> {
    clearTimeout(this.interval);
    this.allMessagesNotRead = [];
    this.allMessages = [];
    this.getNewMessages(selectedFlat);

    if (this.currentSubscription) {
      this.currentSubscription.next(undefined);
    }

    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlat && this.chatExist) {
      const info = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: 0,
      };
      const destroy$ = new Subject();
      this.http.post(serverPath + '/chat/get/usermessage', info)
        .pipe(
          switchMap((response: any) => {
            if (Array.isArray(response.status)) {
              this.messageALL = response.status
              this.allMessages = response.status.map((message: any) => {
                const dateTime = new Date(message.data);
                const time = dateTime.toLocaleTimeString();
                return { ...message, time };
              });
            } else {
              this.allMessages = [];
            }
            this.loading = false;
            return EMPTY;
          }),
          takeUntil(destroy$)
        )
        .subscribe(() => {
          this.getNewMessages(selectedFlat);
        });
      this.currentSubscription = destroy$;
      destroy$.subscribe(() => {
      });
    } else { console.log('Авторизуйтесь'); this.loading = false; }
  }

  async getNewMessages(selectedFlat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlat && this.chatExist) {
      this.http.post(serverPath + '/chat/get/NewMessageUser', {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: 0,
        data: this.allMessages[0]?.data,
      })
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
              // Перевірка чиє повідомлення непрочитане
              const iHaveMessages = this.allMessagesNotRead.every(message => message.is_read === 1 || message.user_id === null);
              // console.log(iHaveMessages)
              if (iHaveMessages) {
                this.scrollDown();
                // console.log('Маю повідомлення опускаюсь до низу')
                setTimeout(() => {
                  if (iHaveMessages) {
                    // console.log('Читаю')
                    this.readMessage(selectedFlat);
                  }
                }, 500);
              }
              this.loading = false;
            }
            this.interval = setTimeout(() => { this.getNewMessages(selectedFlat) }, 3000);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  async loadPreviousMessages(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlat) {
      const info = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlat,
        offs: this.allMessages.length,
      };

      try {
        const response: any = await this.http.post(serverPath + '/chat/get/usermessage', info).toPromise();
        this.messageALL = response.status;
        if (Array.isArray(response.status)) {
          const newMessages = response.status.map((message: any) => {
            const dateTime = new Date(message.data);
            const time = dateTime.toLocaleTimeString();
            return { ...message, time };
          });
          this.allMessages = [...this.allMessages, ...newMessages];
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Оберіть чат');
    }
  }

  readMessage(selectedFlat: any) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
      };
      const response: any = this.http.post(serverPath + '/chat/readMessageUser', data).subscribe();
      if (response) {
        this.updateComponent.iReadUserMessage();
      }
    }
  }

  ngOnDestroy(): void {
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

  sendMessage(selectedFlat: any): void {
    if (this.messageText.trim() !== '' && selectedFlat) {
      this.sendMessageService.sendMessageUser(this.messageText, selectedFlat)
        .subscribe(response => { },
          error => { console.error(error); }
        );
      this.messageText = '';
      // Додавання фокусу на елемент після відправлення повідомлення
      const textArea = document.getElementById('chat_input') as HTMLInputElement;
      textArea.focus();
    }
  }
}
