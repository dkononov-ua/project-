import { Component, OnInit } from '@angular/core';
import { ServerKeepAliveService } from 'src/app/services/server-keep-alive.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor(private serverKeepAliveService: ServerKeepAliveService) {}
  ngOnInit() {
    this.serverKeepAliveService.startKeepAlive();
  }
}
