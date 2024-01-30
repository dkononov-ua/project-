import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SMILEYS } from '../../../data/data-smile'
import { SendMessageService } from 'src/app/chat/send-message.service';

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
    private choseSubscribersService: ChoseSubscribersService,
    private sendMessageService: SendMessageService,
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
      }
    });
  }

  sendMessage(): void {
    if (this.messageText.trim() !== '' && this.selectedFlatId && this.selectedSubscriberID) {
      this.sendMessageService.sendMessage(this.messageText, this.selectedFlatId, this.selectedSubscriberID)
        .subscribe(
          response => {
            // Отримайте статус респонсу тут
            console.log(response);
          },
          error => {
            // Обробка помилок тут
            console.error(error);
          }
        );
      this.messageText = '';
    }
  }



}
