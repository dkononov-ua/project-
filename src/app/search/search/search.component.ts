import { Component, OnInit } from '@angular/core';
import { animations } from '../../interface/animation';
import * as ServerConfig from 'src/app/config/path-config';
import { SelectedFlatService } from '../../services/selected-flat.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    animations.top2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.top4,
    animations.right4,
    animations.right,
    animations.right1,
    animations.right2,
    animations.swichCard,
  ],
})
export class SearchComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  indexPage: number = 0;
  selectedFlatId!: string | null;
  openSearchHouse: boolean = false;
  loading: boolean = false;
  startX = 0;
  authorizationHouse: boolean = true;

  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;

  constructor(
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private location: Location,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
    this.getSelectedFlatId();
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }

  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      this.router.navigate(['/search-house']);
    } else {
      if (this.selectedFlatId) {
        this.router.navigate(['/search-tenants']);
      } else {
        this.router.navigate(['/user/info']);
      }
    }
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      if (flatId) {
        this.selectedFlatId = flatId;
        this.authorizationHouse = true;
      } else {
        this.authorizationHouse = false;
      }
    });
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.openSearchHouse = true;
    } else {
      this.openSearchHouse = false;
    }
  }

  goToSearchTenants() {
    this.router.navigate(['/search-tenants/filter']);


    // if (this.selectedFlatId) {
    //   this.authorizationHouse = true;
    //   this.router.navigate(['/search-tenants/filter']);
    // } else {
    //   this.authorizationHouse = false;
    //   this.sharedService.getAuthorizationHouse();
    // }
  }
}
