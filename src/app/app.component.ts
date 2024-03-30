import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { IsAccountOpenService } from './services/is-account-open.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';
import { CloseMenuService } from './services/close-menu.service';
import { SharedService } from './services/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  path_logo = path_logo;
  statusMessage: string = '';
  @ViewChild('locationElement') locationElement!: ElementRef;
  loginForm: any;
  loggedInAccount: boolean = true;
  closeMenuStatus: boolean = true;
  isMenuOpen = true;
  hideMenu = false;
  indexPage: number = 0;

  onToggleMenu() {
    if (this.isMenuOpen) {
      this.openMenu();
      setTimeout(() => {
        this.hideMenu = true;
      }, 310);
    } else {
      this.hideMenu = false;
      setTimeout(() => {
        this.openMenu();
      }, 0);
    }
  }

  loading: boolean = true;

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    setTimeout(() => {
      this.hideMenu = true;
    }, 500);
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private isAccountOpenService: IsAccountOpenService,
    private location: Location,
    private router: Router,
    private el: ElementRef,
    private isCloseMenu: CloseMenuService,
    private sharedService: SharedService,
  ) {
    this.sharedService.getStatusMessage().subscribe((message: string) => {
      this.statusMessage = message;
    });
  }

  async ngOnInit(): Promise<void> {
    const currentLocation = this.location.path();
    await this.compareLocationWithCondition(currentLocation);
    if (this.loggedInAccount === false) {
      await this.getAccountIsOpen()
      this.loading = false;
    } else {
      this.loggedInAccount = true;
      await this.getMenuIsOpen();
      await this.getUserInfo();
      this.loading = false;
    }
  }

  async getUserInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/auth', JSON.parse(userJson))
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
          this.router.navigate(['/registration']);
        });
    } else {
      console.log('user not found');
    }
  }

  async compareLocationWithCondition(currentLocation: string): Promise<void> {
    const location = '/registration';
    if (location === currentLocation) {
      this.loggedInAccount = false;
    } else {
      this.loggedInAccount = true;
    }
  }

  async getAccountIsOpen() {
    this.isAccountOpenService.isAccountOpen$.subscribe(async isAccountOpen => {
      this.loggedInAccount = isAccountOpen;
      this.cdr.detectChanges();
    });
  }

  async getMenuIsOpen() {
    this.isCloseMenu.closeMenu$.subscribe(async closeMenu => {
      this.closeMenuStatus = closeMenu;
      if (this.closeMenuStatus === false) {
        this.onToggleMenu();
      }
    });
  }
}
