import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  indexPage: number = 1;
  isMobile: boolean = false;

  goBack(): void {
    this.location.back();
  }

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor(
    private location: Location,
    private sharedService: SharedService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  ngOnInit() {
    // this.sharedService.setStatusMessage('Помилка на сервері, повторіть спробу');
    // this.sharedService.setStatusMessage('Дискусія видалена');
    // this.sharedService.setStatusMessage('');

  }

}
