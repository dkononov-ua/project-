import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
import { ActivatedRoute, Router } from '@angular/router';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./../user-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.top1,
  ],
})

export class UserDeleteComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  emailCheckCode: any;
  agreeToDel: boolean = false;
  sentCode: boolean = false;

  goBack(): void {
    this.location.back();
  }

  userInfo: any;
  showPassword = false;
  isPasswordVisible = false;
  passwordType = 'password';
  disabledPassword: boolean = true;
  disabledEmail: boolean = true;
  emailCheck: number = 0;
  passwordCheck: number = 0;
  checkCode: any;

  sendCodeEmail() {
    this.emailCheck = 1;
    // відправити код для підтвердження
  }

  confirmCodeEmail() {
    this.emailCheck = 2;
    this.userInfo.email = '';
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodeNewEmail() {
    this.emailCheck = 3;
    // перевірити та підтвердити код, переписуємо пошту
  }

  confirmCodeNewEmail() {
    this.emailCheck = 0;
    this.getInfo();
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodePassword() {
    this.passwordCheck = 1;
    // відправити код для підтвердження
  }

  confirmCodePassword() {
    this.passwordCheck = 2;
    this.userInfo.password = '';
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodeNewPassword() {
    this.passwordCheck = 0;
    this.getInfo();
  }

  isAccountOpenStatus: boolean = true;
  helpAdd: boolean = false;
  openHelpAdd() {
    this.helpAdd = !this.helpAdd;
  }
  phonePattern = '^[0-9]{10}$';
  startX = 0;

  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private _dialog: LyDialog,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
  }

  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getInfo();
    } else {
      this.authorization = false;
    }
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(this.serverPath + '/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          this.userInfo = response.inf;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }


  async deleteAcc(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/userinfo/delete/finaly', { auth: JSON.parse(userJson), code: this.emailCheckCode }).toPromise();
        // console.log(response)
        if (response.status === 'Видалено') {
          this.sharedService.setStatusMessage('Аккаунт видалено');
          this.sharedService.clearCache();
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.router.navigate(['/auth/registration']);
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка видалення');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка на сервері, повторіть спробу');
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  sendCodeForDelAcc() {
    const userJson = localStorage.getItem('user');
    const data = {
      email: this.userInfo.user_mail,
    };
    this.sentCode = true;
    if (userJson) {
      try {
        // console.log(data);
        this.http.post(this.serverPath + '/userinfo/delete/first', { auth: JSON.parse(userJson) })
          .subscribe((response: any) => {
            // console.log(response)
            if (response.status === 'На вашу пошту було надіслано код безпеки') {
              this.sentCode = true;
              this.sharedService.setStatusMessage('На вашу пошту було надіслано код безпеки');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
              }, 2000);
            } else {
              this.sentCode = false;
              this.sharedService.setStatusMessage('Помилка надсилання коду безпеки');
              setTimeout(() => {
                location.reload();
              }, 2000);
            }
          });
      } catch (error) {
        this.sentCode = false;
        this.sharedService.setStatusMessage('Сталася помилка на сервері');
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

};
