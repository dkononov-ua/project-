import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-search-neighbor-page',
  templateUrl: './search-neighbor-page.component.html',
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
export class SearchNeighborPageComponent implements OnInit, OnDestroy {

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
      title: 'Пошук сусіда',
      description: 'Пояснення як працює створення та розміщення оголошень про пошук сусіда',
      keywords: 'сусід, оголошення, розмістити оголошення, шукаю сусіда, сусідка, квартирант, співмешканець, співмешканка, розділити оренду',
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

