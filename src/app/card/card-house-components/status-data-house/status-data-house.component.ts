import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-status-data-house',
  templateUrl: './status-data-house.component.html',
  styleUrls: ['./status-data-house.component.scss'],
  animations: [
    animations.fadeIn,
    animations.top4,
  ],
})
export class StatusDataHouseComponent implements OnInit, OnDestroy {

  houseInfo: any;
  openStatus: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.statusDataService.statusDataFlat$.subscribe((data: any) => {
        if (data) { this.houseInfo = data; }
      })
    );
  }

  toogleOpenStatus() {
    this.openStatus = !this.openStatus;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
