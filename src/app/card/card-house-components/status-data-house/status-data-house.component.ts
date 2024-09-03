import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-status-data-house',
  templateUrl: './status-data-house.component.html',
  styleUrls: ['./../../status.scss'],
  animations: [
    animations.fadeIn,
    animations.top4,
    animations.appearance,
  ],
})
export class StatusDataHouseComponent implements OnInit, OnDestroy {

  houseInfo: any;
  openStatus: boolean = false;
  checkOpenStatus: boolean = true;
  subscriptions: any[] = [];

  constructor(
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getStatusData();
  }

  async getStatusData() {
    this.subscriptions.push(
      this.statusDataService.statusDataFlat$.subscribe((data: any) => {
        if (data) { this.houseInfo = data; }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

}
