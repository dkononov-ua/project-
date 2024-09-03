import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-objects-page',
  templateUrl: './objects-page.component.html',
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
export class ObjectsPageComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
  }


  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
