import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-house-discuss-page',
  templateUrl: './house-discuss-page.component.html',
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
export class HouseDiscussPageComponent implements OnInit, OnDestroy {

  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private sharedService: SharedService,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.updateMetaTagsInService();
    this.getCheckDevice();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Система Підписок та Дискусій та як це працює для оселі',
      description: 'В Діскусіо діє система підписок та дискусій. Вона призначена для вашої безпеки та безпеки ваших даних.',
      keywords: 'підписка, бажана оселя, підписники, дискусія, система дискусій, пояснення, послідовність, отримання підписників орендарів, черга на оренду оселі',
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
