import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-search-house-page',
  templateUrl: './search-house-page.component.html',
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
export class SearchHousePageComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private sharedService: SharedService,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.updateMetaTagsInService();
    await this.getCheckDevice();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Пошук оселі',
      description: 'Пояснення як працює пошук житла в Діскусіо',
      keywords: 'пошук, шукаю, оселі, житла, житло, оселю, квартири, квартиру, будинок, будинку',
      // image: '/assets/blog/blog.png',
      // url: 'https://discussio.site/blog',
    }
    this.updateMetaTagsService.updateMetaTags(data)
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

