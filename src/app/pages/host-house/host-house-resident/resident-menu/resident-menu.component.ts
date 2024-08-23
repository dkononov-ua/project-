import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-resident-menu',
  templateUrl: './resident-menu.component.html',
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
export class ResidentMenuComponent implements OnInit, OnDestroy {

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
      title: 'Мешканці оселі',
      description: 'Доступ до інформації оселі та статистики, взаємодія між орендарями та орендодавцем. Відгуки та рейтинг. Створення та контроль за угодами оренди.',
      keywords: 'мешканці, контроль оселі, доступ, система рейтингу орендаря, орендодавця, надання доступу, дозволи',
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
