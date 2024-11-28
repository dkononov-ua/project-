import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-host-city',
  templateUrl: './host-city.component.html',
  styleUrls: ['./host-city.component.scss']
})
export class HostCityComponent implements OnInit {

  country: string | null = 'Україні';
  region: string | null = '';
  city: string | null = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Підписка на параметри URL
    this.route.queryParams.subscribe(params => {
      this.region = params['region'];
      this.city = params['city'];
    });
  }

}
