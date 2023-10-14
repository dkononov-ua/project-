import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { SMILEYS } from '../../../shared/data-smile'
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/shared/server-config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  isSmileyPanelOpen = false;
  smileys: string[] = SMILEYS;
  allMessages: any[] = [];
  allMessagesNotRead: any[] = [];
  currentSubscription: Subject<unknown> | undefined;
  messageText: string = '';
  loading: boolean | undefined;
  selectedFlat: any;
  selectedFlatIdSubscription: any;
  infoPublic: any[] | undefined;
  interval: any;

  goBack(): void {
    this.location.back();
  }

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<any> {
    this.getSelectSubscription();
  }

  getSelectSubscription() {
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$.subscribe(async flatId => {
      this.selectedFlat = flatId;
      console.log(this.selectedFlat)
      if (flatId) {
        const offs = 0;
        this.selectedFlat = flatId;
        await this.getUserChats(this.selectedFlat, offs);
        await this.getMessages(this.selectedFlat);
      } else {
        this.selectedFlat = undefined;
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

  async getUserChats(selectedFlat: string, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/chat/get/userchats';

    if (userJson && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: offs
      };
      const response = await this.http.post(url, data).toPromise() as any;
      if (Array.isArray(response.status)) {
        let asd = await Promise.all(response.status.map(async (value: any) => {
          const infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
          const infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
          return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, flat_name: value.flat_name, infUser: infUser, infFlat: infFlat, unread: value.unread };
        }));
        let zxc = asd.filter((item) => item.flat_id === selectedFlat);
        if(zxc[0]){
          this.infoPublic = zxc
        }else{
          this.infoPublic = undefined
        }
        return this.infoPublic;
      } else {
        console.log('чат не знайдено');
      }
    } else {
      console.log('відсутня інформація користувача');
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

      this.http.post(serverPath + '/chat/get/usermessage', info)
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
              this.getNewMessages(selectedFlat);
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

  preventKeyboardCollapse(event: Event) {
    event.preventDefault();
  }

  messagesHaveBeenRead(selectedFlat: any) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
      };
      this.http.post(serverPath + '/chat/readMessageUser', data).subscribe();
    }
  }

  sendMessage(selectedFlat: any): void {
    this.isSmileyPanelOpen = false;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlat) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        message: this.messageText,
      };

      this.http.post(serverPath + '/chat/sendMessageUser', data)
        .subscribe((response: any) => {
          if (response.status) {
            this.messageText = '';

            if (selectedFlat === this.selectedFlat) {
              this.getMessages(selectedFlat);
            }

            this.textArea.nativeElement.style.height = '50px';
          } else {
            console.log("Ваше повідомлення не надіслано");
          }
        }, (error: any) => {
          console.error(error);
        });
    }
  }



}
