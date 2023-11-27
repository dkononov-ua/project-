import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SMILEYS } from '../../../data/data-smile'

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  isSmileyPanelOpen = false;
  smileys: string[] = SMILEYS;
  selectedFlatId: string | any;
  messageText: string = '';
  houseData: any;
  userData: any;
  selectedSubscriberID: any;
  getSelectedUser: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.loadData();
    this.getSelectedFlatId();
    this.getSelectedSubscribersId();
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

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  async getSelectedSubscribersId() {
    this.getSelectedUser = this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      if (subscriberId && this.selectedFlatId) {
        this.selectedSubscriberID = subscriberId;
    }});
  }

  sendMessage(): void {
    this.isSmileyPanelOpen = false;
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId && this.selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: this.selectedSubscriberID,
        message: this.messageText,
      };

      this.http.post(serverPath + '/chat/sendMessageFlat', data)
        .subscribe((response: any) => {
          if (response.status) {
            this.messageText = '';
            // if (this.selectedSubscriberID === this.selectedUser.user_id) {
            //   this.getMessages();
            // }
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
