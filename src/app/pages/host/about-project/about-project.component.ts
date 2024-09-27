import { Component, ElementRef, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { AuthGoogleService } from '../../host-auth/auth-google.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about-project',
  templateUrl: './about-project.component.html',
  styleUrls: ['./../../info_page.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.bot5,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.appearance,
  ],
})
export class AboutProjectComponent implements OnInit {

  goBack(): void {
    this.location.back();
  }

  text: boolean = false;
  changeText() {
    setInterval(() => {
      this.text = !this.text;
    }, 5000);
  }
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  currentStep: number = 0;
  currentScenario: number = 1;
  statusMessage: string | undefined;
  gmail: string = 'discussio.inc@gmail.com';
  agreementAccepted: boolean = false;

  containers: { [key: number]: boolean } = {
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  };

  authorization: boolean = false;
  subscriptions: any[] = [];
  isMobile: boolean = false;

  scrollToAnchor(anchor: number): void {
    this.containers[anchor] = true;
    setTimeout(() => {
      const element = this.el.nativeElement.querySelector(`#conteiner${anchor}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }

  constructor(
    private el: ElementRef,
    private sharedService: SharedService,
    private authGoogleService: AuthGoogleService,
    private location: Location,

  ) { }

  ngOnInit() {
    this.getCheckDevice();
    this.changeText();
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
    this.scrollToAnchor(0);
  }

  // Перевірка на пристрій
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  changeStep(step: number): void {
    this.currentStep = step;
  }

  openGoogleRegistration() {
    if (!this.agreementAccepted) {
      this.sharedService.setStatusMessage('Треба ознайомитись з угодою користувача');
      setTimeout(() => {
        this.sharedService.setStatusMessage('');
      }, 1000);
    } else {
      this.authGoogleService.singAuthGoogle('registration');
    }
  }

  openGoogleAuth() {
    this.authGoogleService.singAuthGoogle('login');
  }

  logout() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    this.sharedService.setStatusMessage('Дані кукі та кешу очищені');
    setTimeout(() => {
      this.sharedService.setStatusMessage('');
      location.reload();
    }, 1500);
  }

}
