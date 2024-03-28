import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  indexPage: number = 1;

  goBack(): void {
    this.location.back();
  }
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }
  constructor(private location: Location,
  ) { }

  ngOnInit() {
  }

}
