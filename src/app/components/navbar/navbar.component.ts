import { Component, OnInit } from '@angular/core';
import { path_logo } from 'src/app/config/server-config';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  path_logo = path_logo;
  selectedFlatId!: string | null;
  counterHouseNewMessage: any;
  counterUserNewMessage: any;
  counterUserNewAgree: any;

  constructor(
    private selectedFlatService: SelectedFlatService
  ) { }

  ngOnInit(): void {
    this.getSelectParam()
  }

  loadCounter(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {

      const counterHouseNewMessage = localStorage.getItem('counterHouseNewMessage');
      if (counterHouseNewMessage) {
        this.counterHouseNewMessage = JSON.parse(counterHouseNewMessage).status;
      } else {
        this.counterHouseNewMessage = 0;
      }

      const counterUserNewMessage = localStorage.getItem('counterUserNewMessage');
      if (counterUserNewMessage) {
        this.counterUserNewMessage = JSON.parse(counterUserNewMessage).status;
      } else {
        this.counterUserNewMessage = 0;
      }

      const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
      if (counterUserNewAgree) {
        this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
        // console.log(this.counterUserNewAgree)
      } else {
        this.counterUserNewAgree = 0;
      }

    } else {
      // console.log('Авторизуйтесь')
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      if (this.selectedFlatId) {
        this.loadCounter();
      }
    });
  }
}
