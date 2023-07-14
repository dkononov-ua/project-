import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { EMPTY, Subject, interval, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit {
  allMessages: any[] = [];
  allMessagesNotRead: any[] = [];
  currentSubscription: Subject<unknown> | undefined;
  messageText: string = '';
  loading: boolean | undefined;
  selectedFlat: any;
  selectedFlatIdSubscription: any;
  infoPublic: any[] | undefined;
  interval: any

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$.subscribe(flatId => {
      this.selectedFlat = flatId;
      if (flatId) {
        const offs = 0;
        this.selectedFlat = flatId;
        this.getMessages(this.selectedFlat);
        this.getUserChats(this.selectedFlat, offs);
      }
    });
  }

  async getUserChats(selectedFlat: string, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/chat/get/userchats';

    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: offs
      };
      const response = await this.http.post(url, data).toPromise() as any;
      if (Array.isArray(response.status)) {
        this.infoPublic = await Promise.all(response.status.map(async (value: any) => {
          const infUser = await this.http.post('http://localhost:3000/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
          const infFlat = await this.http.post('http://localhost:3000/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
          return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread };
        }));
        this.infoPublic = this.infoPublic.filter((item) => item.flat_id === selectedFlat);
        return this.infoPublic;
      } else {
        console.error('Invalid response format');
      }
    } else {
      console.log('user or subscriber not found');
    }
  }


  async getMessages(selectedFlat: any): Promise<any> {
    clearTimeout(this.interval);
    this.allMessagesNotRead = [];
    this.allMessages = [];

    if (this.currentSubscription) {
      this.currentSubscription.next(undefined);
    }

    const userJson = localStorage.getItem('user');

    if (userJson && selectedFlat) {
      const info = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: 0,
      };

      const destroy$ = new Subject();

      this.http.post('http://localhost:3000/chat/get/usermessage', info)
        .pipe(
          switchMap((response: any) => {
            if (Array.isArray(response.status)) {
              this.allMessages = response.status.map((message: any) => {
                const dateTime = new Date(message.data);
                const time = dateTime.toLocaleTimeString();
                return { ...message, time };
              });
              this.getNewMessages(selectedFlat);
            } else {
              this.allMessages = [];
            }
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
    } else {
      console.log('user or subscriber not found');
    }
  }


  async getNewMessages(selectedFlat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlat) {
      this.http.post('http://localhost:3000/chat/get/NewMessageUser', {
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
              this.allMessagesNotRead = c
              if (this.selectedFlat) {
                this.messagesHaveBeenRead(this.selectedFlat);
              }
            }
            this.interval = setTimeout(() => { this.getNewMessages(selectedFlat) }, 5000);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  messagesHaveBeenRead(selectedFlat: any) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
      };
      this.http.post('http://localhost:3000/chat/readMessageUser', data).subscribe();
    }
  }

  sendMessage(selectedFlat: any): void {
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        message: this.messageText,
      };

      this.http.post('http://localhost:3000/chat/sendMessageUser', data)
        .subscribe((response: any) => {
          if (response.status) {
            this.messageText = '';

            if (selectedFlat === this.selectedFlat) {
              this.getMessages(selectedFlat);
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
