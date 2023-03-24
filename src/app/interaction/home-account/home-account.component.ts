import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-home-account',
  templateUrl: './home-account.component.html',
  styleUrls: ['./home-account.component.scss']
})
export class HomeAccountComponent implements OnInit {
  data = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    console.log('Пройшла перевірка користувача')
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      // const user = JSON.parse(userJson)
      this.dataService.getData().subscribe((response: any) => {
        this.data.firstName = response.inf.firstName;
        this.data.lastName = response.inf.lastName;
        this.data.surName = response.inf.surName;
        this.data.email = response.inf.email;
      });
    }
  }

  notificationsCount: number = 1;
  showNotifications: boolean = false;

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
