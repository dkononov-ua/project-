import { Component, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { animations } from '../../../app/interface/animation';

@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.scss'],
  animations: [
    animations.appearance,
  ],
})
export class StatusMessageComponent implements OnInit {

  path_logo = ServerConfig.pathLogo;
  statusMessage: string = '';

  constructor(
    private statusMessageService: StatusMessageService,
  ) { }

  ngOnInit() {
    this.statusMessageService.statusMessage$.subscribe((message: string) => {
      // console.log(message);
      this.statusMessage = message;
    });
  }

}
