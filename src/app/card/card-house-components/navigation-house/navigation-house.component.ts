import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { NavigationEnd, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MenuService } from 'src/app/services/menu.service';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { MissingParamsService } from 'src/app/pages/host-house/host-house-edit/missing-params.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-navigation-house',
  templateUrl: './navigation-house.component.html',
  styleUrls: ['./../../navigation.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ]),
    ]),
    trigger('cardAnimationUp', [
      transition('void => *', [
        style({ transform: 'translateY(-30vh)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(-30vh)' }))
      ]),
    ]),
    animations.appearance,

  ],
})

export class NavigationHouseComponent implements OnInit, OnDestroy {
  currentSectionIndex: number = -1;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  goToControl() {
    this.router.navigate(['/house/control/add']);
    setTimeout(() => {
      this.closeToogleMenu();
    }, 100);
  }

  disabledBtn: boolean = false;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

  toggleAllMenu(index: number) {
    this.linkOpen[index] = !this.linkOpen[index];
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

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  indexPage: number = 0;
  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  counterHouseNewMessage: any;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;
  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  selectedFlatId!: string | null;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  section: boolean[] = [false, false, false, false, false, false, false, false, false, false, false];
  currentLocation: string = '';
  imgFlat: any;

  closeToogleMenu() {
    // console.log('closeToogleMenu')
    this.menuService.toogleMenu(false);
  }

  setSectionFromBtn(index: number) {
    this.section = this.section.map((isOpen, i) => {
      if (i === index) {
        return !isOpen;
      }
      return false;
    });
  }

  setSection(index: number) {
    if (this.currentSectionIndex !== index) {
      this.section = this.section.map((isOpen, i) => {
        this.currentSectionIndex = index;
        if (i === index) {
          return !isOpen;
        }
        return false;
      });
    }
  }

  constructor(
    private counterService: CounterService,
    private sharedService: SharedService,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private menuService: MenuService,
    private location: Location,
    private dataService: DataService,
    private missingParamsService: MissingParamsService,
    private loaderService: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentLocation = event.urlAfterRedirects;
      this.checkLocation();
    });
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.checkLocation();
  }

  checkLocation() {
    const sectionMap = [
      { path: '/house/info', section: 1 },
      { path: '/house/agree', section: 2 },
      { path: '/house/control', section: 3 },
      { path: '/house/discus', section: 4 },
      { path: '/chat-house', section: 5 },
      { path: '/house/edit', section: 6 },
      { path: '/house/search', section: 7 },
      { path: '/house/objects', section: 8 },
      { path: '/house/residents', section: 9 },
      { path: '/house/communal', section: 10 },
    ];
    this.currentLocation = this.location.path();
    const matchedSection = sectionMap.find(entry => this.currentLocation.includes(entry.path));
    this.setSection(matchedSection ? matchedSection.section : -1);
  }


  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getSelectParam();
    } else {
      this.authorization = false;
    }
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  goToEdit() {
    if (this.isMobile) {
      this.router.navigate(['/edit-house/instruction']);
    } else {
      this.router.navigate(['/edit-house/address']);
    }
  }

  goToComun() {
    if (this.isMobile) {
      this.router.navigate(['/communal/about']);
    } else {
      this.router.navigate(['/communal/about']);
    }
  }


  getSelectParam() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId;
        if (this.selectedFlatId) {
          this.loadDataFlat();
        }
      })
    );
  }

  // Беру дані своєї оселі з локального сховища
  async loadDataFlat(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
      if (Array.isArray(this.houseData.imgs) && this.houseData.imgs.length > 0) {
        this.imgFlat = this.serverPath + this.pathPhotoFlat + this.houseData.imgs[0].img;
      } else {
        this.imgFlat = undefined;
      }
    } else {
      this.houseData = undefined;
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
      if (this.acces_discuss === 1) {
        await this.getHouseDiscussioCount();
      }
      if (this.acces_subs === 1) {
        await this.getHouseSubscribersCount();
        await this.getHouseSubscriptionsCount();
      } if (this.acces_flat_chats === 1) {
        await this.getHouseNewMessage();
      }
    } else {
      await this.getHouseDiscussioCount();
      await this.getHouseSubscribersCount();
      await this.getHouseSubscriptionsCount();
      await this.getHouseNewMessage();
    }
  }

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    // await this.counterService.getHouseSubscribersCount(0);
    this.subscriptions.push(
      this.counterService.counterHouseSubscribers$.subscribe(data => {
        this.counterHouseSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    // await this.counterService.getHouseSubscriptionsCount(0);
    this.subscriptions.push(
      this.counterService.counterHouseSubscriptions$.subscribe(data => {
        this.counterHouseSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    // await this.counterService.getHouseDiscussioCount(0);
    this.subscriptions.push(
      this.counterService.counterHouseDiscussio$.subscribe(data => {
        this.counterHouseDiscussio = Number(data);
      })
    );
  }

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    await this.counterService.getHouseNewMessage(this.selectedFlatId);
    this.subscriptions.push(
      this.counterService.counterHouseNewMessage$.subscribe(data => {
        const counterHouseNewMessage: any = data
        if (counterHouseNewMessage.status !== false) {
          this.counterHouseNewMessage = Number(counterHouseNewMessage.status)
        } else {
          this.counterHouseNewMessage = 0;
        }
      })
    );
  }

  activateHouseProfile() {
    this.missingParamsService.askActivateHouseProfile();
    this.closeToogleMenu()
  }

  deactivateHouseProfile() {
    this.missingParamsService.askDeactivateHouseProfile();
    this.closeToogleMenu()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  logoutHouse() {
    this.loaderService.setLoading(true);
    this.closeToogleMenu();
    setTimeout(() => {
      this.sharedService.getlogoutHouse();
    }, 100);
  }



}


