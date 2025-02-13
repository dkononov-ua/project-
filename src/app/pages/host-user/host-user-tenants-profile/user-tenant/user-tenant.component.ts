import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-user-tenant',
  templateUrl: './user-tenant.component.html',
  styleUrls: ['./../../../pages.scss'],
  animations: [
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.bot,
  ],
})
export class UserTenantComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
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

    // Перевірка на авторизацію користувача
    async checkUserAuthorization() {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.authorization = true;
      } else {
        this.authorization = false;
      }
    }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
