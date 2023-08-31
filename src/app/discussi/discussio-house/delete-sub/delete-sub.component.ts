import { Component, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';

@Component({
  selector: 'app-delete-sub',
  templateUrl: './delete-sub.component.html',
  styleUrls: ['./delete-sub.component.scss']
})
export class DeleteSubComponent implements OnInit {

  selectedSubscriber!: string | null;

  constructor(
    private choseSubscribersService: ChoseSubscribersService,
  ) { }

  ngOnInit(): void {
    this.getSelectedSubs()
  }

  getSelectedSubs() {
    this.choseSubscribersService.selectedSubscriber$.subscribe(subscriberId => {
      if (subscriberId) {
      this.selectedSubscriber = subscriberId;
    }})
  }
}




