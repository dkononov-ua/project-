import { Component, OnInit } from '@angular/core';
import { HouseSearchConfig } from '../../../interface/param-config';
import { HouseStatusInfo } from '../../../interface/info';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-status-data-house',
  templateUrl: './status-data-house.component.html',
  styleUrls: ['./status-data-house.component.scss'],
  animations: [animations.fadeIn],
})
export class StatusDataHouseComponent implements OnInit {

  houseInfo: any;
  openStatus: boolean = false;
  toogleOpenStatus() {
    this.openStatus = !this.openStatus;
  }
  // houseInfo: HouseStatusInfo = HouseSearchConfig;

  constructor(
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.statusDataService.statusDataFlat$.subscribe((data: any) => {
      if (data) { this.houseInfo = data; }
      // console.log(this.houseInfo)
    });
  }

}
