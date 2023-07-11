import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../chose-subscribe.service';
import { Subject, interval, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit {
  allMessages: any[] = [];
  currentSubscription: Subject<unknown> | undefined;
  messageText: string = '';
  loading: boolean | undefined;
  selectedFlat: any;
  selectedFlatIdSubscription: any;
  infoPublic: any[] | undefined;

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
        this.getUserMessages(this.selectedFlat);
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
          return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat };
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

  async getUserMessages(selectedFlat: any): Promise<any> {
    if (this.currentSubscription) {
      this.currentSubscription.next(undefined);
    }

    const userJson = localStorage.getItem('user');

    if (userJson && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: 0,
      };
      this.allMessages = [];
      const destroy$ = new Subject();

      this.http.post('http://localhost:3000/chat/get/usermessage', data)
        .pipe(
          switchMap((response: any) => {
            if (Array.isArray(response.status)) {
              this.allMessages = response.status.map((message: any) => {
                const dateTime = new Date(message.data);
                const time = dateTime.toLocaleTimeString();
                return { ...message, time };
              });
            } else {
              this.allMessages = [];
            }
            return interval(5000);
          }),
          takeUntil(destroy$)
        )
        .subscribe(() => {
          this.http.post('http://localhost:3000/chat/get/usermessage', data)
            .subscribe((response: any) => {
              if (Array.isArray(response.status)) {
                this.allMessages = response.status.map((message: any) => {
                  const dateTime = new Date(message.data);
                  const time = dateTime.toLocaleTimeString();
                  return { ...message, time };
                });
              } else {
                this.allMessages = [];
              }
            }, (error: any) => {
              console.error(error);
            });
        });

      this.currentSubscription = destroy$;

      destroy$.subscribe(() => {
      });
    } else {
      console.log('user or subscriber not found');
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
      console.log(data)
      this.http.post('http://localhost:3000/chat/sendMessageUser', data)
        .subscribe((response: any) => {
          this.getUserMessages(this.selectedFlat);
          this.messageText = '';
          this.allMessages.push(response);
        }, (error: any) => {
          console.error(error);
        });
    }
  }
}
