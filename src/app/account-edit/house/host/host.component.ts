import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/shared/server-config';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})

export class HostComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  addHouse: boolean = false;
  isMenuOpen = true;
  hideMenu = false;
  selectedFlatId!: string | null;
  indexPage: number = 1;

  onAddHouse () {
    this.addHouse = !this.addHouse;
  }

  onToggleMenu() {
    if (this.isMenuOpen) {
      this.openMenu();
      setTimeout(() => {
        this.hideMenu = !this.hideMenu;
      }, 500);
    } else {
      this.hideMenu = !this.hideMenu;
      setTimeout(() => {
        this.openMenu();
      }, 100);
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
    const containerElement = this.el.nativeElement.querySelector('.container-card');
    const cardBoxElement = this.el.nativeElement.querySelector('.card-box');

    if (containerElement.contains(event.target as Node)) {
      if (!cardBoxElement.contains(event.target as Node)) {
        this.closeMenu();
      }
    }
  }

  constructor(
    private el: ElementRef,
    private selectedFlatService: SelectedFlatService

  ) { }

  ngOnInit(): void {
    this.getSelectParam();
  }

  getSelectParam(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
    });
  }
}
