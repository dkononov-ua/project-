import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EMPTY, Subject, interval, switchMap, takeUntil } from 'rxjs';
import { SMILEYS } from '../../../shared/data-smile'

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

export class ChatHouseComponent implements OnInit {

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  isSmileyPanelOpen = false;
  smileys: string[] = SMILEYS;

  users: User[] = [];
  allMessagesNotRead: any[] = [];
  selectedFlatId: string | any;
  selectedUser: User | any;
  loading = false;
  messageText: string = '';
  allMessages: any[] = [];
  houseData: any;
  userData: any;
  currentSubscription: Subject<unknown> | undefined;
  interval: any;
  infoPublic: any[] | undefined;
  offs = 0;

  selectedSubscribersId: any;
  selectedSubscriberID: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.loadData();
    this.getSelectedFlatId();
    this.getSelectedSubscribersId();
  }

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  getSelectedSubscribersId() {
    this.selectedSubscribersId = this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedUser = this.users.find(subscriber => subscriber.user_id === subscriberId);
        if (subscriberId) {
          this.selectedSubscriberID = subscriberId;
          this.getChats(this.selectedSubscriberID);
          this.selectedUser = selectedUser;
          this.getMessages(this.selectedSubscriberID);
        }
      } else if (!this.selectedUser && this.users.length > 0) {
        this.selectedUser = this.users[0];
        this.getMessages(this.selectedSubscriberID);
      }
    });
  }

  async loadData(): Promise<void> {
    this.dataService.getData().subscribe((response: any) => {
      this.houseData = response.houseData;
      this.userData = response.userData;
      this.loading = false;
    }, (error) => {
      console.error(error);
      this.loading = false;
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

  async getChats(selectedSubscriberID: any): Promise<any> {
    const url = 'http://localhost:3000/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: this.offs
      };
      try {
        const response = await this.http.post(url, data).toPromise() as any;

        if (Array.isArray(response.status)) {
          const infoPublic = await Promise.all(response.status.map(async (value: any) => {
            const infUser = await this.http.post('http://localhost:3000/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
            const infFlat = await this.http.post('http://localhost:3000/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
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
          this.selectedFlatId = this.selectedFlatId;
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

  async getMessages(selectedSubscriberID: any): Promise<any> {
    clearTimeout(this.interval);
    this.allMessagesNotRead = [];
    this.allMessages = [];
    if (this.currentSubscription) { this.currentSubscription.next(undefined); }
    const userJson = localStorage.getItem('user');
    if (userJson && selectedSubscriberID) {
      const info = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedSubscriberID,
        offs: 0,
      };
      const destroy$ = new Subject();

      this.http.post('http://localhost:3000/chat/get/flatmessage', info)
        .pipe(
          switchMap((response: any) => {
            if (Array.isArray(response.status)) {
              this.allMessages = response.status.map((message: any) => {
                const dateTime = new Date(message.data);
                const time = dateTime.toLocaleTimeString();
                return { ...message, time };
              });
              this.getNewMessages(selectedSubscriberID);
            } else {
              this.allMessages = [];
              this.getNewMessages(selectedSubscriberID);
            }
            return EMPTY;
          }),
          takeUntil(destroy$)
        )
        .subscribe(async () => {
          await this.getNewMessages(selectedSubscriberID);
        });

      this.currentSubscription = destroy$;

      destroy$.subscribe(() => {
      });
    } else {
      console.log('Оберіть чат');
    }
  }

  async getNewMessages(selectedSubscriberID: any): Promise<void> {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');

    if (userJson && selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: selectedSubscriberID,
        offs: 0,
        data: this.allMessages[0]?.data,
      };

      this.http.post('http://localhost:3000/chat/get/NewMessageFlat', data)
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
              if (this.selectedUser) {
                this.messagesHaveBeenRead(this.selectedUser);
              }
            }
            this.interval = setTimeout(() => { this.getNewMessages(selectedSubscriberID) }, 5000);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  messagesHaveBeenRead(selectedUser: any) {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: this.selectedSubscriberID,
      };
      this.http.post('http://localhost:3000/chat/readMessageFlat', data).subscribe();
    }
  }

  sendMessage(selectedSubscriberID: any): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: this.selectedSubscriberID,
        message: this.messageText,
      };

      this.http.post('http://localhost:3000/chat/sendMessageFlat', data)
        .subscribe((response: any) => {
          if (response.status) {
            this.messageText = '';
            if (this.selectedSubscriberID === this.selectedUser) {
              this.getMessages(this.selectedSubscriberID);
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
