import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { SMILEYS } from '../../../data/data-smile'
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SendMessageService } from 'src/app/services/send-message.service';

@Component({
  selector: 'app-send-message-user',
  templateUrl: './send-message-user.component.html',
  styleUrls: ['./send-message-user.component.scss']
})
export class SendMessageUserComponent implements OnInit {

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
  messageText: string = '';
  selectedFlat: any;
  selectedFlatIdSubscription: any;
  interval: any;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private sendMessageService: SendMessageService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.getSelectSubscription();
  }

  getSelectSubscription() {
    this.selectedFlatIdSubscription = this.choseSubscribeService.selectedFlatId$.subscribe(async flatId => {
      this.selectedFlat = flatId;
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

  preventKeyboardCollapse(event: Event) {
    event.preventDefault();
  }

  // sendMessage(selectedFlat: any): void {
  //   this.isSmileyPanelOpen = false;
  //   const userJson = localStorage.getItem('user');
  //   if (userJson && selectedFlat) {
  //     const data = {
  //       auth: JSON.parse(userJson),
  //       flat_id: selectedFlat,
  //       message: this.messageText,
  //     };

  //     this.http.post(serverPath + '/chat/sendMessageUser', data)
  //       .subscribe((response: any) => {
  //         if (response.status) {
  //           this.messageText = '';
  //           this.textArea.nativeElement.style.height = '50px';
  //         } else {
  //           console.log("Ваше повідомлення не надіслано");
  //         }
  //       }, (error: any) => {
  //         console.error(error);
  //       });
  //   }
  // }


  sendMessage(selectedFlat: any): void {
    this.sendMessageService.sendMessageUser(this.messageText, selectedFlat)
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

