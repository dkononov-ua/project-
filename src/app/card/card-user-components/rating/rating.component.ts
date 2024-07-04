import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(-120%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateX(-120%)' }))
      ]),
    ]),
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.fadeIn,
  ],
})
export class RatingComponent implements OnInit {
  numberOfReviewsTenant: any;
  numberOfReviewsOwner: any;
  ratingTenant: number | undefined;
  ratingOwner: number | undefined;

  disabledBtn: boolean = false;

  links: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];
  indexParam: number = 0;

  detail: boolean = false;
  toogleOpen() {
    this.detail = !this.detail;
  }

  toggleLinks(index: number) {
    // Закрити всі меню, крім того, що має переданий індекс
    this.menu.forEach((_, i) => {
      if (i !== index) {
        this.menu[i] = false;
        this.links[i] = false;
      }
    });

    // Відкрити/закрити меню за переданим індексом
    this.links[index] = !this.links[index];
    this.disabledBtn = true;
    if (this.menu[index]) {
      setTimeout(() => {
        this.menu[index] = !this.menu[index];
        this.disabledBtn = false;
      }, 600);
    } else {
      this.menu[index] = !this.menu[index];
      this.disabledBtn = false;
    }
  }

  currentLocation: string = '';

  user: any;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  constructor(
    private sharedService: SharedService,
    private statusDataService: StatusDataService,
    private location: Location,

  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    this.statusDataService.userData$.subscribe((data: any) => {
      // console.log(data);
      this.user = data.data;
      this.indexParam = data.index;
      if (this.user && this.indexParam === 0) {
        this.getRatingTenant();
        this.getRatingOwner();
      }
      if (this.user && this.indexParam === 1) {
        this.getRatingOwner();
      }
      if (this.user && this.indexParam === 2 || this.indexParam === 3) {
        this.getRatingTenant();
      }
    });
  }

  // Копіювання параметрів
  copyId() { this.copyToClipboard(this.user.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.user.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.user.mail, 'Пошту скопійовано'); }
  copyViber() { this.copyToClipboard(this.user.viber, 'Viber номер скопійовано'); }
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => { this.sharedService.setStatusMessage(message); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000); })
        .catch((error) => { this.sharedService.setStatusMessage(''); });
    }
  }

  //Запитую рейтинг орендаря
  async getRatingTenant(): Promise<any> {
    const response = await this.sharedService.getRatingTenant(this.user.user_id);
    // console.log(response);
    this.ratingTenant = response.ratingTenant;
    this.numberOfReviewsTenant = response.numberOfReviewsTenant;
  }

  //Запитую рейтинг власника
  async getRatingOwner(): Promise<any> {
    const response = await this.sharedService.getRatingOwner(this.user.user_id);
    // console.log(response);
    this.ratingOwner = response.ratingOwner;
    this.numberOfReviewsOwner = response.numberOfReviewsOwner;
  }

}

