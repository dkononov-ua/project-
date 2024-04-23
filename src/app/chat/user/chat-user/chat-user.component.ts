import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { EMPTY, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SMILEYS } from '../../../data/data-smile'
import { Router } from '@angular/router';
import { ChangeMonthService } from 'src/app/housing-services/change-month.service';
import { ChangeYearService } from 'src/app/housing-services/change-year.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit, OnDestroy {

  isStatisticsMessage(message: string): boolean {
    return /#Статистика#(?:Січень|Лютий|Березень|Квітень|Травень|Червень|Липень|Серпень|Вересень|Жовтень|Листопад|Грудень)#(?:20[1-3]\d|2040)#/.test(message);
  }

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
  getSelectedFlatId: string | null | undefined;
  choseFlatID: any;

  private getMessagesSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private sendMessageService: SendMessageService,
    private updateComponent: UpdateComponentService,
    private router: Router,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
    private sharedService: SharedService,
  ) { this.pushMessageText(); }

  async ngOnInit(): Promise<any> {
    await this.loadData();
    await this.getSelectFlatInfo()
  }

  async loadData(): Promise<void> {
    // console.log('loadData')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.userData = JSON.parse(userData);
      } else {
        console.log('Інформація користувача відсутня')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // отримуємо айді оселі обраний чат
  async getSelectFlatInfo(): Promise<any> {
    // console.log('getSelectFlatInfo')
    this.choseSubscribeService.selectedFlatId$.subscribe(async choseFlatID => {
      this.choseFlatID = choseFlatID;
      if (this.choseFlatID) {
        const userAllChats = JSON.parse(localStorage.getItem('userChats') || '[]');
        const selectChat = userAllChats.filter((item: any) => item.flat_id === this.choseFlatID);
        this.infoPublic = selectChat.length > 0 ? selectChat : undefined;
        await this.getMessages(this.choseFlatID);
      } else {
        this.choseFlatID = undefined;
      }
    });
  }

  // Отримання повідомлень
  async getMessages(selectedFlat: any): Promise<any> {
    clearTimeout(this.interval);
    this.allMessagesNotRead = [];
    this.allMessages = [];
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
      try {
        const response: any = await this.http.post(serverPath + '/chat/get/usermessage', info).toPromise() as any[];
        // перевіряю скільки повідомлень якщо більше 49 то показую кнопку підвантажити повідомлення
        this.messageALL = response.status;
        if (Array.isArray(response.status)) {
          this.allMessages = response.status.map((message: any) => {
            const dateTime = new Date(message.data);
            const time = dateTime.toLocaleTimeString();
            return { ...message, time };
          });
        } else {
          this.allMessages = [];
        }
        // console.log(this.allMessages);
        await this.getNewMessages(selectedFlat);
        this.loading = false;
      } catch (error) {
        console.log('Помилка отримання повідомлень');
      }
    } else {
      console.log('Оберіть чат');
    }
  }

  async getNewMessages(selectedFlat: any): Promise<void> {
    console.log('getNewMessages')
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlat) {
      this.getMessagesSubscription = this.http.post(serverPath + '/chat/get/NewMessageUser', {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: 0,
        data: this.allMessages[0]?.data,
      })
        .subscribe(
          async (response: any) => {
            // console.log(response)
            if (Array.isArray(response.status)) {
              let c: any = []
              await Promise.all(response.status.map((i: any, index: any) => {
                const reverseIndex = response.status.length - 1 - index;
                let b = response.status[reverseIndex]
                if (b.is_read === 1) {
                  let dateTime = new Date(b.data);
                  let time = dateTime.toLocaleTimeString();
                  this.allMessages.unshift({ ...b, time })
                  return 1
                } else if (b.is_read === 0) {
                  let dateTime = new Date(b.data);
                  let time = dateTime.toLocaleTimeString();
                  c.unshift({ ...b, time })
                  return 1
                } else {
                  return 1
                }
              }))
              this.allMessagesNotRead = c;
              const iHaveMessages = this.allMessagesNotRead.every(message => message.is_read === 1 || message.user_id === null);
              if (iHaveMessages) {
                this.scrollDown();
                setTimeout(() => {
                  if (iHaveMessages) {
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
    // console.log('loadPreviousMessages')
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

  async ngOnDestroy(): Promise<void> {
    if (this.getMessagesSubscription) {
      this.getMessagesSubscription.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  scrollDown() {
    // console.log('scrollDown')
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
    if (this.messageText.trim() !== '' && this.choseFlatID) {
      this.sendMessageService.sendMessageUser(this.messageText, this.choseFlatID)
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
    // console.log('pushMessageText')
    this.sendMessageService.messageTextUser$.subscribe(text => {
      this.messageText = text;
      if (this.messageText) {
        this.messageText = '';
        this.allMessagesNotRead.unshift({ is_read: 0, user_id: this.userData.inf.user_id, message: text });
        this.scrollDown();
      }
    });
  }

  openStat(message: string) {
    // Розбиття рядка повідомлення на окремі елементи за допомогою регулярного виразу
    const match = /#Статистика#(.+?)#(\d{4})?#/.exec(message);
    if (match && match.length > 1) {
      const month = match[1];
      let year = match[2] ? parseInt(match[2]) : null;
      if (!year || year < 2015 || year > 2040) {
        year = new Date().getFullYear();
      }
      this.changeMonthService.setSelectedMonth(month);
      this.changeYearService.setSelectedYear(year.toString());
      this.sharedService.setStatusMessage(`Відкриваємо статистику за ${month} ${year}`);
      setTimeout(() => {
        this.router.navigate(['/communal/stat-month']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }


}
