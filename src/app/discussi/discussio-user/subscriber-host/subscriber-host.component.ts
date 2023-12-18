import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/config/server-config';
@Component({
  selector: 'app-subscriber-host',
  templateUrl: './subscriber-host.component.html',
  styleUrls: ['./subscriber-host.component.scss']
})
export class SubscriberHostComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
  }

}



