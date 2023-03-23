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
        console.log(123)
        console.log(response)
        this.data = response;
      });
    }
  }

  notificationsCount: number = 1;
  showNotifications: boolean = false;

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
