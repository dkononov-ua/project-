import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsChatOpenService } from './services/is-chat-open.service';
import { Location } from '@angular/common';
import { IsAccountOpenService } from './services/is-account-open.service';
import { serverPath } from 'src/app/shared/server-config';
import { Router } from '@angular/router';
import { CloseMenuService } from './services/close-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('locationElement') locationElement!: ElementRef;
  loginForm: any;
  isAccountOpenStatus: boolean = true;
  closeMenuStatus: boolean = true;
  isMenuOpen = true;
  hideMenu = false;

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

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    setTimeout(() => {
      this.hideMenu = true;
    }, 500);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const containerElement = this.el.nativeElement.querySelector('.body-container');
    const cardBoxElement = this.el.nativeElement.querySelector('.noHide');

    if (containerElement.contains(event.target as Node)) {
      if (!cardBoxElement.contains(event.target as Node)) {
        this.closeMenu();
      }
    }
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private isAccountOpenService: IsAccountOpenService,
    private location: Location,
    private router: Router,
    private el: ElementRef,
    private isCloseMenu: CloseMenuService,
  ) { }

  async ngOnInit(): Promise<void> {
    const currentLocation = this.location.path();
    this.getMenuIsOpen();
    this.getAccountIsOpen()
    if (this.isAccountOpenStatus === false) {
      this.compareLocationWithCondition(currentLocation);
    }
    await this.getUserInfo();
  }

  async getUserInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post( serverPath +'/auth', JSON.parse(userJson))
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
          this.router.navigate(['/registration']);
        });
    } else {
      console.log('user not found');
    }
  }

  compareLocationWithCondition(desiredLocation: string): void {
    const location = '/registration';
    if (location === desiredLocation) {
      this.isAccountOpenStatus = false;
    } else {
      this.isAccountOpenStatus = true;
    }
  }

  async getAccountIsOpen() {
    this.isAccountOpenService.isAccountOpen$.subscribe(async isAccountOpen => {
      this.isAccountOpenStatus = isAccountOpen;
      this.cdr.detectChanges();
    });
  }

  async getMenuIsOpen() {
    this.isCloseMenu.closeMenu$.subscribe(async closeMenu => {
      this.closeMenuStatus = closeMenu;
      if (this.closeMenuStatus === false) {
        this.onToggleMenu ();
      }
    });
  }
}
