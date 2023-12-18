import { Component, OnInit } from '@angular/core';
import { IsAccountOpenService } from 'src/app/services/is-account-open.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})

export class UserComponent implements OnInit {

  isAccountOpenStatus: boolean = true;

  constructor(
    private isAccountOpenService: IsAccountOpenService,
  ) { }

  ngOnInit(): void {
    this.sendAccountIsOpen();
  }

  sendAccountIsOpen() {
    this.isAccountOpenStatus = true;
    this.isAccountOpenService.setIsAccountOpen(this.isAccountOpenStatus);
  }
}
