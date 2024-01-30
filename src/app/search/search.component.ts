import { Component, OnInit } from '@angular/core';
import { animations } from '../interface/animation';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SelectedFlatService } from '../services/selected-flat.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right4,
    animations.right,
    animations.right1,
    animations.right2,
    animations.swichCard,
  ],
})
export class SearchComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  indexPage: number = 0;
  selectedFlatId!: string | null;
  openSearchHouse: boolean = false;
  loading: boolean = false;

  constructor(private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.getSelectedFlatId();
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      if (flatId) { this.selectedFlatId = flatId; }
    });
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.openSearchHouse = true;
    } else {
      this.openSearchHouse = false;
    }
  }
}
