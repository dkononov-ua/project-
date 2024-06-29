import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SendMessageService } from 'src/app/chat/send-message.service';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserInfo } from '../../../interface/info';
import { UsereSearchConfig } from '../../../interface/param-config';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-status-data',
  templateUrl: './status-data.component.html',
  styleUrls: ['./status-data.component.scss'],
  animations: [animations.fadeIn, animations.top4,
  ],
})
export class StatusDataComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***
  userInfo: UserInfo = UsereSearchConfig;
  userSearchInfo: UserInfo = UsereSearchConfig;
  statusUserData: any;

  openStatus: boolean = false;
  toogleOpenStatus() {
    this.openStatus = !this.openStatus;
  }

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private counterService: CounterService,
    private sendMessageService: SendMessageService,
    private statusDataService: StatusDataService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  async ngOnInit(): Promise<void> {
    this.statusDataService.statusData$.subscribe((data: any) => {
      // console.log(data)
      if (data) { this.userInfo = data; }
    });
  }

}
