import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SendMessageService } from 'src/app/services/chat/send-message.service';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserInfo } from '../../../interface/info';
import { UsereSearchConfig } from '../../../interface/param-config';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-status-access',
  templateUrl: './status-access.component.html',
  styleUrls: ['./status-access.component.scss']
})
export class StatusAccessComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***
  statusAccess: any;

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
    this.statusDataService.statusAccess$.subscribe((data: any) => {
      if (data) {
        this.statusAccess = data;
        // console.log(this.statusAccess)
      }
    });
  }

  close() {
    this.statusAccess = null;
    this.statusDataService.setStatusAccess(null);
  }
}

