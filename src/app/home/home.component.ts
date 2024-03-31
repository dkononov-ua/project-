import { Component, OnInit } from '@angular/core';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { animations } from '../interface/animation';
import { SelectedFlatService } from '../services/selected-flat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})
export class HomeComponent implements OnInit {
  loginCheck: boolean = false;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
  path_logo = path_logo;
  selectedFlatId: string | null = null;
  houseData: any;
  pathHouse: string = ''
  statusMessage: any;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor(
    private selectedFlatService: SelectedFlatService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectParam();
    } else {
      this.authorization = false;
    }
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        const houseData = localStorage.getItem('houseData');
        if (houseData) {
          this.authorizationHouse = true;
        }
      } else {
        this.authorizationHouse = false;
      }
    });
  }

  // Перегляд статистики комунальних
  goToHouse() {
    if (this.authorizationHouse) {
      // this.statusMessage = 'Переходимо до оселі';
      setTimeout(() => {
        this.router.navigate(['/house/house-info']);
      }, 100);
    } else {
      this.statusMessage = 'Переходимо до вибору оселі';
      setTimeout(() => {
        this.router.navigate(['/house/house-control/selection-house']);
      }, 2000);
    }
  }

}
