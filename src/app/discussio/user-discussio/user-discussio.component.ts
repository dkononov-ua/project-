import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-discussio',
  templateUrl: './user-discussio.component.html',
  styleUrls: ['./user-discussio.component.scss']
})
export class UserDiscussioComponent implements OnInit {

  isOpen = true;
  isOnline = true;
  isOffline = false;
  idleTimeout: any;
  isCopied = false;

  userImg: any;

  public selectedFlatId: any | null;

  user = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    tell: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  constructor(private dataService: DataService, private http: HttpClient) { }

  rating: number = 5;

  onClick(value: number) {
    this.rating = value;
  }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {

          this.user.firstName = response.userData.inf.firstName;
          this.user.lastName = response.userData.inf.lastName;
          this.user.surName = response.userData.inf.surName;
          this.user.email = response.userData.inf.email;
          this.user.password = response.userData.inf.password;
          this.user.dob = response.userData.inf.dob;

          this.user.tell = response.userData.cont.tell;
          this.user.telegram = response.userData.cont.telegram;
          this.user.facebook = response.userData.cont.facebook;
          this.user.instagram = response.userData.cont.instagram;
          this.user.mail = response.userData.cont.mail;
          this.user.viber = response.userData.cont.viber;
        });

        this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
          .subscribe((response: any) => {
            if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }});
      }
    }
  }
}
