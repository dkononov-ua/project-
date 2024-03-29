import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { Chat } from '../../../interface/info';
import { ActivatedRoute, Router } from '@angular/router';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-chat-host-house',
  templateUrl: './chat-host-house.component.html',
  styleUrls: ['../../chat_host.scss'],
  animations: [
    animations.top2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})

export class ChatHostHouseComponent implements OnInit, AfterViewInit {
  selectedFlatId: any;
  infoPublic: any[] | undefined;
  loading: boolean = true;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  chats: Chat[] = [];
  selectedChat: Chat | undefined;
  houseData: any;
  userData: any;
  indexPage: number = 0;
  chatSelected: boolean = false;
  isLoadingImg: boolean = false;
  startX = 0;
  userID: number | undefined;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private choseSubscribersService: ChoseSubscribersService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<any> {
    this.loadData();
    this.getSelectedFlatId();
    this.getFlatChats();
    this.route.queryParams.subscribe(params => {
      const userID = params['user_id'] || '';
      this.userID = Number(userID);
      if (userID) {
        this.onSubscriberSelect(this.userID);
      }
    });
    this.loading = false;
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    console.log('Свайп')
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }
  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.router.navigate(['/house/house-info']);
      }
    } else {
      this.indexPage = 0;
    }
  }

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1000);
  }

  // Підвантажуємо інформацію про користвача та оселю з локального сховища
  loadData(): void {
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

  onSubscriberSelect(user_id: any): void {
    this.chatSelected = true;
    this.indexPage = 1;
    this.choseSubscribersService.setSelectedSubscriber(user_id);
  }

  async getFlatChats(): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    const offs = 0;

    if (userJson && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: offs,
      };

      try {
        this.http.post(url, data)
          .subscribe(async (response: any) => {
            if (Array.isArray(response.status) && response.status) {
              let chat = await Promise.all(response.status.map(async (value: any) => {
                let infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
                let infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
                return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message }
              }))
              this.chats = chat;
              localStorage.setItem('flatChats', JSON.stringify(this.chats));
            } else {
              console.log('chat not found');
            }
          }, (error: any) => {
            console.error(error);
          });
      } catch (error) {
      }
    } else {
      console.log('chat not found');
    }
  }

  selectChat(chat: Chat): void {
    if (this.selectedChat) { this.selectedChat.isSelected = false; }
    this.selectedChat = chat;
    chat.isSelected = true;
    this.indexPage = 1;
    this.onSubscriberSelect(chat.user_id);
  }
}
