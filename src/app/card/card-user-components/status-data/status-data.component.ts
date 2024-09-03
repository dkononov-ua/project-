import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { UserInfo, UserInfoSearch} from '../../../interface/info';
import { UserConfig, UsereSearchConfig,  } from '../../../interface/param-config';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-status-data',
  templateUrl: './status-data.component.html',
  styleUrls: ['./../../status.scss'],
  animations: [
    animations.fadeIn,
    animations.top4,
    animations.appearance,
  ],
})
export class StatusDataComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***
  userInfo: UserInfo = UserConfig;
  userSearchInfo: UserInfoSearch = UsereSearchConfig;
  statusUserData: any;

  openStatus: boolean = false;
  checkOpenStatus: boolean = true;

  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];
  currentLocation: string = '';

  constructor(
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getStatusData();
  }

  async getStatusData() {
    this.subscriptions.push(
      this.statusDataService.statusData$.subscribe((data: any) => {
        if (data) { this.userInfo = data; }
      })
    );
  }

  toogleOpenStatus(status: boolean) {
    this.openStatus = status;
  }

  onClickedOutside() {
    this.checkOpenStatus = !this.checkOpenStatus;
    if (this.checkOpenStatus) {
      this.openStatus = !this.openStatus;
    } else {
      this.openStatus = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
