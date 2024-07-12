import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { ChoseSubscribeService } from '../services/chose-subscribe.service';
import { ChoseSubscribersService } from '../services/chose-subscribers.service';
import { Location } from '@angular/common';
import { SelectedFlatService } from '../services/selected-flat.service';

@Injectable({
  providedIn: 'root'
})
export class CreateChatService {

  serverPath: string = '';
  currentLocation: string = '';
  choseUserId: any;
  selectedFlatId: any;
  choseFlatId: any;
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private choseSubscribeService: ChoseSubscribeService,
    private choseSubscribersService: ChoseSubscribersService,
    private location: Location,
    private selectedFlatIdService: SelectedFlatService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      // console.log(this.serverPath)
    })
    this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId || null;
    });
    this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
      this.choseUserId = selectedSubscriber;
    })
    this.choseSubscribeService.selectedFlatId$.subscribe(selectedFlatId => {
      this.choseFlatId = selectedFlatId;
    })
    this.currentLocation = this.location.path();
  }

  // Створюю чат оселі з обраним користувачем
  async createChat(): Promise<void> {
    this.sharedService.setStatusMessage('Створюємо чат');
    const userJson = localStorage.getItem('user');
    if (userJson && this.choseUserId) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: this.choseUserId, };
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatFlat', data).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.sharedService.setStatusMessage('Чат створено');
          setTimeout(async () => {
            const chatExists = await this.checkChatExistence();
            // console.log(chatExists)
            if (chatExists) {
              this.sharedService.setStatusMessage('Переходимо до чату');
              this.choseSubscribersService.setSelectedSubscriber(this.choseUserId);
              setTimeout(() => {
                this.router.navigate(['/chat-house']);
                this.sharedService.setStatusMessage('');
              }, 1500);
            }
          }, 200);
        } else if (response.status === false) {
          this.sharedService.setStatusMessage('Не вдалось створити чат, повторіть спробу');
          setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
        } else {
          this.sharedService.setStatusMessage(response.status);
          setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Створюю чат з оселею
  async createUserChat(flat_id: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && flat_id) {
      const data = { auth: JSON.parse(userJson), flat_id: flat_id, };
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatUser', data).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.sharedService.setStatusMessage('Чат створено');
          setTimeout(async () => {
            const chatExists = await this.checkChatExistenceUser();
            // console.log(chatExists)
            if (chatExists) {
              this.sharedService.setStatusMessage('Переходимо до чату');
              this.choseSubscribeService.setChosenFlatId(this.choseUserId);
              setTimeout(() => {
                this.router.navigate(['/chat-user']);
                this.sharedService.setStatusMessage('');
              }, 1500);
            }
          }, 200);
        } else if (response.status === false) {
          this.sharedService.setStatusMessage('Не вдалось створити чат, повторіть спробу');
          setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
        } else {
          this.sharedService.setStatusMessage(response.status);
          setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Перевірка на існування чату оселі з користувачем
  async checkChatExistence(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.choseUserId) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, offs: 0 };
      // console.log(data)
      try {
        const response = await this.http.post(this.serverPath + '/chat/get/flatchats', data).toPromise() as any;
        // console.log(response)
        if (this.choseUserId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { user_id: any }) => chat.user_id === this.choseUserId);
          // console.log(chatExists)
          return chatExists;
        } else {
          // console.log('чат не існує');
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      console.log('Авторизуйтесь');
      return false;
    }
  }

  // Перевірка на існування чату користувача з оселею
  async checkChatExistenceUser(): Promise<boolean> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.choseFlatId) {
      const data = { auth: JSON.parse(userJson), flat_id: this.choseFlatId, offs: 0 };
      try {
        const response = await this.http.post(this.serverPath + '/chat/get/userchats', data).toPromise() as any;
        if (this.choseFlatId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { flat_id: any }) => chat.flat_id === this.choseFlatId);
          return chatExists;
        } else {
          // console.log('чат не існує');
          return false;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      console.log('Авторизуйтесь');
      return false;
    }
  }


}
