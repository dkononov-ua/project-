import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
})
export class InfoComponent implements OnInit {

  userImg: any;

  public selectedFlatId: any | null;

  user = {
    user_id: '',
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

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          console.log(response)
          if (response) {
            this.user.user_id = response.inf?.user_id || '';

            this.user.firstName = response.inf?.firstName || '';
            this.user.lastName = response.inf?.lastName || '';
            this.user.surName = response.inf?.surName || '';
            this.user.email = response.inf?.email || '';
            this.user.password = response.inf?.password || '';
            this.user.dob = response.inf?.dob || '';
            this.user.tell = response.cont?.tell || '';
            this.user.telegram = response.cont?.telegram || '';
            this.user.facebook = response.cont?.facebook || '';
            this.user.instagram = response.cont?.instagram || '';
            this.user.mail = response.cont?.mail || '';
            this.user.viber = response.cont?.viber || '';

            if (response.img && response.img.length > 0) {
              this.userImg = response.img[0].img;
            }
          }
        });
    }
  }

}
