import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-housing-parameters',
  templateUrl: './housing-parameters.component.html',
  styleUrls: ['./housing-parameters.component.scss'],
})
export class HousingParametersComponent implements OnInit {
  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: any) => {
    });
  }
}

