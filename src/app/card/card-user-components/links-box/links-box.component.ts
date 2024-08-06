import { Component, OnDestroy, OnInit } from '@angular/core';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-links-box',
  templateUrl: './links-box.component.html',
  styleUrls: ['./links-box.component.scss'],
  animations: [
    animations.swichCard,
    animations.fadeIn,
    animations.appearance,
  ],
})
export class LinksBoxComponent implements OnInit, OnDestroy {

  detail: boolean = false;
  closed: boolean = false;

  toogleOpen() {
    this.detail = !this.detail;
    if (this.detail) {
      setTimeout(() => {
        if (this.currentLocation === '/search/tenant') {
          this.closed = true;
        } else {
          this.closed = false;
        }
      }, 500);
    }
  }

  disabledBtn: boolean = false;
  indexParam: number = 0;
  currentLocation: string = '';
  subscriptions: any[] = [];
  userInfo: any;

  constructor(
    private sharedService: SharedService,
    private statusDataService: StatusDataService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    this.getDataUser();
  }

  // Копіювання параметрів
  copyId() { this.copyToClipboard(this.userInfo.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.userInfo.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.userInfo.mail, 'Пошту скопійовано'); }
  copyViber() { this.copyToClipboard(this.userInfo.viber, 'Viber номер скопійовано'); }
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => { this.sharedService.setStatusMessage(message); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000); })
        .catch((error) => { this.sharedService.setStatusMessage(''); });
    }
  }

  getDataUser() {
    this.subscriptions.push(
      this.statusDataService.userData$.subscribe((data: any) => {
        this.userInfo = data.data;
        this.indexParam = data.index;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
