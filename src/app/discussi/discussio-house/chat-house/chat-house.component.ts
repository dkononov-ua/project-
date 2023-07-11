import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Subject, interval, switchMap, takeUntil } from 'rxjs';

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
  users: User[] = [];
  selectedFlatId: string | any;
  selectedUser: User | undefined;
  loading = false;
  messageText: string = '';
  allMessages: any[] = [];
  houseData: any;
  userData: any;
  currentSubscription: Subject<unknown> | undefined;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      if (selectedFlatId) {
        this.selectedFlatId = selectedFlatId
        const offs = 0;
        this.getFlatChats(selectedFlatId, offs).then(() => {
          this.updateSelectedUser();
          this.getFlatMessages(this.selectedUser);
        });
      }
    });

    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
        const selectedUser = this.users.find(subscriber => subscriber.user_id === subscriberId);
        console.log(this.users)
        if (subscriberId) {
          this.selectedUser = selectedUser;
          this.getFlatMessages({ user_id: subscriberId });
        }
      } else if (!this.selectedUser && this.users.length > 0) {
        this.selectedUser = this.users[0];
        this.getFlatMessages({ user_id: subscriberId });
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

  async getFlatChats(selectedFlatId: string, offs: number): Promise<any> {
    const selectedFlat = selectedFlatId;
    const url = 'http://localhost:3000/chat/get/flatchats';

    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        offs: offs
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
          this.selectedFlatId = selectedFlatId;
        } else {
          console.error('Invalid response format');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user or subscriber not found');
    }
  }

  updateSelectedUser(): void {
    if (!this.selectedUser && this.users.length > 0) {
      this.selectedUser = this.users[0];
    }
  }

  sendMessage(selectedUser: any): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: selectedUser.user_id,
        message: this.messageText,
      };
      this.http.post('http://localhost:3000/chat/sendMessageFlat', data)
        .subscribe((response: any) => {
          this.getFlatMessages(this.selectedUser);
          this.messageText = '';
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  getFlatMessages(selectedUser: any): void {
    if (this.currentSubscription) { this.currentSubscription.next(undefined); }
    const userJson = localStorage.getItem('user');

    if (userJson && selectedUser) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedUser.user_id,
        offs: 0,
      };
      const destroy$ = new Subject();

      this.http.post('http://localhost:3000/chat/get/flatmessage', data)
        .pipe(
          switchMap(async (response: any) => {
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

          this.http.post('http://localhost:3000/chat/get/flatmessage', data)
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

}
